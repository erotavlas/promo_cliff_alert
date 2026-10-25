"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SubscriptionForm from "@/components/SubscriptionForm";
import { duplicateReason } from "@/lib/duplicates";
import { withPlanFeatures } from "@/lib/planClient";
import { useSubscriptions } from "@/lib/storage";
import type { SubscriptionInput } from "@/lib/types";

export default function EditView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { subscriptions, loaded, update } = useSubscriptions();
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

  const initial: SubscriptionInput = {
    name: sub.name,
    category: sub.category,
    customCategory: sub.customCategory,
    planText: sub.planText,
    planFeatures: sub.planFeatures,
    logoDomain: sub.logoDomain,
    contact: sub.contact,
    startDate: sub.startDate,
    isContract: sub.isContract,
    contractMonths: sub.contractMonths,
    fullPrice: sub.fullPrice,
    discount: sub.discount,
    promoEndDate: sub.promoEndDate,
  };

  return (
    <div>
      <Link href={`/subscription/${sub.id}`} className="text-sm text-muted">
        ← Back
      </Link>
      <h1 className="mb-4 mt-2 text-2xl font-bold">Edit {sub.name}</h1>
      <SubscriptionForm
        initial={initial}
        submitLabel="Save changes"
        cancelHref={`/subscription/${sub.id}`}
        onSubmit={async (input) => {
          const reason = duplicateReason(input, subscriptions, sub.id);
          if (reason) throw new Error(reason);
          // Only re-ask the LLM when the plan text or provider changed (or was never structured).
          const needsPlan =
            input.planText !== sub.planText ||
            input.name !== sub.name ||
            (input.planText !== "" && sub.planFeatures.length === 0);
          update(sub.id, needsPlan ? await withPlanFeatures(input) : input);
          router.push(`/subscription/${sub.id}`);
        }}
      />
    </div>
  );
}
