import type { SubscriptionInput } from "./types";

export type FormErrors = Partial<
  Record<keyof SubscriptionInput | "form", string>
>;

function validDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

export function validate(v: SubscriptionInput): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim()) e.name = "Give the subscription a name.";
  if (!v.category.trim()) e.customCategory = "Enter a category.";
  if (!v.contact.trim())
    e.contact = "Contact is required: a phone number or email.";
  if (!validDate(v.startDate)) e.startDate = "Enter a valid start date.";
  if (!validDate(v.promoEndDate))
    e.promoEndDate = "Enter a valid promo end date.";
  if (v.isContract && !(v.contractMonths && v.contractMonths > 0))
    e.contractMonths = "Enter the contract length in months.";
  if (!Number.isFinite(v.fullPrice) || v.fullPrice < 0)
    e.fullPrice = "Enter the full monthly price (0 or more).";
  if (!Number.isFinite(v.discount) || v.discount < 0)
    e.discount = "Enter the discount (0 or more).";
  else if (v.discount > v.fullPrice)
    e.discount = "Discount can't be more than the full price.";
  return e;
}
