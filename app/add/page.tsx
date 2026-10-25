"use client";

import { useRouter } from "next/navigation";
import SubscriptionForm from "@/components/SubscriptionForm";
import { withPlanFeatures } from "@/lib/planClient";
import { useSubscriptions } from "@/lib/storage";

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
