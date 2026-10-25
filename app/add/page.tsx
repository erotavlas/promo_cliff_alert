"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SubscriptionForm from "@/components/SubscriptionForm";
import { duplicateReason } from "@/lib/duplicates";
import { withPlanFeatures } from "@/lib/planClient";
import { useSubscriptions } from "@/lib/storage";

export default function AddPage() {
  const router = useRouter();
  const { subscriptions, add } = useSubscriptions();

  return (
    <div>
      <Link href="/" className="text-sm text-muted">
        ← Back
      </Link>
      <h1 className="mb-4 mt-2 text-2xl font-bold">Add subscription</h1>
      <SubscriptionForm
        submitLabel="Save"
        onSubmit={async (input) => {
          const reason = duplicateReason(input, subscriptions);
          if (reason) throw new Error(reason);
          add(await withPlanFeatures(input));
          router.push("/");
        }}
      />
    </div>
  );
}
