const COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#ef4444",
  "#22c55e",
];

function hash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

// Letter circle for now; logo lookup is added in the last slice.
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
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        background: COLORS[hash(name) % COLORS.length],
      }}
    >
      {letter}
    </span>
  );
}
