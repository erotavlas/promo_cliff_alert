import type { Subscription, SubscriptionInput } from "./types";

// A household has one internet and one TV plan; everything else is one per service.
// Mobile lines are the exception: several lines are normal, as long as each has its own name.
const ONE_PER_HOUSEHOLD = ["internet", "tv"];

const norm = (s: string) => s.trim().toLowerCase();

// Returns a plain-language reason the input can't be added, or null if it's fine.
// Cancelled subscriptions never count; pass selfId when editing so a plan doesn't clash with itself.
export function duplicateReason(
  input: Pick<SubscriptionInput, "name" | "category">,
  existing: Subscription[],
  selfId?: string,
): string | null {
  const others = existing.filter((s) => s.status === "active" && s.id !== selfId);
  const category = norm(input.category);

  if (ONE_PER_HOUSEHOLD.includes(category)) {
    const clash = others.find((s) => norm(s.category) === category);
    if (clash)
      return `You already have an active ${input.category} subscription (${clash.name}). Edit it, or cancel it first.`;
  }
  const sameName = others.find((s) => norm(s.name) === norm(input.name));
  if (sameName)
    return `You already have an active subscription named "${sameName.name}". Edit it, or give this one a different name.`;
  return null;
}
