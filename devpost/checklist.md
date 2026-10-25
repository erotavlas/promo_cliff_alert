---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. You can add a subscription and see it in your list**
  Becomes usable: A running mobile-sized dark app. First open shows "Get started — add a current or new subscription" and a round plus button; the form saves a subscription (no AI yet) and it appears in the Active list with current price, post-promo price and an arrow, and is still there after a reload.
  Why now: Proves the whole path end to end — scaffold, form, storage, list — so every later slice has somewhere to land. Storage is tiny here (`localStorage`), so it belongs in this slice rather than a separate one.
  PRD ref: `prd.md > The Core Journey` (steps 1-3), `prd.md > Add subscription`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Stack`, `spec.md > Components` (Storage, Pricing, Add Form, Active List), `spec.md > File Structure`, `spec.md > Look and Feel`
  Build: Scaffold Next.js + TypeScript + Tailwind, verify versions, add Inter and the dark palette, `lib/types.ts`, `lib/pricing.ts`, `lib/storage.ts`, `SubscriptionForm` (custom category, hide contract length, required contact, basic validation), `SubscriptionRow` with a letter-circle `BrandIcon`, `AddButton`, empty state, Active/Cancelled tab header.
  Verify (mechanical): `npm run build` and `npm run dev` start cleanly; a pricing check confirms $60 full − $15 discount = $45 now / $60 after; submit a valid form and confirm the row renders and survives a reload; confirm an empty contact is refused.
  Learner check: Open the app at phone width, add a subscription, reload the page, and say whether it looks and feels the way you pictured.
  Commit: `Scaffold app with add form and active list`

- [x] **2. "Needs attention" and the detail screen with green vs red prices**
  Becomes usable: Subscriptions ending within 30 days (or already past) float into a "needs attention" area sorted by date, rows shift from green to red, and tapping a row shows monthly and yearly current vs new price. A demo-data button loads a few subscriptions including a Bell internet promo ending soon.
  Why now: This is the "oh no" half of the product and gives us demo data that every later slice needs.
  PRD ref: `prd.md > Subscription list (Active tab)`, `prd.md > Detail screen`
  Spec ref: `spec.md > Components` (Pricing and Status Logic, Detail Screen), `spec.md > Look and Feel`, `spec.md > Data Model`
  Build: `lib/status.ts` (days left, color scale, needs-attention test), `lib/sampleData.ts` and a demo-data button, "needs attention" area on `app/page.tsx`, `PriceComparison`, `ContactLink`, `app/subscription/[id]/page.tsx` with Edit/Cancel/Negotiate buttons present (Edit/Cancel wired later).
  Verify (mechanical): Run status/pricing checks on dates at 30, 31, 0 and −5 days; load demo data and confirm the right rows land in "needs attention" in date order; open a detail page and confirm monthly/yearly figures and arrow.
  Learner check: Load the demo data, find the Bell internet subscription in "needs attention", open it, and tell me whether the green vs red comparison makes the extra yearly cost obvious.
  Commit: `Add needs-attention list and detail screen`

- [x] **3. Negotiate: see what others got**
  Becomes usable: From a detail screen, Negotiate shows seeded sample results for an equivalent plan (else the closest match, else "no results yet"), no "paid more" entries, lowest final price first, with a "Sample data" label, and you can select one.
  Why now: This is the unique kernel (negotiation results grounded in real outcomes). It goes up early so the rest of the build serves it.
  PRD ref: `prd.md > Negotiate screen`
  Spec ref: `spec.md > Components` (Matching Logic, Negotiate Screen), `spec.md > Data Model` (NegotiationResult)
  Build: `data/negotiations.json` with sample results (including one Bell internet set, a "paid more" decoy and unrelated categories), `lib/matching.ts`, `app/subscription/[id]/negotiate/page.tsx` with selection and a "create script" button that navigates with `?result=<id>`.
  Verify (mechanical): Run matching against the demo subscriptions and confirm equivalent / closest / none cases, that no `finalPrice > startPrice` result appears, and the sort order; confirm the page renders each case.
  Learner check: Open Negotiate on the Bell subscription, on a different category, and on one with nothing similar. Tell me whether the results and their order make sense to you.
  Commit: `Add negotiate screen with seeded results and matching`

- [ ] **4. Generate a call script with Claude (with a template fallback)**
  Becomes usable: From Negotiate, tapping the script button opens a screen with the provider contact (tappable) at the top and a sectioned script (Opening, If they refuse, Closing) that cites the selected result's price. Regenerate and tweak work. If the AI call fails, a template script with the same sections appears with a note.
  Why now: This is the demo's "oh, that's cool" beat and carries the biggest unknown (the SDK and structured output), so it comes right after the data it depends on.
  PRD ref: `prd.md > Script screen`
  Spec ref: `spec.md > Components` (LLM Module and API Routes, Template Script, Script Screen), `spec.md > External Services and Dependencies`, `spec.md > Important Failure Modes`
  Build: Install `@anthropic-ai/sdk` and `zod`, verify `messages.parse` + `zodOutputFormat` against the installed version, `lib/llm.ts`, `app/api/script/route.ts`, `lib/templateScript.ts`, `.env.example`, `app/subscription/[id]/script/page.tsx` with Regenerate and tweak box.
  Verify (mechanical): POST to `/api/script` with a demo subscription and confirm schema-valid sections that mention the chosen price; with the key removed or invalid, confirm the page shows the template script with the note rather than an empty screen.
  Learner check: Choose a result, generate a script, regenerate it, then tweak it ("make it more aggressive") and confirm the tone changes. Then tell me whether you would read it on a call.
  Commit: `Add Claude-generated call script with template fallback`

- [ ] **5. Describe your plan in your own words and have Claude structure it**
  Becomes usable: The Add form sends the plan description to Claude, which returns structured plan features and a website domain; features show on the detail screen and improve Negotiate matching. A failed call shows a plain error and keeps what was typed.
  Why now: Matching quality depends on structured features, but slices 1–4 already work with raw text, so this improves them rather than blocking them.
  PRD ref: `prd.md > Add subscription` (Plan), `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (LLM Module and API Routes, Add / Edit Form), `spec.md > Data Model`
  Build: `app/api/plan/route.ts`, wire `SubscriptionForm` to call it on save, store `planFeatures` and `logoDomain`, show features on the detail screen.
  Verify (mechanical): POST a sample plan description to `/api/plan` and confirm schema-valid features and domain; with an invalid key confirm the form shows the error and keeps its values.
  Learner check: Add a new subscription with a plan described in your own words and confirm the features on the detail screen match what you meant.
  Commit: `Structure plan descriptions with Claude`

