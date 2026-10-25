# Subscription Tracker with Negotiation Coach

A mobile-friendly web app that tracks your subscriptions, warns you when a promo is about to end, and then helps you negotiate a better price: it shows what other people with a similar plan negotiated and writes a short call script from those outcomes.

> Built for the Devpost "Build With AI: Basics" learning hackathon. Negotiation results are **sample data** (clearly labeled in the app); live crowdsourcing is not part of this proof of concept.

## What it does

- **Active list** with a "needs attention" area (promo ends in 30 days or fewer, or already ended), green-to-red status colors, and current vs. post-promo monthly price with an up/down/no-change indicator.
- **Detail screen** with monthly and yearly current vs. new price (the new price turns red if it goes up and green if it goes down), plan features, contract info and a tappable contact.
- **Fixed-price plans** (streaming, music, cloud storage, software, gaming) show a card instead of Negotiate, since nobody can haggle over a posted price: switch to a cheaper tier, cancel, or accept.
- **Negotiate**: seeded results for an equivalent plan (else the closest match, else "no results yet"), hiding people who ended up paying more, lowest final price first.
- **Call script**: a short, sectioned script (Opening, If they refuse, Closing) written by Google Gemini from your subscription and the result you picked. Regenerate or tweak it ("more aggressive"). If the AI call fails, a plain template script appears instead.
- **Plan in your own words**: Gemini turns your description into structured plan features and guesses the provider's website for the logo.
- **One of each service**: you can't have two active internet or TV subscriptions, or two active subscriptions with the same name (mobile lines are fine if each has its own name).
- **Edit, cancel, restore, delete**: cancelled subscriptions move to the Cancelled tab.

Subscriptions are stored in your browser (`localStorage`); there are no accounts and no database.

## Run it

Requires Node.js 20 or newer and a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
npm install
cp .env.example .env.local   # then put your key in .env.local as GEMINI_API_KEY=...
npm run dev
```

Open <http://localhost:3000> and use your browser's device toolbar (phone width) for the intended layout. To try it on a phone, open your computer's address on the same Wi-Fi.

`.env.local` is git-ignored. The key is only read by the two server routes (`app/api/plan`, `app/api/script`) and never reaches the browser.

Optional: set `GEMINI_MODEL` in `.env.local` to use a different model (default `gemini-3.5-flash-lite`).

## Try the demo

1. On the empty home screen, tap **load demo data** (16 sample subscriptions for one household: Bell internet, TV and two mobile lines, plus streaming, music, cloud, software, gaming and gym plans, with several promos ending soon).
2. Open **Bell Internet** from "needs attention" and compare the current price with the higher price after the promo.
3. Tap **Negotiate**, select a result, then **Create script**.
4. Regenerate the script or type a tweak such as "make it more polite".

## How it is built

- **Next.js** (App Router) + React + TypeScript, **Tailwind CSS**, Inter font.
- **Google Gemini** via `@google/genai`, behind one module (`lib/llm.ts`), with replies validated by **zod**.
- Plain TypeScript for pricing, status colors and negotiation matching (`lib/pricing.ts`, `lib/status.ts`, `lib/matching.ts`), so the non-AI parts are predictable.
- Planning documents (scope, PRD, spec, build checklist) are in [`devpost/`](devpost/).

```
app/            screens and the two API routes
components/     UI pieces (rows, forms, price comparison, brand icon)
lib/            storage, pricing, status, matching, LLM module, template script
data/           negotiations.json (sample results)
```

## Notes and limits

- Logos are looked up in this order: a file you add as `public/logos/<domain>.png`, then Google's favicon service, then the brand's app-store icon (Apple's public iTunes Search API, matched by brand name), then a letter circle. Logos are fetched live and not stored in this repository; only add local logo files you have the right to use.
- Clearing site data erases your subscriptions (no accounts in this proof of concept).
- No notifications: "needs attention" is computed when you open the app.
