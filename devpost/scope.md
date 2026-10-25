---
doc: scope
status: approved
---

# Subscription Tracker with Negotiation Coach

A mobile-friendly app that tracks your subscriptions, warns you when a promo ends or a price rises, and then helps you negotiate a better price using what other people actually got.

## The Unique Kernel
Most subscription trackers stop at "your price is going up." This one goes on to what to do about it. Crowdsourced results of what people successfully negotiated feed an LLM, which writes a call script grounded in real outcomes. Tracking and the alert get the user to the moment where they can act.

## Who It's For
Anyone with recurring subscriptions: internet, TV, cell phone, gym, streaming. They check in on their phone or get a notification, and they often lose track of dates. Today they notice only when a bill jumps. The learner's own case is a Bell Canada internet promo (a 2-year discount) that expired unnoticed. The bill rose about $10–20/month, and the learner then spent a long phone call getting a new promo.

## The Core Loop
The user opens the app and sees an action area at the top for the most urgent items (promos ending, renewals coming up), sorted by date, with all subscriptions below. They tap one to see its details. They compare the current price to the new price, monthly and yearly. If the price is going up they tap Negotiate, see what others got, and generate a script to read on the call. They can also choose to switch plans or cancel. They come back because the app tells them when something needs attention, and they can check in any time.

## Inspiration & Identity
No references named. Visual direction volunteered: a clear good/bad signal, with the current price in green and a rising new price in red with an up arrow. Mobile-first and convenient.

## Why This Matters to the Learner
"I didn't know that it expired... the price jumped... I had to bother them and talk for quite a while on the phone." They want to stop losing track of subscriptions that quietly accumulate on a credit card. They also want hands-on AI agent and LLM experience for their resume, plus a working hackathon demo. They may later extend the project themselves.

## What "Working" Looks Like
In the demo video, someone opens the app and sees a list of subscriptions with a "needs attention" area on top. They tap a Bell internet subscription whose promo is ending. The detail screen shows the current price in green and the new price in red with an up arrow, monthly and yearly, so the extra yearly cost is obvious. They tap Negotiate and see what others negotiated for that kind of subscription, with possible prices to ask for. They tap generate and the LLM writes a script to read on the phone. The "oh, that's cool" beat is the script that uses real negotiation outcomes.

## The POC Boundary
- Manual add-subscription form: category, monthly cost, discount/promo, promo end date, and the post-promo price (all entered by the user).
- Subscription list with a "needs attention" area sorted by date.
- Detail screen with a current vs. new price comparison (monthly and yearly), with green/red indicators.
- Negotiate screen showing pre-written (seeded) sample negotiation results.
- LLM-generated negotiation script informed by those seeded results.
- A mobile-sized web app.

## Later
- Background push notifications, with the "emergency only / all updates" setting.
- Timeline or calendar view of renewal dates.
- Monitoring bills in email to detect price changes automatically.
- Suggesting cheaper plans (e.g. ad-supported tiers).
- Live crowdsourcing: users submit their own negotiation results to a shared database (the learner plans to add this themselves after the hackathon).

## Explicitly Cut
- Native phone app: a mobile-sized web app shows the same thing in far less time.
- Real user accounts: not needed to prove the kernel.
- Moderating crowdsourced entries: only relevant once live submissions exist.
- Live crowdsourcing submissions (for the hackathon): seeded examples demonstrate the idea within the time budget.
