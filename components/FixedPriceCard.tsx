// Shown instead of the Negotiate button for plans with a posted price.
export default function FixedPriceCard({
  name,
  onAccept,
}: {
  name: string;
  onAccept: () => void;
}) {
  return (
    <section className="col-span-2 rounded-2xl bg-card p-4">
      <h2 className="font-semibold">This plan has a fixed price, so there&apos;s nothing to negotiate</h2>
      <p className="mt-1 text-sm text-muted">
        {name} charges the same posted price to everyone. When the promo ends, your options are:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        <li>Switch to a cheaper tier (for example a plan with ads or fewer screens), then use Edit to update the price.</li>
        <li>Cancel it, and come back later if a new offer appears.</li>
        <li>Accept the new price.</li>
      </ul>
      <button onClick={onAccept} className="mt-3 w-full rounded-xl bg-ink py-3 font-semibold text-page">
        Accept new price
      </button>
    </section>
  );
}
