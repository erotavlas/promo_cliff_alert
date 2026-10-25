import { z } from "zod";

export const PlanRequestSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().max(100),
  planText: z.string().min(1).max(2000),
});
export type PlanRequest = z.infer<typeof PlanRequestSchema>;

export const PlanResultSchema = z.object({
  features: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .describe("Short label/value pairs, e.g. label 'Data', value '50 GB'"),
  summary: z.string().describe("One short sentence describing the plan"),
  domain: z
    .string()
    .describe("The provider's website domain such as bell.ca, or an empty string if unsure"),
});
export type PlanResult = z.infer<typeof PlanResultSchema>;
