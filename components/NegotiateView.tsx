"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import BrandIcon from "@/components/BrandIcon";
import negotiations from "@/data/negotiations.json";
import { matchResults } from "@/lib/matching";
import { currentPrice, money } from "@/lib/pricing";
import { useSubscriptions } from "@/lib/storage";
import type { NegotiationResult } from "@/lib/types";

const HEADINGS = {
  equivalent: "What others with an equivalent plan negotiated",
  closest: "No exact match. Here are the closest plans",
  none: "No results yet",
} as const;

export default function NegotiateView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { subscriptions, loaded } = useSubscriptions();
  const [selected, setSelected] = useState<string | null>(null);
  const sub = subscriptions.find((s) => s.id === id);

  if (!loaded) return null;
  if (!sub)
    return (
      <div className="mt-16 text-center">
        <p>Subscription not found.</p>
        <Link href="/" className="mt-3 inline-block text-muted underline">
          Back to your list
        </Link>
      </div>
    );

  const { kind, results } = matchResults(sub, negotiations as NegotiationResult[]);
  const scriptHref = `/subscription/${sub.id}/script${selected ? `?result=${selected}` : ""}`;

  return (
    <div className="space-y-5 pb-8">
      <Link href={`/subscription/${sub.id}`} className="text-sm text-muted">
        ← Back
      </Link>

      <header className="flex items-center gap-3 pt-2">
        <BrandIcon name={sub.name} domain={sub.logoDomain} />
        <div>
          <h1 className="text-xl font-bold">Negotiate {sub.name}</h1>
          <p className="text-sm text-muted">
            You pay {money(currentPrice(sub))} now, {money(sub.fullPrice)} after
            the promo
          </p>
        </div>
      </header>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        {HEADINGS[kind]}
      </h2>

      {kind === "none" ? (
        <p className="rounded-2xl bg-card p-4 text-muted">
          Nobody has shared a result for a plan like this yet. You can still
          create a script that asks to keep your current promo price of{" "}
          {money(currentPrice(sub))} or lower.
        </p>
      ) : (
        <ul className="space-y-3">
          {results.map((r) => {
            const on = selected === r.id;
            return (
              <li key={r.id}>
                <button
                  onClick={() => setSelected(on ? null : r.id)}
                  aria-pressed={on}
                  className={`w-full rounded-2xl bg-card p-4 text-left ring-2 ${
                    on ? "ring-ink" : "ring-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{r.provider}</div>
                      <div className="text-xs text-muted">@{r.username}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted">
                        started {money(r.startPrice)}
                      </div>
                      <div className="text-2xl font-bold text-good">
                        {money(r.finalPrice)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {r.planFeatures.map((f) => f.value).join(" · ")}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-muted">
                    Sample data
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        onClick={() => router.push(scriptHref)}
        className="w-full rounded-xl bg-ink py-3 font-semibold text-page"
      >
        {kind === "none"
          ? "Create script"
          : selected
            ? "Create script for this price"
            : "Create script (no result selected)"}
      </button>
    </div>
  );
}
