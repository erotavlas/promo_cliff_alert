import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { z } from "zod";
import { PlanResultSchema, type PlanRequest, type PlanResult } from "./planTypes";
import { ScriptSchema,type Script, type ScriptRequest } from "./scriptTypes";

// Server-only: this module reads GEMINI_API_KEY, so import it only from app/api routes.
// Swap the provider or model here and nowhere else.
export const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

// Ask for JSON that matches a zod schema, then validate it before trusting it.
async function generateJson<T extends z.ZodType>(
  schema: T,
  system: string,
  prompt: string,
): Promise<z.infer<T>> {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: system,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }, // short script: keep it quick
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(schema),
    },
  });
  if (!response.text) throw new Error("Empty response from the model");
  return schema.parse(JSON.parse(response.text));
}

// ---- Plan structuring ----------------------------------------------------

const PLAN_SYSTEM = `You turn a customer's own description of a subscription plan into structured plan features.

Rules:
- Return 2 to 8 features as short label/value pairs (for example Speed: 1.5 Gbps, Data: Unlimited, Calling: Canada-wide). Use the customer's facts only; do not invent features.
- Keep labels consistent and generic (Speed, Data, Calling, Screens, Ads, Access, Billing, Modem, Extras) so plans from different customers can be compared.
- summary: one short sentence.
- domain: the provider's main website domain (no https://, no path) if you are confident, otherwise an empty string.`;

export async function structurePlan(req: PlanRequest): Promise<PlanResult> {
  const result = await generateJson(
    PlanResultSchema,
    PLAN_SYSTEM,
    `Subscription: ${req.name}\nCategory: ${req.category}\nPlan description: ${req.planText}`,
  );
  // Keep only a plausible bare domain; anything else falls back to the letter circle.
  const domain = result.domain.trim().toLowerCase();
  return { ...result, domain: /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain) ? domain : "" };
}

// ---- Call script ---------------------------------------------------------

const SCRIPT_SYSTEM = `You write short phone scripts for someone calling a provider to keep a lower price on a subscription whose promo is ending.

Rules:
- Return exactly three sections, titled "Opening", "If they refuse" and "Closing".
- Write what the caller should say, in plain spoken first person. A few sentences per section, never a wall of text.
- Opening: mention the promo end date and the price they pay now, and ask to keep paying the target price or hear about a better promo.
- If they refuse: if a result from another customer is given, cite it by its final price and starting price ("someone on a similar plan went from $X to $Y") and ask why the same can't be offered. If there is no result, say the target is the current promo price and ask what else they can offer. Add one fallback such as asking for the retention team or considering cancelling.
- Closing: confirm the price, the end date of the new promo, and ask for it in writing or by email.
- Use only the facts provided. Do not invent prices, plans or policies.
- If a tweak instruction is given, follow it (for example tone) while keeping the same three sections.`;

function describeScriptRequest(req: ScriptRequest): string {
  const s = req.subscription;
  const now = Math.max(0, s.fullPrice - s.discount);
  const plan =
    s.planFeatures.length > 0
      ? s.planFeatures.map((f) => `${f.label}: ${f.value}`).join("; ")
      : s.planText || "not described";
  const lines = [
    `Provider/subscription: ${s.name} (${s.category})`,
    `Plan: ${plan}`,
    `Customer since: ${s.startDate}`,
    `Pays now: $${now.toFixed(2)}/month; price after promo: $${s.fullPrice.toFixed(2)}/month`,
    `Promo ends: ${s.promoEndDate}`,
    `Target price to ask for: $${req.target.price.toFixed(2)}/month`,
  ];
  if (req.target.result) {
    const r = req.target.result;
    lines.push(
      `Result to cite: another customer (${r.username}) with a similar ${r.provider} plan negotiated from $${r.startPrice.toFixed(2)} down to $${r.finalPrice.toFixed(2)}/month`,
    );
  } else {
    lines.push("No result to cite: the target is the current promo price.");
  }
  if (req.previousScript) {
    lines.push(
      `Previous script:\n${req.previousScript.sections.map((x) => `${x.title}: ${x.body}`).join("\n")}`,
    );
  }
  if (req.tweak) lines.push(`Tweak instruction: ${req.tweak}`);
  else if (req.previousScript) lines.push("Write a fresh variation of the previous script.");
  return lines.join("\n");
}

export async function generateScript(req: ScriptRequest): Promise<Script> {
  const script = await generateJson(
    ScriptSchema,
    SCRIPT_SYSTEM,
    describeScriptRequest(req),
  );
  if (script.sections.length === 0) throw new Error("No script returned");
  return script;
}
