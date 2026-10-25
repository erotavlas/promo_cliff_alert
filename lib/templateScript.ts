import type { Script, ScriptRequest } from "./scriptTypes";

// No-AI fallback: same sections, filled in from the subscription and target price.
export function templateScript(req: ScriptRequest): Script {
  const s = req.subscription;
  const now = Math.max(0, s.fullPrice - s.discount).toFixed(2);
  const target = req.target.price.toFixed(2);
  const r = req.target.result;

  return {
    sections: [
      {
        title: "Opening",
        body: `Hi, I'm a ${s.name} customer. I noticed my promo ends on ${s.promoEndDate}. I'm paying $${now} a month now, and I'd like to keep paying $${target} a month, or hear about a better promo you have.`,
      },
      {
        title: "If they refuse",
        body: r
          ? `I know someone on a similar plan who went from $${r.startPrice.toFixed(2)} to $${r.finalPrice.toFixed(2)} a month. Why can't I get the same? If you can't, could I speak with your retention team?`
          : `My target is to keep my current price of $${now} a month. What else can you offer me? If you can't, could I speak with your retention team?`,
      },
      {
        title: "Closing",
        body: `Great. Can you confirm the new monthly price, when the new promo ends, and send it to me in writing or by email? Thank you.`,
      },
    ],
  };
}
