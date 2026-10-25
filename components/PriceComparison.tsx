import type { Subscription } from "@/lib/types";
import { currentPrice, money, newPrice } from "@/lib/pricing";

function Card({
  label,
  monthly,
  color,
  arrow,
}: {
  label: string;
  monthly: number;
  color: string;
  arrow?: string;
}) {
  return (
    <div className="flex-1 rounded-2xl bg-card p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${color}`}>
        {money(monthly)}
        {arrow && <span className="ml-1 text-xl">{arrow}</span>}
      </div>
      <div className="text-xs text-muted">per month</div>
      <div className={`mt-3 text-lg font-semibold ${color}`}>
        {money(monthly * 12)}
      </div>
      <div className="text-xs text-muted">per year</div>
    </div>
  );
}

export default function PriceComparison({ sub }: { sub: Subscription }) {
  const now = currentPrice(sub);
  const after = newPrice(sub);
  const up = after > now;
  const down = after < now;
  const diff = Math.abs(after - now) * 12;

  return (
    <div>
      <div className="flex gap-3">
        <Card label="Now" monthly={now} color="text-good" />
        <Card
          label="After the promo"
          monthly={after}
          color={up ? "text-bad" : "text-good"}
          arrow={up ? "▲" : down ? "▼" : undefined}
        />
      </div>
      {(up || down) && (
        <p className={`mt-3 text-center text-sm ${up ? "text-bad" : "text-good"}`}>
          {up
            ? `Costs you ${money(diff)} more per year after the promo`
            : `Saves you ${money(diff)} per year after the promo`}
        </p>
      )}
    </div>
  );
}
