---
doc: prd
status: approved
---

# Subscription Tracker with Negotiation Coach — Product Requirements

A mobile-friendly web app that tracks subscriptions, flags promos that are about to end, and helps the user negotiate a better price with a short, sectioned call script grounded in what others got. For anyone with recurring subscriptions (internet, TV, cell, gym, streaming).
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

## The Core Journey
1. **First open, nothing added.** The user sees the message "Get started — add a current or new subscription" and a small circular plus button in a lower corner of the screen (`scope.md > The Core Loop`).
2. **Add.** They tap the plus and fill in the add-subscription form (see *Add subscription*). They save and return to the list.
3. **List.** On the **Active** tab, a "needs attention" area sits on top, with all subscriptions below. Each row shows the brand icon, name, a status color, monthly cost now, cost after the promo, and an up/down arrow.
4. **Detail.** They tap a subscription and see everything about it: current price (green) vs. new price (red, up arrow), monthly and yearly, plus promo and contract details.
5. **Negotiate.** If the price is going up they tap Negotiate and see what other people with an equivalent plan negotiated. They select the result they want to aim for.
6. **Script.** They tap the button and get a short, sectioned call script. The provider's phone number or email is shown prominently at the top and is tappable. They can regenerate or tweak the script.
7. **Outcome.** After the call they edit the subscription with the new price and promo dates, or cancel it. A cancelled subscription moves to the **Cancelled** tab.

*Success looks like* (`scope.md > What "Working" Looks Like`): someone opens the app, sees a "needs attention" area with a Bell internet subscription in it, opens it, sees the green current price vs. red new price with the extra yearly cost, taps Negotiate, sees what others got, and generates a script that uses those outcomes.

## Screens and Layout
Navigation: two tabs at the top, **Active** and **Cancelled**. A small circular plus button is fixed in a lower corner on every screen of the Active tab so the user can add a subscription at any time.

- **Empty home / first use** — message plus the circular plus button.
- **Active tab (subscription list)** — "needs attention" area on top, all subscriptions below.
- **Cancelled tab** — cancelled subscriptions, each with Restore and Delete.
- **Add / edit subscription form.**
- **Detail screen** — larger screen with the icon and name at the top, then the details and actions.
- **Negotiate screen** — seeded results for the user's plan; select one to aim for.
- **Script screen** — contact at the top, sectioned script beneath.

## Look and Feel
Clean, professional, modern, uncluttered. Direction (the learner asked for suggestions and agreed to this start):
- **Theme:** dark charcoal gray background (not black, never pure white), slightly lighter gray cards for each subscription row.
- **Text:** soft off-white.
- **Type:** a clean modern sans-serif (e.g. Inter); large bold numbers for prices, small muted labels.
- **Color:** the green-to-red status range is the only strong color; everything else stays neutral gray. Current price in green, a rising new price in red with an up arrow.
- **Layout:** generous spacing, one idea per card, no decoration or heavy borders. Mobile-first.

## Features and Behavior

### Add subscription
Fields, in order:
1. **Name** of the subscription.
2. **Category** — drop-down list with a "custom" option. Choosing custom reveals a text field for a category not in the list.
3. **Plan** — the user describes their plan in their own words (typed, or dictated with the phone keyboard's built-in voice-to-text), e.g. "50 GB data, unlimited Canada-wide calling". The LLM converts the description into structured plan features. Plans matter because tiers differ (TV channel packages, Netflix with ads vs. more users).
4. **Contact** — phone number or email for the provider. **Required**; cannot be left blank.
5. **Start date.**
6. **Contract or not.** If contract, the user enters its length (e.g. one or two years). If not, there is no end date to enter (a recurring monthly charge like Netflix).
7. **Full price per month** (without discount).
8. **Discount** (amount).
9. **Promo end date** — the date the user has to act.

The app calculates: current price = full price − discount; new price after the promo = full price. Example: full price $60, discount $15 → pays $45 now, $60 after the promo.

The brand icon is looked up online and added by the app (see *Brand icon*). The user does not enter it.

- [ ] Choosing the custom category shows a text field; choosing a listed category does not.
- [ ] Choosing "not a contract" hides the contract length.
- [ ] The form cannot be saved with the contact field empty.
- [ ] After entering a plan description, the saved subscription has structured plan features (visible on the detail screen).
- [ ] Saving returns the user to the Active list with the new subscription in it.

### Brand icon
Each subscription shows an icon in the list row and at the top of the detail screen. The app looks up the brand's logo online. If none is found, it shows a **letter circle** (a colored circle with the subscription's first letter). The logo lookup is the first thing to cut if time gets tight; the letter circle alone is acceptable.

