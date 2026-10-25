import { PlanResultSchema } from "./planTypes";
import type { SubscriptionInput } from "./types";

// Asks the server to turn the typed plan description into structured features.
// Throws a plain message on failure so the form keeps what was typed.
export async function withPlanFeatures(
  input: SubscriptionInput,
): Promise<SubscriptionInput> {
  if (!input.planText) return { ...input, planFeatures: [], logoDomain: input.logoDomain };
  let res: Response;
  try {
    res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        category: input.category,
        planText: input.planText,
      }),
    });
  } catch {
    throw new Error(
      "Couldn't reach the server to read your plan. Check your connection and try again.",
    );
  }
  if (!res.ok) {
    throw new Error(
      "Couldn't read your plan description right now. Your entries are kept; try Save again.",
    );
  }
  const plan = PlanResultSchema.parse(await res.json());
  return { ...input, planFeatures: plan.features, logoDomain: plan.domain || undefined };
}
