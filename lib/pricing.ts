import type { Subscription } from "./types";

type Priced = Pick<Subscription, "fullPrice" | "discount">;

export function currentPrice(s: Priced): number {
  return Math.max(0, s.fullPrice - s.discount);
}

export function newPrice(s: Priced): number {
  return s.fullPrice;
}

export function monthlyIncrease(s: Priced): number {
  return newPrice(s) - currentPrice(s);
}

export function yearlyIncrease(s: Priced): number {
  return monthlyIncrease(s) * 12;
}

export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

// How the price changes when the promo ends: red ▲ up, green ▼ down, neutral – unchanged.
export function priceChange(s: Priced): {
  symbol: string;
  color: string;
  direction: "up" | "down" | "same";
} {
  const diff = monthlyIncrease(s);
  if (diff > 0) return { symbol: "▲", color: "text-bad", direction: "up" };
  if (diff < 0) return { symbol: "▼", color: "text-good", direction: "down" };
  return { symbol: "–", color: "text-muted", direction: "same" };
}