- [ ] A subscription whose logo can't be found shows the letter circle in both the list and the detail screen.

### Subscription list (Active tab)
Each row shows: brand icon, name, a status color (green → yellow → orange → red depending on how close the promo end date is; red also when the end date has already passed), cost per month now, cost per month after the promo, and an up/down arrow like a stock indicator.

**Needs attention** is automatic: a subscription appears in the top area once **30 days or fewer** remain before its promo ends, or its promo end date has passed. The user does nothing. The same 30-day window applies to contract and non-contract subscriptions. The area is sorted by date (most urgent first).

- [ ] A subscription whose promo ends in 30 days or fewer appears in the "needs attention" area; one ending in 31+ days does not.
- [ ] A subscription whose promo ended in the past appears in the area, in red.
- [ ] Row color moves from green toward red as the promo end date approaches.
- [ ] Each row shows current monthly cost, post-promo monthly cost, and an arrow.

### Detail screen
Larger screen. At the top: brand icon and subscription name. Below: how long the user has had it, start date, promo end date, which promo/discount applies, plan features, contract info, the contact (tappable), and the price comparison: current price (green) vs. new price (red with an up arrow), monthly and yearly, so the extra yearly cost is obvious.

Actions: **Edit**, **Cancel subscription**, **Negotiate**. There is no delete on an active subscription. Switching to a new plan or price is done through Edit.

- [ ] Detail shows monthly and yearly current vs. new price, with the new price red and an up arrow when it is higher.
- [ ] Edit changes values and the list updates (including status color and "needs attention" membership).
- [ ] Active subscriptions offer Cancel, not Delete.

### Cancelled tab
Cancelling moves a subscription from Active to the Cancelled tab. Each cancelled row offers **Restore** (back to Active) and **Delete** (permanent). This mirrors real life: you cancel an active subscription; only cancelled ones can be deleted.

- [ ] Cancelling removes the subscription from Active and shows it on the Cancelled tab.
- [ ] Restore puts it back on Active; Delete removes it permanently.

### Negotiate screen
Shows seeded (pre-written) sample results from other people with an **equivalent plan** from the same provider/category. Each result shows the provider, the username, the price they started at, and the price they ended up with. Results where the person ended up paying more than they started are not shown. Results are sorted best to worst. The user selects the result they want to aim for (not necessarily the best — a higher price may come with a feature they want), then taps a button to create the script.

If no equivalent plan exists, the app shows the **closest match** (same provider or category). If nothing is similar, it shows "no results yet". The user can still create a script: the target is their **current promo price or lower**, and the script asks the representative to keep that price and see what they can offer.

- [ ] Results are sorted from lowest final price to highest.
- [ ] No result with a final price higher than its starting price appears.
- [ ] Each result shows provider, username, starting price, and final price.
- [ ] Selecting a result and tapping the button opens the script screen aimed at that price.
- [ ] With no matching results, the screen says "no results yet" and the script can still be generated, aimed at the current promo price.

### Script screen
- The provider's **contact** (phone or email), the brand icon, and the subscription details sit at the top. The contact is **tappable**: a phone number opens the dialer, an email opens the email app.
- Underneath is the negotiation script, **short and split into sections**, not one block. At least: an **opening** (e.g. "I noticed my promo is ending on [date] and I'd like to keep paying the same price or hear about a better promo you have") and **if they refuse** (cite the seeded results, e.g. "someone with this plan got this price — why can't I get the same?"). Only a few scenarios, kept brief.
- The user can **regenerate** and **tweak** the script by typed or dictated instructions (e.g. "make it more aggressive", "more professional").
- If the LLM cannot produce a script (e.g. no connection), the app shows a plain **template script** with the same sections, filled with the user's subscription details and target price, plus a note that the AI version isn't available. Something is better than nothing when the user needs to call.

- [ ] Contact is at the top and tappable (dialer for a phone number, email app for an email).
- [ ] The script appears in separate labeled sections including an opening and a refusal section.
- [ ] The script references the selected result's price (or the current promo price if none).
- [ ] Regenerate gives a new script; a tweak instruction changes its tone.
- [ ] When generation fails, the template script appears with a note, never an empty screen.

