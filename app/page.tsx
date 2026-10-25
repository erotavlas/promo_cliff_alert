"use client";

import AddButton from "@/components/AddButton";
import SubscriptionRow from "@/components/SubscriptionRow";
import { missingSampleSubscriptions } from "@/lib/sampleData";
import { daysLeft, needsAttention } from "@/lib/status";
import { useSubscriptions } from "@/lib/storage";

export default function ActivePage() {
  const { subscriptions, loaded, addMany } = useSubscriptions();
  const active = subscriptions.filter((s) => s.status === "active");
  const attention = active
    .filter((s) => needsAttention(s))
    .sort((a, b) => daysLeft(a.promoEndDate) - daysLeft(b.promoEndDate));

  // Each subscription appears once: in "Needs attention" or in the list below it.
  const attentionIds = new Set(attention.map((s) => s.id));
  const others = active.filter((s) => !attentionIds.has(s.id));

  const missingDemo = missingSampleSubscriptions(subscriptions.map((s) => s.name));
  const loadDemo = () => addMany(missingDemo);

  return (
    <div>
      {loaded && active.length === 0 ? (
        <div className="mt-24 text-center">
          <p className="text-lg">Get started — add a current or new subscription</p>
          <p className="mt-2 text-sm text-muted">Tap the + button below.</p>
          {missingDemo.length > 0 && (
            <button
              onClick={loadDemo}
              className="mt-6 text-sm text-muted underline underline-offset-4"
            >
              or load demo data
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {attention.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                Needs attention
              </h2>
              <div className="space-y-3">
                {attention.map((s) => (
                  <SubscriptionRow key={s.id} sub={s} />
                ))}
              </div>
            </section>
          )}
          {others.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {attention.length > 0 ? "Other subscriptions" : "All subscriptions"}
              </h2>
              <div className="space-y-3">
                {others.map((s) => (
                  <SubscriptionRow key={s.id} sub={s} />
                ))}
              </div>
            </section>
          )}
          {loaded && active.length > 0 && missingDemo.length > 0 && (
            <button
              onClick={loadDemo}
              className="block text-xs text-muted underline underline-offset-4"
            >
              Load demo data
            </button>
          )}
        </div>
      )}
      <AddButton />
    </div>
  );
}
