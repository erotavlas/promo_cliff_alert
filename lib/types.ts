export const CATEGORIES = [
  "Internet",
  "TV",
  "Cell phone",
  "Gym",
  "Streaming",
  "Music",
  "Cloud storage",
  "Software",
  "Gaming",
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

export type NegotiationResult = {
  id: string;
  provider: string;
  category: string;
  username: string;
  planFeatures: PlanFeature[];
  startPrice: number;
  finalPrice: number;
};

export type MatchKind = "equivalent" | "closest" | "none";

export type MatchResult = {
  kind: MatchKind;
  results: NegotiationResult[];
};
