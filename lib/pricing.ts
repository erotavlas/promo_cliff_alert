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