- [ ] **6. Edit, cancel, restore and delete**
  Becomes usable: Edit updates a subscription and the list and status update; Cancel moves it to the Cancelled tab; Restore brings it back; Delete removes it permanently. Active items have no delete.
  Why now: Completes the outcome step of the core journey (after the call you update the new price or cancel).
  PRD ref: `prd.md > Cancelled tab`, `prd.md > Detail screen`, `prd.md > The Core Journey` (step 7)
  Spec ref: `spec.md > Components` (Storage, Cancelled Screen, Add / Edit Form)
  Build: `app/subscription/[id]/edit/page.tsx` reusing `SubscriptionForm`, cancel/restore/delete in the hook, `app/cancelled/page.tsx` with empty message.
  Verify (mechanical): Edit a price and confirm the list/detail update; cancel, restore and delete a demo item and confirm `localStorage` contents at each step; confirm an active item offers no Delete.
  Learner check: Edit the Bell price after "negotiating", cancel another subscription, restore it, then cancel and delete it.
  Commit: `Add edit, cancel, restore and delete`

- [ ] **7. Logos, polish and a README for reviewers**
  Becomes usable: Brand icons show a real logo when the lookup works and fall back to the letter circle otherwise; `README.md` explains setup, `.env.local`, and how to run and demo.
  Why now: Logos are the first thing to cut, so they come last; the README is needed for submission.
  PRD ref: `prd.md > Brand icon`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Components` (Brand Icon), `spec.md > External Services and Dependencies` (Logo lookup), `spec.md > Where It Runs and How Someone Tries It`
  Build: Check favicon URL options, update `BrandIcon` with image-error fallback, a final pass on spacing/colors against Look and Feel, `README.md`.
  Verify (mechanical): Confirm a known domain renders a logo and an unknown one falls back to the letter circle; `npm run build` succeeds; follow the README from a clean `npm install`.
  Learner check: Look at the list and detail with logos on and tell me whether you like the result or want the plain letter circles.
  Commit: `Add brand logos, polish and README`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 3 (negotiate), when the full "needs attention to what others got" journey is visible and feedback can still shape the script
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: 
Route and stops: 
Edit outcome: 
Reflection: 
Activity mode: 

## Revisions
