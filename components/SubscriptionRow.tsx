import Link from "next/link";
import type { Subscription } from "@/lib/types";
import { currentPrice, money, newPrice } from "@/lib/pricing";
import BrandIcon from "./BrandIcon";

export default function SubscriptionRow({ sub }: { sub: Subscription }) {
  const now = currentPrice(sub);
  const after = newPrice(sub);
  const arrow = after > now ? "▲" : after < now ? "▼" : "";
  const arrowColor = after > now ? "text-bad" : "text-good";

  return (
    <Link
      href={`/subscription/${sub.id}`}
      className="flex items-center gap-3 rounded-2xl bg-card p-4"
    >
      <BrandIcon name={sub.name} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{sub.name}</div>
        <div className="text-xs text-muted">
          Promo ends {sub.promoEndDate}
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-good">{money(now)}</div>
        <div className="text-xs text-muted">
          then {money(after)}{" "}
          <span className={arrowColor}>{arrow}</span>
        </div>
      </div>
    </Link>
  );
}
