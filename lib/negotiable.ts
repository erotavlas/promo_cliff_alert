// Providers of these categories charge a posted price, so there is nothing to haggle over.
// Anything else (including custom categories) keeps the Negotiate screen.
const FIXED_PRICE = ["streaming", "music", "cloud storage", "software", "gaming"];

export function isNegotiable(category: string): boolean {
  return !FIXED_PRICE.includes(category.trim().toLowerCase());
}
