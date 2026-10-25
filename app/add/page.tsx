"use client";

import { useRouter } from "next/navigation";
import SubscriptionForm from "@/components/SubscriptionForm";
import { PlanResultSchema } from "@/lib/planTypes";
import { useSubscriptions } from "@/lib/storage";
import type { SubscriptionInput } from "@/lib/types";

// Asks the server to turn the typed plan description into structured features.
// Throws a plain message on failure so the form keeps what was typed.
async function withPlanFeatures(input: SubscriptionInput): Promise<SubscriptionInput> {
  if (!input.planText) return input;
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
    throw new Error("Couldn't reach the server to read your plan. Check your connection and try again.");
  }
  if (!res.ok) {
    throw new Error("Couldn't read your plan description right now. Your entries are kept; try Save again.");
  }
  const plan = PlanResultSchema.parse(await res.json());
  return { ...input, planFeatures: plan.features, logoDomain: plan.domain || undefined };
}

export default function AddPage() {
  const router = useRouter();
  const { add } = useSubscriptions();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Add subscription</h1>
      <SubscriptionForm
        submitLabel="Save"
        onSubmit={async (input) => {
          add(await withPlanFeatures(input));
          router.push("/");
        }}
      />
    </div>
  );
}
