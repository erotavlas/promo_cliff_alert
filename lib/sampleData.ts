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
  ];
}
