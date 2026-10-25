// Last-resort logo: the brand's app-store icon, via Apple's public iTunes Search API
// (no key needed, allows browser requests). It returns unrelated apps for unknown names,
// so a result is only accepted when its app name or publisher contains the brand name.

const cache = new Map<string, Promise<string | null>>();

type ItunesResult = {
  trackName?: string;
  sellerName?: string;
  artworkUrl512?: string;
};

// "www.telus.com" -> "telus"
function brandFromDomain(domain: string): string {
  const parts = domain
    .toLowerCase()
    .replace(/^www\./, "")
    .split(".");
  return parts[0] ?? "";
}

async function fetchAppIcon(domain: string): Promise<string | null> {
  const brand = brandFromDomain(domain);
  if (brand.length < 3) return null;
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(brand)}&entity=software&country=ca&limit=10`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: ItunesResult[] };
    const match = data.results?.find(
      (r) =>
        r.artworkUrl512 &&
        `${r.trackName ?? ""} ${r.sellerName ?? ""}`
          .toLowerCase()
          .includes(brand),
    );
    return match?.artworkUrl512 ?? null;
  } catch {
    return null;
  }
}

export function lookupAppIcon(domain: string): Promise<string | null> {
  let p = cache.get(domain);
  if (!p) {
    p = fetchAppIcon(domain);
    cache.set(domain, p);
  }
  return p;
}
