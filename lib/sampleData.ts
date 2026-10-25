import type { SubscriptionInput } from "./types";

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD, local time
}

// Demo subscriptions; promo dates are relative to today so the demo always looks fresh.
export function sampleSubscriptions(): SubscriptionInput[] {
  return [
    {
      name: "Bell Internet",
      category: "Internet",
      planText: "1.5 Gbps fibre, unlimited data, Wi-Fi 6 modem",
      planFeatures: [],
      logoDomain: "bell.ca",
      contact: "1-866-310-2355",
      startDate: offsetDate(-700),
      isContract: true,
      contractMonths: 24,
      fullPrice: 85,
      discount: 20,
      promoEndDate: offsetDate(18),
    },
    {
      name: "Rogers Wireless",
      category: "Cell phone",
      planText: "50 GB data, unlimited Canada-wide calling",
      planFeatures: [],
      logoDomain: "rogers.com",
      contact: "1-888-764-3771",
      startDate: offsetDate(-400),
      isContract: false,
      fullPrice: 75,
      discount: 15,
      promoEndDate: offsetDate(-3),
    },
    {
      name: "Netflix",
      category: "Streaming",
      planText: "Standard plan, 2 screens, HD, no ads",
      planFeatures: [],
      logoDomain: "netflix.com",
      contact: "help@netflix.com",
      startDate: offsetDate(-900),
      isContract: false,
      fullPrice: 20.99,
      discount: 0,
      promoEndDate: offsetDate(62),
    },
    {
      name: "GoodLife Fitness",
      category: "Gym",
      planText: "All-clubs membership, monthly billing",
      planFeatures: [],
      logoDomain: "goodlifefitness.com",
      contact: "1-800-387-8010",
      startDate: offsetDate(-120),
      isContract: false,
      fullPrice: 45,
      discount: 10,
      promoEndDate: offsetDate(140),
    },
    {
      name: "Telus Internet",
      category: "Internet",
      planText: "1 Gbps fibre, unlimited data",
      planFeatures: [],
      logoDomain: "telus.com",
      contact: "1-866-558-2255",
      startDate: offsetDate(-690),
      isContract: true,
      contractMonths: 24,
      fullPrice: 90,
      discount: 25,
      promoEndDate: offsetDate(27),
    },
    {
      name: "Disney+",
      category: "Streaming",
      planText: "Premium plan, 4 screens, 4K, no ads",
      planFeatures: [],
      logoDomain: "disneyplus.com",
      contact: "help@disneyplus.com",
      startDate: offsetDate(-330),
      isContract: false,
      fullPrice: 18.99,
      discount: 6,
      promoEndDate: offsetDate(9),
    },
    {
      name: "Spotify",
      category: "Streaming",
      planText: "Premium individual, ad-free music",
      planFeatures: [],
      logoDomain: "spotify.com",
      contact: "support@spotify.com",
      startDate: offsetDate(-1100),
      isContract: false,
      fullPrice: 11.99,
      discount: 0,
      promoEndDate: offsetDate(210),
    },
  ];
}

// Demo items not already in the list (matched by name), so clicking twice never duplicates.
export function missingSampleSubscriptions(existingNames: string[]): SubscriptionInput[] {
  const have = new Set(existingNames.map((n) => n.trim().toLowerCase()));
  return sampleSubscriptions().filter((s) => !have.has(s.name.toLowerCase()));
}
