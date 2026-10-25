"use client";

import { useEffect, useState } from "react";
import { lookupAppIcon } from "@/lib/appIcon";

const MIN_LOGO_PX = 32;

// Logo sources, tried in order:
// 1. A local file you provide: public/logos/<domain>.png (for example public/logos/telus.com.png).
// 2. The online favicon lookup. For an unknown domain it answers 404 with a tiny 16px globe that
//    browsers still draw, so a small image counts as "no logo".
// 3. The brand's app-store icon (lib/appIcon.ts).
// 4. A neutral letter circle (green to red is reserved for the status signal).
function sourcesFor(domain: string): string[] {
  return [
    `/logos/${domain}.png`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128&fallback_opts=TYPE,SIZE,URL`,
  ];
}

export default function BrandIcon({
  name,
  domain,
  size = 40,
}: {
  name: string;
  domain?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState<string[]>([]);
  const [appIcon, setAppIcon] = useState<string | null>(null);
  const letter = (name.trim()[0] ?? "?").toUpperCase();

  const fixed = domain ? sourcesFor(domain) : [];
  const fixedExhausted = !!domain && fixed.every((s) => failed.includes(s));

  // Only ask for the app icon once the local file and favicon have both failed.
  useEffect(() => {
    if (!domain || !fixedExhausted) return;
    let cancelled = false;
    void lookupAppIcon(domain).then((url) => {
      if (!cancelled) setAppIcon(url);
    });
    return () => {
      cancelled = true;
    };
  }, [domain, fixedExhausted]);

  const src =
    fixed.find((s) => !failed.includes(s)) ??
    (appIcon && !failed.includes(appIcon) ? appIcon : undefined);

  if (src) {
    const fail = () => setFailed((f) => [...f, src]);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={src}
        aria-hidden
        alt=""
        width={size}
        height={size}
        src={src}
        onError={fail}
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth < MIN_LOGO_PX) fail();
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
