import type { SubscriptionInput } from "./types";

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD, local time
}

type Template = {
  name: string;
  category: string;
  planText: string;
  logoDomain: string;
  contact: string;
  startedDaysAgo: number;
  contractMonths?: number; // present = contract
  fullPrice: number;
  discount: number;
  promoEndsInDays: number; // negative = already ended
};

const BELL = { logoDomain: "bell.ca", contact: "1-866-310-2355" };
const ROGERS = { logoDomain: "rogers.com", contact: "1-888-764-3771" };
const TELUS = { logoDomain: "telus.com", contact: "1-866-558-2255" };

// Static on purpose: no dates are computed until the demo is actually loaded,
// so the home page can ask which demo names are missing while it prerenders.
const TEMPLATES: Template[] = [
  { ...BELL, name: "Bell Internet", category: "Internet", planText: "1.5 Gbps fibre, unlimited data, Wi-Fi 6 modem", startedDaysAgo: 700, contractMonths: 24, fullPrice: 85, discount: 20, promoEndsInDays: 18 },
  { ...BELL, name: "Bell TV", category: "TV", planText: "Fibe TV, 100+ channels, 2 set-top boxes, PVR", startedDaysAgo: 700, contractMonths: 24, fullPrice: 95, discount: 15, promoEndsInDays: 45 },
  { ...BELL, name: "Bell Mobility", category: "Cell phone", planText: "100 GB data, unlimited Canada-wide calling", startedDaysAgo: 500, contractMonths: 24, fullPrice: 80, discount: 10, promoEndsInDays: 110 },
  { ...ROGERS, name: "Rogers Internet", category: "Internet", planText: "1 Gbps fibre, unlimited data, Wi-Fi 6 modem", startedDaysAgo: 650, contractMonths: 24, fullPrice: 90, discount: 25, promoEndsInDays: 40 },
  { ...ROGERS, name: "Rogers TV", category: "TV", planText: "Ignite TV, 150+ channels, 2 set-top boxes", startedDaysAgo: 760, contractMonths: 24, fullPrice: 85, discount: 20, promoEndsInDays: -3 },
  { ...ROGERS, name: "Rogers Mobility", category: "Cell phone", planText: "50 GB data, unlimited Canada-wide calling", startedDaysAgo: 400, fullPrice: 75, discount: 15, promoEndsInDays: 55 },
  { ...TELUS, name: "Telus Internet", category: "Internet", planText: "1 Gbps fibre, unlimited data", startedDaysAgo: 690, contractMonths: 24, fullPrice: 90, discount: 25, promoEndsInDays: 27 },
  { ...TELUS, name: "Telus TV", category: "TV", planText: "Optik TV, 120+ channels, 2 set-top boxes", startedDaysAgo: 600, contractMonths: 24, fullPrice: 80, discount: 10, promoEndsInDays: 95 },
  { ...TELUS, name: "Telus Mobility", category: "Cell phone", planText: "75 GB data, unlimited Canada-wide calling", startedDaysAgo: 300, fullPrice: 78, discount: 12, promoEndsInDays: 80 },
  { name: "Netflix", category: "Streaming", planText: "Standard plan, 2 screens, HD, no ads", logoDomain: "netflix.com", contact: "help@netflix.com", startedDaysAgo: 900, fullPrice: 20.99, discount: 0, promoEndsInDays: 62 },
  { name: "Disney+", category: "Streaming", planText: "Premium plan, 4 screens, 4K, no ads", logoDomain: "disneyplus.com", contact: "help@disneyplus.com", startedDaysAgo: 330, fullPrice: 18.99, discount: 6, promoEndsInDays: 70 },
  { name: "GoodLife Fitness", category: "Gym", planText: "All-clubs membership, monthly billing", logoDomain: "goodlifefitness.com", contact: "1-800-387-8010", startedDaysAgo: 120, fullPrice: 45, discount: 10, promoEndsInDays: 140 },
];

export const DEMO_NAMES: readonly string[] = TEMPLATES.map((t) => t.name);

// Call only from an event handler: it reads today's date.
export function sampleSubscriptions(): SubscriptionInput[] {
  return TEMPLATES.map((t) => ({
    name: t.name,
    category: t.category,
    planText: t.planText,
    planFeatures: [],
    logoDomain: t.logoDomain,
    contact: t.contact,
    startDate: offsetDate(-t.startedDaysAgo),
    isContract: t.contractMonths !== undefined,
    contractMonths: t.contractMonths,
    fullPrice: t.fullPrice,
    discount: t.discount,
    promoEndDate: offsetDate(t.promoEndsInDays),
  }));
}

// Demo names not already in the list, so the load button only shows while something is missing.
export function missingDemoNames(existingNames: string[]): string[] {
  const have = new Set(existingNames.map((n) => n.trim().toLowerCase()));
  return DEMO_NAMES.filter((n) => !have.has(n.toLowerCase()));
}
