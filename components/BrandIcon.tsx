// Neutral letter circle: green to red is reserved for the status signal, so the icon never competes with it.
// Logo lookup is added in the last slice.
export default function BrandIcon({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const letter = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-card-hi font-bold text-muted"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {letter}
    </span>
  );
}
