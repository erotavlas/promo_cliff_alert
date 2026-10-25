import { z } from "zod";

// Shared by the browser (request building, template fallback) and the server (validation).
// Keep the LLM SDK out of this file so it never ships to the browser.

export const ScriptSchema = z.object({
  sections: z.array(z.object({ title: z.string(), body: z.string() })),
});
export type Script = z.infer<typeof ScriptSchema>;

export const ScriptRequestSchema = z.object({
  subscription: z.object({
    name: z.string(),
    category: z.string(),
    planText: z.string(),
    planFeatures: z.array(z.object({ label: z.string(), value: z.string() })),
    fullPrice: z.number(),
    discount: z.number(),
    promoEndDate: z.string(),
    startDate: z.string(),
  }),
  target: z.object({
    price: z.number(),
    source: z.enum(["result", "current-promo"]),
    result: z
      .object({
        provider: z.string(),
        username: z.string(),
        startPrice: z.number(),
        finalPrice: z.number(),
      })
      .optional(),
  }),
  tweak: z.string().max(500).optional(),
  previousScript: ScriptSchema.optional(),
});
export type ScriptRequest = z.infer<typeof ScriptRequestSchema>;
