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

// Static on purpose: no dates are computed until the demo is actually loaded,
// so the home page can ask which demo names are missing while it prerenders.
// Realistic household: one internet, one TV, two mobile lines, then a spread of monthly services.
const TEMPLATES: Template[] = [
  { ...BELL, name: "Bell Internet", category: "Internet", planText: "1.5 Gbps fibre, unlimited data, Wi-Fi 6 modem", startedDaysAgo: 700, contractMonths: 24, fullPrice: 85, discount: 20, promoEndsInDays: 18 },
  { ...BELL, name: "Bell TV", category: "TV", planText: "Fibe TV, 100+ channels, 2 set-top boxes, PVR", startedDaysAgo: 700, contractMonths: 24, fullPrice: 95, discount: 15, promoEndsInDays: 45 },
  { ...BELL, name: "Bell Mobility (Line 1)", category: "Cell phone", planText: "100 GB data, unlimited Canada-wide calling", startedDaysAgo: 500, contractMonths: 24, fullPrice: 80, discount: 10, promoEndsInDays: 110 },
  { ...BELL, name: "Bell Mobility (Line 2)", category: "Cell phone", planText: "50 GB data, unlimited Canada-wide calling", startedDaysAgo: 380, fullPrice: 65, discount: 15, promoEndsInDays: 8 },
  { logoDomain: "netflix.com", contact: "help@netflix.com", name: "Netflix", category: "Streaming", planText: "Standard plan, 2 screens, HD, no ads", startedDaysAgo: 900, fullPrice: 20.99, discount: 0, promoEndsInDays: 62 },
  { logoDomain: "disneyplus.com", contact: "help@disneyplus.com", name: "Disney+", category: "Streaming", planText: "Premium plan, 4 screens, 4K, no ads", startedDaysAgo: 330, fullPrice: 18.99, discount: 6, promoEndsInDays: 70 },
  { logoDomain: "crave.ca", contact: "support@crave.ca", name: "Crave", category: "Streaming", planText: "Premium plan, 4 screens, 4K, HBO included, no ads", startedDaysAgo: 340, fullPrice: 22.99, discount: 8, promoEndsInDays: 25 },
  { logoDomain: "apple.com", contact: "support@apple.com", name: "Apple TV+", category: "Streaming", planText: "Individual plan, 6 screens, 4K, no ads", startedDaysAgo: 250, fullPrice: 12.99, discount: 12.99, promoEndsInDays: 12 },
  { logoDomain: "amazon.ca", contact: "cs-reply@amazon.ca", name: "Amazon Prime", category: "Streaming", planText: "Prime membership, Prime Video, free shipping, 3 screens", startedDaysAgo: 1100, fullPrice: 9.99, discount: 0, promoEndsInDays: 90 },
  { logoDomain: "spotify.com", contact: "support@spotify.com", name: "Spotify", category: "Music", planText: "Premium Duo, 2 accounts, ad-free, offline listening", startedDaysAgo: 400, fullPrice: 17.99, discount: 5, promoEndsInDays: 33 },
  { logoDomain: "icloud.com", contact: "support@apple.com", name: "iCloud+", category: "Cloud storage", planText: "2 TB storage, family sharing, private relay", startedDaysAgo: 800, fullPrice: 14.99, discount: 0, promoEndsInDays: 120 },
  { logoDomain: "microsoft.com", contact: "support@microsoft.com", name: "Microsoft OneDrive", category: "Cloud storage", planText: "100 GB standalone storage plan", startedDaysAgo: 600, fullPrice: 2.69, discount: 0, promoEndsInDays: 75 },
  { logoDomain: "microsoft.com", contact: "support@microsoft.com", name: "Microsoft 365", category: "Software", planText: "Family plan, 6 users, 1 TB each, Word Excel PowerPoint", startedDaysAgo: 340, fullPrice: 14.99, discount: 4, promoEndsInDays: 20 },
  { logoDomain: "adobe.com", contact: "support@adobe.com", name: "Adobe Photoshop", category: "Software", planText: "Photoshop single app, annual plan billed monthly, 100 GB cloud", startedDaysAgo: 335, contractMonths: 12, fullPrice: 31.49, discount: 10.5, promoEndsInDays: 30 },
  { logoDomain: "xbox.com", contact: "support@xbox.com", name: "Xbox Game Pass", category: "Gaming", planText: "Ultimate plan, console and PC games, online multiplayer", startedDaysAgo: 200, fullPrice: 26.99, discount: 13.5, promoEndsInDays: 5 },
  { logoDomain: "goodlifefitness.com", contact: "1-800-387-8010", name: "GoodLife Fitness", category: "Gym", planText: "All-clubs membership, monthly billing", startedDaysAgo: 120, fullPrice: 45, discount: 10, promoEndsInDays: 140 },
];

// Items from earlier demo sets (several internet/TV plans); loading the demo removes them.
export const OLD_DEMO_NAMES: readonly string[] = [
  "Rogers Internet", "Rogers TV", "Rogers Mobility",
  "Telus Internet", "Telus TV", "Telus Mobility", "Bell Mobility",
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