## States and Boundaries
- **First use / empty** — message "Get started — add a current or new subscription" and the circular plus button.
- **Nothing needs attention** — the "needs attention" area is empty or hidden; all subscriptions show in the list, all green.
- **Cancelled tab empty** — nothing listed. *(Assumption: a short "nothing cancelled" message.)*
- **Returning to the app** — the user sees the same subscriptions they had. After days have passed, colors and "needs attention" membership update because the dates have moved. Subscriptions stay on the device between visits; no accounts.
- **Invalid form input** — the form can't be saved with the contact missing. *(Other validation, such as required dates and price format, is an assumption for the build; the form should not save obviously unusable input.)*
- **Logo not found** — letter circle.
- **Plan description can't be read by the LLM / connection unavailable** — *(assumption: the subscription saves with the plan text as typed; see Open Questions)*.
- **Script generation fails** — template script plus a note.
- **No Negotiate results** — closest match, else "no results yet", script still available.

## Product Decisions
- User enters the full price and the discount; the app derives the current and new prices, so the user doesn't have to enter a final price.
- Contract vs. month-to-month is part of the form — contracts (e.g. cell plans) behave differently from open-ended subscriptions like Netflix.
- Custom category supported via a revealed text field.
- After save, return to the list.
- Small circular plus button always visible in a lower corner, replacing the big centered plus — so the user can add a subscription at any time.
- "Needs attention" is automatic at 30 days or fewer before the promo ends, same window for contracts "to keep it simple".
- Row status color runs green to red by closeness to the promo end; arrows like stock-market indicators.
- No delete on active subscriptions — you cancel first, like real life; delete only in the Cancelled tab. Restore exists because people can re-sign up.
- Plan is a required concept, described in the user's own words (typed or dictated) and structured by the LLM, because tiers differ and Negotiate results must match an equivalent plan.
- Contact is required, so the user doesn't have to look up how to reach the provider later.
- Letter circle is the logo fallback (the learner preferred it over an LLM-generated icon).
- Template script fallback instead of a bare "try again" because the user may urgently need to call.
- Results where the person paid more are hidden; the user may pick a result other than the best.
- Look and feel: dark charcoal gray, modern sans-serif, uncluttered.

## What We're Building
Per `scope.md > The POC Boundary`, plus the decisions above:
- Add/edit subscription form including plan (LLM-structured) and required contact.
- Active list with automatic "needs attention" area, status colors, icons (logo lookup with letter-circle fallback), cost-now/cost-after with arrows.
- Detail screen with current vs. new price (monthly and yearly) and the actions Edit, Cancel, Negotiate.
- Cancelled tab with Restore and Delete.
- Negotiate screen with seeded results, filtering, sorting, selection, closest-match and no-results behavior.
- LLM-generated sectioned script with tappable contact, regenerate/tweak, and a template fallback.
- Mobile-sized web app, dark theme.

## Deferred From the POC
- Push notifications (the "needs attention" area is the only alert) — needs background infrastructure.
- Timeline/calendar view of renewal dates.
- Email bill monitoring.
- Cheaper-plan suggestions (e.g. ad-supported tiers).
- Live crowdsourcing: users submitting their own results — needs accounts, a shared database and moderation. The seeded examples demonstrate the idea. (The learner plans to add this after the hackathon.)

## Possible Later Enhancements
- LLM looks up a provider's real plans online to suggest them in the form.
- A local on-device model so scripts work offline.
- LLM-generated icons for services with no logo.
- Different attention windows for contracts vs. open-ended subscriptions.

## Non-Goals
Native app, user accounts, live crowdsourced submissions, moderation (see `scope.md > Explicitly Cut`).

## Open Questions
- Exact color thresholds between green and red (assumed to scale smoothly with days left, red at or past the end date) — can be settled during the build.
- What a Cancelled-tab row shows (assumed: icon, name, cancelled date) — can wait.
- Does a contract's end date also trigger attention? The learner chose to treat contracts like other subscriptions for now — can wait.
- What happens if the LLM can't read the plan description when saving (e.g. no connection)? **Assumption (not yet confirmed by the learner):** the subscription still saves with the plan text as typed, and the app structures it later or matches on the raw text. Confirm or change this in `4-spec`.
