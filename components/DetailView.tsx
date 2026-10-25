"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import ContactLink from "@/components/ContactLink";
import PriceComparison from "@/components/PriceComparison";
import { daysLabel, daysLeft, statusColor, timeAsSubscriber } from "@/lib/status";
import { money } from "@/lib/pricing";
import { useSubscriptions } from "@/lib/storage";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="text-muted">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { subscriptions, loaded, cancel } = useSubscriptions();
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

  const days = daysLeft(sub.promoEndDate);

  return (
    <div className="space-y-5 pb-8">
      <Link href="/" className="text-sm text-muted">
        ← Back
      </Link>

      <header className="flex items-center gap-4 pt-2">
        <BrandIcon name={sub.name} domain={sub.logoDomain} size={56} />
        <div>
          <h1 className="text-2xl font-bold">{sub.name}</h1>
          <p className="text-sm" style={{ color: statusColor(days) }}>
            {daysLabel(days)}
          </p>
        </div>
      </header>

      <PriceComparison sub={sub} />

      <section className="divide-y divide-card-hi rounded-2xl bg-card px-4">
        <Row label="Subscriber for">{timeAsSubscriber(sub.startDate)}</Row>
        <Row label="Start date">{sub.startDate}</Row>
        <Row label="Promo ends">{sub.promoEndDate}</Row>
        <Row label="Discount">{money(sub.discount)} / month</Row>
        <Row label="Category">{sub.category}</Row>
        <Row label="Contract">
          {sub.isContract ? `${sub.contractMonths} months` : "No contract"}
        </Row>
        <Row label="Contact">
          <ContactLink contact={sub.contact} />
        </Row>
      </section>

      {(sub.planFeatures.length > 0 || sub.planText) && (
        <section className="rounded-2xl bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Plan
          </h2>
          {sub.planFeatures.length > 0 ? (
            <ul className="space-y-1">
              {sub.planFeatures.map((f) => (
                <li key={f.label} className="flex justify-between gap-4">
                  <span className="text-muted">{f.label}</span>
                  <span className="text-right">{f.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{sub.planText}</p>
          )}
        </section>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/subscription/${sub.id}/negotiate`}
          className="col-span-2 rounded-xl bg-ink py-3 text-center font-semibold text-page"
        >
          Negotiate
        </Link>
        <Link
          href={`/subscription/${sub.id}/edit`}
          className="rounded-xl bg-card py-3 text-center"
        >
          Edit
        </Link>
        <button
          onClick={() => {
            if (window.confirm(`Cancel ${sub.name}? You can restore it from the Cancelled tab.`)) {
              cancel(sub.id);
              router.push("/");
            }
          }}
          className="rounded-xl bg-card py-3 text-bad"
        >
          Cancel subscription
        </button>
      </div>
    </div>
  );
}
