export const CATEGORIES = [
  "Internet",
  "TV",
  "Cell phone",
  "Gym",
  "Streaming",
] as const;

export type PlanFeature = { label: string; value: string };

export type Subscription = {
  id: string;
  name: string;
  category: string;
  customCategory?: string;
  planText: string;
  planFeatures: PlanFeature[];
  logoDomain?: string;
  contact: string;
  startDate: string; // ISO date, YYYY-MM-DD
  isContract: boolean;
  contractMonths?: number;
  fullPrice: number; // monthly
  discount: number; // monthly
  promoEndDate: string; // ISO date
  status: "active" | "cancelled";
  cancelledAt?: string;
};

export type SubscriptionInput = Omit<
  Subscription,
  "id" | "status" | "cancelledAt"
>;
