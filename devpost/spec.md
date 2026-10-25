---
doc: spec
status: approved
---

# Subscription Tracker with Negotiation Coach — Technical Spec

Implements `prd.md` (approved) and stays inside `scope.md > The POC Boundary`.

## How This Works, In Plain Language

The app is one **Next.js** project written in TypeScript. Next.js is a framework built on React that adds screens-from-folders and a small built-in server in the same project.

There are four pieces:

1. **The screens (React, in the browser).** Active list, Cancelled list, Add/Edit form, Detail, Negotiate, Script. They run on your phone-sized browser window.
2. **The notebook (`localStorage`).** Every subscription you add is saved in the browser itself, like a sticky note the browser keeps for this site. Close the app, come back next week, and the same subscriptions are there. No accounts, no database.
3. **The seeded results (a JSON file).** `data/negotiations.json` holds the pre-written "what others negotiated" examples. Plain TypeScript code (no AI) decides which ones match your subscription's plan.
4. **The small server (two Next.js API routes).** This is the only place your secret Gemini API key lives. The browser sends it a request ("structure this plan description", "write a call script"), the server calls Claude, and sends the answer back. The key never reaches the browser.

The LLM (Google Gemini) does exactly two jobs: turn your typed plan description into structured features (and guess the brand's website for the logo), and write the sectioned call script from your subscription plus the negotiation result you picked. Everything else (dates, prices, colors, "needs attention", matching) is ordinary code, so it is predictable and easy to demo.

Why this shape: it's one project and one command to run, it needs no database or login, and the LLM calls sit behind one small module so the provider or model can be swapped later.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. **First open.** `app/page.tsx` loads, reads `localStorage`, finds no subscriptions, and shows "Get started — add a current or new subscription" plus the plus button (`prd.md > States and Boundaries`).
2. **Add.** Plus → `/add` (`SubscriptionForm`). On save, the browser POSTs `{name, category, planText}` to `/api/plan`. The server asks Claude for structured plan features and a website domain, and returns them. The form builds the subscription (prices are derived later, not stored), writes it to `localStorage`, and navigates to `/`.
3. **List.** `/` reads all active subscriptions, runs `lib/pricing.ts` and `lib/status.ts` on each (days left, color, current/new price, arrow), puts those with 30 days or fewer (or past) into the "needs attention" area sorted by date, and lists all below.
4. **Detail.** Tap a row → `/subscription/[id]`. Shows the green vs red price comparison (monthly and yearly), plan features, contract info, tappable contact, and Edit / Cancel / Negotiate.
5. **Negotiate.** `/subscription/[id]/negotiate` calls `lib/matching.ts` with the subscription and the seeded JSON. It shows results (equivalent, else closest, else "no results yet"), filtered (no "paid more") and sorted lowest final price first. The user selects one and taps the script button, which navigates with `?result=<id>`.
6. **Script.** `/subscription/[id]/script?result=<id>` POSTs the subscription, the target price and the chosen result to `/api/script`. The server asks Claude for a sectioned script (structured output) and returns it. The page shows contact at the top, then the sections. Regenerate and Tweak POST again with the previous script and the instruction. If the call fails, `lib/templateScript.ts` builds the template script locally.
7. **Outcome.** Edit updates the record in `localStorage`; Cancel sets `status: "cancelled"` and it appears on `/cancelled`, where Restore flips it back and Delete removes it.

## Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), React, TypeScript — [docs](https://nextjs.org/docs) | Learner-chosen. One project: screens plus server routes. Tradeoff accepted: some behavior comes from Next.js folder conventions. |
| Styling | Tailwind CSS (create-next-app default) — [docs](https://tailwindcss.com/docs) + Inter via `next/font/google` | Agent-recommended default for fast dark-theme mobile layout; learner may swap for plain CSS. |
| LLM | Google Gemini API via `@google/genai` — [docs](https://ai.google.dev/gemini-api/docs) | Learner-chosen (switched from Anthropic during the build). |
| Output validation | `zod` with `z.toJSONSchema()` passed as Gemini's `responseJsonSchema`, then `schema.parse()` on the reply | Gets typed, schema-valid JSON back for plan features and script sections. |
| Storage | Browser `localStorage` | Matches "stays on the device, no accounts" in the PRD. |
| Seeded results | `data/negotiations.json` | Static sample data, clearly labeled in the UI. |
| Matching | Plain TypeScript | Learner-chosen: predictable, no third LLM call. |

**Model:** one constant in `lib/llm.ts` (`MODEL`, overridable with the `GEMINI_MODEL` env var). Default `gemini-3.5-flash-lite`: it writes a good short script in about 2 seconds, where `gemini-3.8-flash` ranged from 6 to 70 seconds in testing. Model IDs verified against the live model list.

**Unverified, check early in the build:**
- Exact current `create-next-app` defaults and Node version requirement.
- That Gemini's `responseJsonSchema` accepts the schema produced by `z.toJSONSchema()` and the chosen model ID exists.
- The favicon lookup URL (see *External Services*).

## Where It Runs and How Someone Tries It

- **Runtime:** local Node.js process (Node 20 or newer assumed; verify against the installed Next.js). Browser at phone width (use the browser's device toolbar, or open the laptop's address on a phone on the same Wi-Fi).
- **Setup:** `npm install`, then create `.env.local` containing `GEMINI_API_KEY=...` (never committed; `.env.local` is in `.gitignore`). Provide `.env.example`.
- **Start:** `npm run dev`, then open `http://localhost:3000`.
- **Demo recording:** load a few subscriptions (a seed button/script, see `lib/sampleData.ts`) including a Bell internet promo ending in under 30 days, then record the journey in `prd.md > The Core Journey`. A local app is sufficient for submission.
- **Submission:** a short demo video and a public GitHub repository are both required. Deployment is optional and not planned. If chosen later, Vercel is the one-step target; it would need `ANTHROPIC_API_KEY` set as a project environment variable.

## Look and Feel

Carried from `prd.md > Look and Feel`; no further design interview.

- **Palette (Tailwind theme tokens):** page background charcoal (about `#1e2025`), card background a step lighter (about `#2a2d34`), text soft off-white (about `#e8e8ea`), muted labels mid-gray. Never pure black or white.
- **Only strong color:** the green → yellow → orange → red status range. Prices are white; color marks change only: rising new price red with ▲, falling green with ▼, unchanged a neutral gray dash (revised during the build).
- **Type:** Inter. Large bold numbers for prices, small muted labels.
- **Layout:** mobile-first, single column, generous spacing, one idea per card, no heavy borders or decoration. The plus button is a small round button fixed bottom-right.
- **Tone of copy:** plain and calm ("Get started — add a current or new subscription").

## Components

### Storage and Subscription Hook
Reads and writes the subscription list to `localStorage` under one key (`subtracker.v1`), exposes add / update / cancel / restore / delete, and loads after mount to avoid server/browser mismatch.
PRD ref: `prd.md > States and Boundaries` (returning to the app), `prd.md > Cancelled tab`.

### Pricing and Status Logic
Pure functions: current price = full − discount; new price = full; monthly and yearly difference; days until promo end; status color (hue scales from green at 90+ days to red at 0 or past); needs-attention test (≤ 30 days or past).
PRD ref: `prd.md > Add subscription`, `prd.md > Subscription list (Active tab)`, `prd.md > Detail screen`.

### Add / Edit Form
Fields in the PRD order. Custom category reveals a text field. "Not a contract" hides contract length. Contact required; basic validation (dates, non-negative numbers). On save, calls `/api/plan`. On error, shows a plain message and keeps what was typed.
PRD ref: `prd.md > Add subscription`.

### Brand Icon
Shows an `<img>` from the stored `logoDomain`; on load error or missing domain, shows a letter circle (colored by hash of the name). Same component in list rows, detail header and script screen.
PRD ref: `prd.md > Brand icon`.

### Active List Screen
"Needs attention" area on top (sorted by date, most urgent first), all subscriptions below with icon, name, status color, cost now, cost after, arrow. Empty state with message. Fixed plus button.
PRD ref: `prd.md > Subscription list (Active tab)`, `prd.md > Screens and Layout`.

### Cancelled Screen
Cancelled rows (icon, name, cancelled date) each with Restore and Delete; short "nothing cancelled" message when empty.
PRD ref: `prd.md > Cancelled tab`.

### Detail Screen
Header with icon and name, time as a subscriber, dates, plan features, contract info, tappable contact (`tel:` or `mailto:`), price comparison cards (monthly and yearly, green vs red with arrow), and Edit / Cancel / Negotiate. No delete.
PRD ref: `prd.md > Detail screen`.

### Matching Logic (`lib/matching.ts`)
Plain code. Normalizes provider name and category, then scores each seeded result: same provider (strong), same category (weaker), plus the fraction of plan features shared (compared on normalized lowercase tokens). Returns `{kind: "equivalent" | "closest" | "none", results}`. Equivalent means same provider and category with feature overlap at or above a threshold (start with 0.5, tune in the build); closest means the best-scoring result sharing provider or category. Drops any result with `finalPrice > startPrice`, then sorts by `finalPrice` ascending.
PRD ref: `prd.md > Negotiate screen`.

### Negotiate Screen
Lists the matched results (provider, username, starting price, final price, a "Sample data" label), lets the user select one, and has a "create script" button. For `none`, shows "no results yet" and the button still works, aimed at the current promo price.
PRD ref: `prd.md > Negotiate screen`.

### Script Screen
Contact at top (tappable), brand icon, subscription summary, sectioned script (Opening, If they refuse, Closing), Regenerate, and a text box for a tweak instruction (typed or dictated via the phone keyboard). On failure, shows the template script with a note.
PRD ref: `prd.md > Script screen`.

### LLM Module (`lib/llm.ts`) and API Routes
- `POST /api/plan` — input `{name, category, planText}`. Output `{features: {label, value}[], summary, domain}`. Uses Gemini JSON-schema output validated with zod.
- `POST /api/script` — input `{subscription, target: {price, source: "result"|"current-promo", result?}, tweak?, previousScript?}`. Output `{sections: {title, body}[]}`. The system prompt tells Claude to be brief, use the given sections, cite the selected result's price if present, and honor the tweak.
Both routes read `GEMINI_API_KEY` from the environment only; nothing is logged.
PRD ref: `prd.md > Add subscription` (plan), `prd.md > Script screen`.

### Template Script (`lib/templateScript.ts`)
Fills the same sections from the subscription details and target price without any LLM call.
PRD ref: `prd.md > Script screen` (fallback).

## Data Model

**Subscription** (stored in `localStorage`, array under `subtracker.v1`):

| Field | Notes |
|---|---|
| `id` | generated string |
| `name`, `category`, `customCategory?` | category from a fixed list or custom |
| `planText` | what the user typed |
| `planFeatures` | `{label, value}[]` from the LLM; empty if never structured |
| `logoDomain?` | domain guessed by the LLM, e.g. `bell.ca` |
| `contact` | required phone or email |
| `startDate` | ISO date |
| `isContract`, `contractMonths?` | |
| `fullPrice`, `discount` | monthly, numbers |
| `promoEndDate` | ISO date |
| `status` | `"active"` or `"cancelled"`; `cancelledAt?` |

Derived on the fly, never stored: current price, new price, yearly figures, days left, color, needs-attention.

**NegotiationResult** (static file `data/negotiations.json`): `id, provider, category, username, planFeatures, startPrice, finalPrice`. Sample data, labeled as such.

**Where it lives and what happens on return:** subscriptions live in the browser's `localStorage`, updated whenever the user adds, edits, cancels, restores or deletes. They persist across visits on the same browser. Because the status is computed from today's date each time, colors and "needs attention" membership update on their own as days pass. Clearing site data erases everything (accepted; no accounts in the POC). Scripts are not stored; they are regenerated on demand.

## File Structure

```
buildwithaibasics_2/
├── app/
│   ├── layout.tsx                    # Inter font, dark theme, top tabs (Active / Cancelled)
│   ├── page.tsx                      # Active list + needs attention + empty state
│   ├── cancelled/page.tsx            # Cancelled tab
│   ├── add/page.tsx                  # Add form
│   ├── subscription/[id]/
│   │   ├── page.tsx                  # Detail screen
│   │   ├── edit/page.tsx             # Edit form
│   │   ├── negotiate/page.tsx        # Negotiate screen
│   │   └── script/page.tsx           # Script screen
│   └── api/
│       ├── plan/route.ts             # LLM: plan text -> features + domain
│       └── script/route.ts           # LLM: sectioned call script
├── components/
│   ├── SubscriptionForm.tsx
│   ├── SubscriptionRow.tsx
│   ├── BrandIcon.tsx                 # logo or letter circle
│   ├── PriceComparison.tsx           # green vs red, monthly and yearly
│   ├── AddButton.tsx                 # fixed round plus
│   └── ContactLink.tsx               # tel: / mailto:
├── lib/
│   ├── types.ts                      # Subscription, NegotiationResult, Script types
│   ├── storage.ts                    # localStorage read/write + useSubscriptions hook
│   ├── pricing.ts                    # current/new price, yearly difference
│   ├── status.ts                     # days left, color, needs-attention
│   ├── matching.ts                   # equivalent / closest / none
│   ├── llm.ts                        # Gemini client, model constant, zod schemas
│   ├── templateScript.ts             # no-LLM fallback script
│   └── sampleData.ts                 # demo subscriptions loader
├── data/
│   └── negotiations.json             # seeded sample results
├── devpost/                          # Devpost learning workspace
├── .env.example                      # GEMINI_API_KEY=
├── .gitignore                        # includes .env.local
├── package.json
└── README.md                         # setup and run steps for reviewers
```

## External Services and Dependencies

### Google Gemini API
- Called only from `app/api/*/route.ts` via `lib/llm.ts` and `@google/genai`: `ai.models.generateContent({model, contents, config: {systemInstruction, responseMimeType: "application/json", responseJsonSchema}})`, then the JSON is validated with zod.
- Auth: `GEMINI_API_KEY` in `.env.local`.
- Docs: https://ai.google.dev/gemini-api/docs (structured output). Keys from https://aistudio.google.com/apikey.
- Cost: per-token; small for a demo. Rate limits depend on the account tier.

### Logo lookup (optional, first thing to cut)
- The LLM returns a best-guess website `domain` for the brand along with the plan features. `BrandIcon` loads a favicon service image for that domain.
- **Unverified:** which favicon URL gives the best result and whether it returns an error (letting the letter circle take over) or a generic globe when nothing is found. Check this in the build step that adds icons; if it shows globes or looks poor, ship the letter circle only, as the PRD allows.
- No key, no account.

### Other dependencies
Next.js, React, Tailwind, zod, `@google/genai` — all via npm. Pin versions in `package.json` when installing.

## Important Failure Modes

- **Plan structuring call fails** (key wrong, rate limit, outage) → the form shows a plain error message and keeps what was typed; nothing is lost. Per the learner's decision, the app assumes the API is reachable for the demo.
- **Script generation call fails** → the template script appears with the same sections and a note that the AI version isn't available. Never an empty screen.
- **Logo not found or fails to load** → letter circle.
- **Bad or missing input** → form refuses to save with an empty contact or obviously unusable dates/prices.

## What Was Simplified and Why

- **`localStorage`** instead of a database — no accounts, single device, same shape of data. A database would be needed for crowdsourcing after the hackathon.
- **Seeded JSON** instead of live crowdsourced results — per `scope.md > Explicitly Cut`.
- **Plain-code matching** instead of an LLM matcher — predictable and one fewer LLM call.
- **Assume the LLM is reachable** instead of an offline or local-model path — the learner's decision; a local model (Ollama or in-browser) is a possible later enhancement, and `lib/llm.ts` is the single place to add it.
- **No notifications or background jobs** — "needs attention" is computed when the app opens.
- **Local run plus recording** instead of deployment — the video and public repository are what submission requires.

## Decisions and Open Issues

**Learner decisions**
- Stack: Next.js + TypeScript (after the Next.js vs Vite + Express comparison; agent recommended, learner accepted).
- LLM provider: Google Gemini API (changed from Anthropic during the build; see `checklist.md > Revisions`).
- Matching: plain code, not LLM.
- LLM failure: assume the API is reachable for the demo; no offline or local-model path.

**Agent-derived implementation details (from the above; changeable)**
- Tailwind, Inter, the `localStorage` key, the file layout, the 30/90-day color scale, the matching score and its 0.5 threshold, and the logo-via-Claude-domain idea.
- The three script sections (Opening, If they refuse, Closing): the PRD requires at least the first two.

**Learner uncertainty**
- None identified during the interview. The learner asked clarifying questions about Next.js (answered: framework built on React with routing and server routes), and about a local-model fallback (answered and deferred).

**Open or to check in the build**
- Verify current Next.js/Node versions, Gemini structured-output usage, and the favicon lookup (see Stack and External Services).
- Color thresholds and the matching threshold are starting values to tune (`prd.md > Open Questions`).
- Cancelled-tab row content is assumed to be icon, name and cancelled date (`prd.md > Open Questions`).
- A seed/demo-data loader is included so the demo can start from a ready state; sample data is labeled in the UI.
