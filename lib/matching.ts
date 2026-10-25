import type { MatchResult, NegotiationResult, Subscription } from "./types";

export const EQUIVALENT_OVERLAP = 0.5; // starting value; tune against the seeded data
const CLOSEST_LIMIT = 3;

const STOPWORDS = new Set(["the", "and", "with", "for", "plan", "per"]);

const norm = (s: string) => s.trim().toLowerCase();

function tokens(text: string): Set<string> {
  return new Set(
    norm(text)
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 3 && !STOPWORDS.has(t)),
  );
}

type Plan = Pick<Subscription, "planFeatures" | "planText">;

function planTokens(s: Plan): Set<string> {
  const text =
    s.planFeatures.length > 0
      ? s.planFeatures.map((f) => `${f.label} ${f.value}`).join(" ")
      : s.planText;
  return tokens(text);
}

// Share of the smaller feature set that also appears in the other one (0 to 1).
function featureOverlap(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / Math.min(a.size, b.size);
}

function sameProvider(sub: Pick<Subscription, "name">, r: NegotiationResult) {
  const name = norm(sub.name);
  const provider = norm(r.provider);
  return name.includes(provider) || provider.includes(name);
}

function sameCategory(sub: Pick<Subscription, "category">, r: NegotiationResult) {
  return norm(sub.category) === norm(r.category);
}

const byFinalPrice = (a: NegotiationResult, b: NegotiationResult) =>
  a.finalPrice - b.finalPrice;

export function matchResults(
  sub: Pick<Subscription, "name" | "category"> & Plan,
  all: NegotiationResult[],
): MatchResult {
  const userTokens = planTokens(sub);

  // People who ended up paying more are never shown.
  const candidates = all.filter((r) => r.finalPrice <= r.startPrice);

  const scored = candidates.map((r) => {
    const provider = sameProvider(sub, r);
    const category = sameCategory(sub, r);
    const overlap = featureOverlap(userTokens, planTokens({ planFeatures: r.planFeatures, planText: "" }));
    return {
      r,
      provider,
      category,
      overlap,
      score: (provider ? 2 : 0) + (category ? 1 : 0) + overlap,
    };
  });

  const equivalent = scored.filter(
    (x) => x.provider && x.category && x.overlap >= EQUIVALENT_OVERLAP,
  );
  if (equivalent.length > 0) {
    return { kind: "equivalent", results: equivalent.map((x) => x.r).sort(byFinalPrice) };
  }

  const close = scored
    .filter((x) => x.provider || x.category)
    .sort((a, b) => b.score - a.score)
    .slice(0, CLOSEST_LIMIT);
  if (close.length > 0) {
    return { kind: "closest", results: close.map((x) => x.r).sort(byFinalPrice) };
  }

  return { kind: "none", results: [] };
}
