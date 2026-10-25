import type { Subscription } from "@/lib/types";
import { currentPrice, money, newPrice, priceChange } from "@/lib/pricing";

function Card({
  label,
  monthly,
  color,
  arrow,
  arrowColor,
}: {
  label: string;
  monthly: number;
  color: string;
  arrow?: string;
  arrowColor?: string;
}) {
  return (
    <div className="flex-1 rounded-2xl bg-card p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${color}`}>
        {money(monthly)}
        {arrow && <span className={`ml-1 text-xl ${arrowColor ?? color}`}>{arrow}</span>}
      </div>
      <div className="text-xs text-muted">per month</div>
      <div className={`mt-3 text-lg font-semibold ${color}`}>
        {money(monthly * 12)}
      </div>
      <div className="text-xs text-muted">per year</div>
    </div>
  );
}

// Prices are white; color only signals a change (red up, green down). Unchanged stays neutral.
export default function PriceComparison({ sub }: { sub: Subscription }) {
  const now = currentPrice(sub);
  const after = newPrice(sub);
  const change = priceChange(sub);
  const diff = Math.abs(after - now) * 12;

  return (
    <div>
      <div className="flex gap-3">
        <Card label="Now" monthly={now} color="text-ink" />
        <Card
          label="After the promo"
          monthly={after}
          color={change.direction === "same" ? "text-ink" : change.color}
          arrow={change.symbol}
          arrowColor={change.color}
        />
      </div>
      <p className={`mt-3 text-center text-sm ${change.color}`}>
        {change.direction === "up"
          ? `Costs you ${money(diff)} more per year after the promo`
          : change.direction === "down"
            ? `Saves you ${money(diff)} per year after the promo`
            : "No price change after the promo"}
      </p>
    </div>
  );
}
