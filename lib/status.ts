import type { Subscription } from "./types";

export const ATTENTION_DAYS = 30;
const GREEN_DAYS = 90; // this many days or more left = fully green

const DAY_MS = 24 * 60 * 60 * 1000;

function localMidnight(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// "2026-12-31" -> local midnight, avoiding the UTC shift of Date.parse on date-only strings.
function parseIsoLocal(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function daysLeft(promoEndDate: string, now: Date = new Date()): number {
  return Math.round((parseIsoLocal(promoEndDate) - localMidnight(now)) / DAY_MS);
}

export function needsAttention(
  s: Pick<Subscription, "promoEndDate">,
  now: Date = new Date(),
): boolean {
  return daysLeft(s.promoEndDate, now) <= ATTENTION_DAYS;
}

// Hue runs from 120 (green) at GREEN_DAYS+ left down to 0 (red) at 0 or past.
export function statusHue(days: number): number {
  const t = Math.min(1, Math.max(0, days / GREEN_DAYS));
  return Math.round(t * 120);
}

export function statusColor(days: number): string {
  return `hsl(${statusHue(days)} 75% 58%)`;
}

export function daysLabel(days: number): string {
  if (days < 0) return `Promo ended ${-days} day${days === -1 ? "" : "s"} ago`;
  if (days === 0) return "Promo ends today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export function timeAsSubscriber(startDate: string, now: Date = new Date()): string {
  const start = new Date(parseIsoLocal(startDate));
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 1) return "Less than a month";
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} year${y === 1 ? "" : "s"}`);
  if (m) parts.push(`${m} month${m === 1 ? "" : "s"}`);
  return parts.join(", ");
}
