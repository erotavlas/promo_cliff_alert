"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabNav() {
  const path = usePathname();
  const onCancelled = path.startsWith("/cancelled");

  const tab = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={`flex-1 rounded-lg py-2 text-center text-sm font-medium ${
        active ? "bg-card-hi text-ink" : "text-muted"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-10 -mx-4 mb-4 bg-page px-4 py-3">
      <div className="flex gap-1 rounded-xl bg-card p-1">
        {tab("/", "Active", !onCancelled)}
        {tab("/cancelled", "Cancelled", onCancelled)}
      </div>
    </nav>
  );
}
