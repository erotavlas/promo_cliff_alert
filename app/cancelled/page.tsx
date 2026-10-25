"use client";

import BrandIcon from "@/components/BrandIcon";
import { useSubscriptions } from "@/lib/storage";

export default function CancelledPage() {
  const { subscriptions, loaded, restore, remove } = useSubscriptions();
  const cancelled = subscriptions.filter((s) => s.status === "cancelled");

  if (!loaded) return null;
  if (cancelled.length === 0)
    return <p className="mt-24 text-center text-muted">Nothing cancelled.</p>;

  return (
    <ul className="space-y-3">
      {cancelled.map((s) => (
        <li key={s.id} className="rounded-2xl bg-card p-4">
          <div className="flex items-center gap-3">
            <BrandIcon name={s.name} domain={s.logoDomain} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{s.name}</div>
              <div className="text-xs text-muted">Cancelled {s.cancelledAt}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => restore(s.id)}
              className="rounded-xl bg-card-hi py-2 text-sm font-medium"
            >
              Restore
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${s.name} permanently? This can't be undone.`))
                  remove(s.id);
              }}
              className="rounded-xl bg-card-hi py-2 text-sm font-medium text-bad"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
