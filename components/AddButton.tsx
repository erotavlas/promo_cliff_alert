import Link from "next/link";

export default function AddButton() {
  return (
    <Link
      href="/add"
      aria-label="Add subscription"
      className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-3xl leading-none text-page shadow-lg"
    >
      +
    </Link>
  );
}
