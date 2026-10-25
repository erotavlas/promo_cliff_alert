"use client";

import { useState } from "react";

const MIN_LOGO_PX = 32;

// Looks up the brand's logo from its domain. With no domain, or if the lookup fails
// it falls back to a neutral letter circle. The service answers an unknown domain with a 404
// whose body is a tiny 16px globe that browsers still draw, so a small image counts as "no logo".
// Neutral on purpose: green to red is reserved for the status signal.
export default function BrandIcon({
  name,
  domain,
  size = 40,
}: {
  name: string;
  domain?: string;
  size?: number;
}) {
  const [failedDomain, setFailedDomain] = useState<string | null>(null);
  const letter = (name.trim()[0] ?? "?").toUpperCase();

  if (domain && failedDomain !== domain) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        aria-hidden
        alt=""
        width={size}
        height={size}
        src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128&fallback_opts=TYPE,SIZE,URL`}
        onError={() => setFailedDomain(domain)}
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth < MIN_LOGO_PX) setFailedDomain(domain);
        }}
        className="shrink-0 rounded-full bg-ink object-contain p-1.5"
        style={{ width: size, height: size }}
      />
    );
  }

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
