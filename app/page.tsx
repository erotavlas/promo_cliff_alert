"use client";

import AddButton from "@/components/AddButton";
import SubscriptionRow from "@/components/SubscriptionRow";
import { useSubscriptions } from "@/lib/storage";

export default function ActivePage() {
  const { subscriptions, loaded } = useSubscriptions();
  const active = subscriptions.filter((s) => s.status === "active");

  return (
    <div>
      {loaded && active.length === 0 ? (
        <div className="mt-24 text-center">
          <p className="text-lg">Get started — add a current or new subscription</p>
          <p className="mt-2 text-sm text-muted">Tap the + button below.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((s) => (
            <SubscriptionRow key={s.id} sub={s} />
          ))}
        </div>
      )}
      <AddButton />
    </div>
  );
}
