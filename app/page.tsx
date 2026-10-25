"use client";

import AddButton from "@/components/AddButton";
import SubscriptionRow from "@/components/SubscriptionRow";
import { sampleSubscriptions } from "@/lib/sampleData";
import { daysLeft, needsAttention } from "@/lib/status";
import { useSubscriptions } from "@/lib/storage";

export default function ActivePage() {
  const { subscriptions, loaded, addMany } = useSubscriptions();
  const active = subscriptions.filter((s) => s.status === "active");
  const attention = active
    .filter((s) => needsAttention(s))
    .sort((a, b) => daysLeft(a.promoEndDate) - daysLeft(b.promoEndDate));

  const loadDemo = () => addMany(sampleSubscriptions());

  return (
    <div>
      {loaded && active.length === 0 ? (
        <div className="mt-24 text-center">
          <p className="text-lg">Get started — add a current or new subscription</p>
          <p className="mt-2 text-sm text-muted">Tap the + button below.</p>
          <button
            onClick={loadDemo}
            className="mt-6 text-sm text-muted underline underline-offset-4"
          >
            or load demo data
          </button>
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
          {active.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                All subscriptions
              </h2>
              <div className="space-y-3">
                {active.map((s) => (
                  <SubscriptionRow key={s.id} sub={s} />
                ))}
              </div>
            </section>
          )}
          {loaded && active.length > 0 && (
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
