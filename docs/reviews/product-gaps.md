# Product and demo-readiness review (judge's seat)

Date: 2026-09-19, mid-build snapshot against the dev server on :3000 (scripted offline mode).
Method: clicked through /, the persona chips, /desk, and /apply end to end as Joon, plus spot
checks as Maya and a non-persona Korean start. Code read where the browser could not tell me why.
Caveat: the working tree was being edited while I looked (landing copy, the desk empty-state
greeting, and pt.json all changed mid-pass), so re-run the dry run after the next merge.

Rubric, PRD, script, and personas were read from docs/09, 03, 06, 10, 07, 08.

## 1. Rubric scorecard as a judge would fill it today

| Cat | Wt | Rating | Evidence (what I saw) | The one change that adds a point |
|-----|----|--------|------------------------|----------------------------------|
| A. Onboarding and product fit | x5 | 4 | Persona sentence covers seven segments incl. switching; chat renders a bundle with a reason line per product and a real ufcu.org source link; Joon gets the foreign-status checklist before any form. But step 4 of the application shows the bundle without the reason lines, and Maya's Credit Builder Loan (the credit-building product) is not in her prefill, so the application bundle is savings + checking only. | Carry the chat reasons into the step 4 bundle cards and put credit-builder in Maya's prefill so the application shows the bundle with plain-language value. |
| B. Speed and friction | x4 | 3 | Step counter and elapsed timer are live in the Secure Zone header; review says "verified once, applied to every account"; decision screen prints start-to-finish time. But prefill carries only first name and school, so step 2 needs ten typed fields plus a checkbox (Joon: 1:33 with fast typing; PRD says under 90 s with no typing). Switch Kit is one card, not the four-item kit. And a stored application always wins over a new prefill, so the second persona resumes the first persona's application. | Persona-aware "Use sample" prefill of step 2 (or richer prefill from personas.json) plus reset the stored application when a new prefill arrives. |
| C. UX and creativity | x4 | 3 | Cards not paragraphs, three quick replies in the right language, "Why we ask" toggle on every sensitive field, friendly inline errors, Saved and Verifying state, language switch, larger-text toggle. But the persona chip sometimes lands on an empty chat with no error shown, the Korean screen is half English (product names, taglines, highlights, "Opens with / Monthly fee", eligibility card chrome, resource summaries), and the non-persona Start yields no first turn at all. | Make the first turn reliable (chips and sentence) and translate the card chrome so the Korean screen reads as one language. |
| D. Technical execution | x3 | 4 | Working Next.js app, four tools, static corpus, scripted fallback that renders through the same cards, mocks labeled Simulated, deck has the swap-points row. Flakiness in auto-send and the shared-localStorage collision are the visible cracks. | Fix the auto-send race (StrictMode double effect) and the application reset; a judge who sees an empty chat once discounts everything after. |
| E. Compliance and trust | x2 | 4 | Chat never asks for PII and the prompt forbids it; CIP sentence on steps 1 and 2; consent is three unchecked boxes with plain summaries and a link to the real disclosures page; W-8BEN acknowledgment on the foreign path; passport masked on review; Simulated badge on every mocked surface. Small tears: branch hours differ between the route card (10 to 4) and the decision (9 to 5); all three "Read the full document" links go to the same generic disclosures page. | Add one Patriot Act / CIP notice line on the review screen and fix the hours mismatch; nothing bigger is worth the time. |
| F. Pitch and communication | x2 | 3 | Eight-slide deck exists with the gate slide, personas, trust, architecture, non-goals, and the closing line. But three script beats cannot be performed as written (see section 3), and the deck's gate slide has three competitor screenshots and no UFCU screenshot. | Rewrite docs/06 to match the build that exists (Joon by chip, Maya bundle line, Daniela in deck) and rehearse twice. |

Weighted total today: A 20 + B 12 + C 12 + D 12 + E 8 + F 6 = 70 / 100.
Reachable by 1:30 PM with the top four gaps fixed: A 25 + B 16 + C 16 + D 15 + E 8 + F 8 = 88.

## 2. PRD acceptance criteria (M1 to M7), from the browser

| Module | Status | What I saw |
|--------|--------|------------|
| M1 Persona entry | partial | Landing, sentence, four chips, EN/ES/KO switch all work and are fully translated. Fail: "Talk to the front desk" lands on a chat with a static greeting and no first assistant turn that references the two choices. Also the sentence flow does not clear a stale personaId from a previous chip, so the API would replay that persona's script for a different person. |
| M2 Conversation | partial | Joon: three scripted turns render eligibility card, three product cards, resource cards with valid URLs, then the Continue card. No turn asks for SSN, DOB, or address. Fail: chip auto-send fired on some loads and not others (two of four attempts showed an empty chat with no error message; useChat error is never rendered). |
| M3 Secure Zone | pass with a friction fail | Dark chrome, lock line, five steps, path preselected from prefill, checklist, path-specific ID fields, W-8BEN checkbox, zod errors, localStorage persistence. Fail on the acceptance sentence: step 2 requires ten typed fields, so "no typing except the sample ID button" is not met. |
| M4 Trust readout | pass | Joon: document pass, face pass, consistency review, watchlist pass, confidence 82, video route with three fixed slots and the University Branch card; Simulated badge; scripted per persona. Maya and Daniela route instant per personas.json (code verified, not clicked). |
| M5 Decision and next steps | pass, one gap | Joon: "One more thing" with the video item and how-to; four next steps with ufcu.org links (ATMs, wires, Zelle caveat, add SSN later). Elapsed time printed. Gap: Daniela's list has a single Switch Kit card, Robert's has deposit and autopays but not "keep the old account one cycle" or "close it"; the full four-step kit only appears through the rule path, which personas override. |
| M6 Internationalization | fail | Korean landing: yes. Korean assistant turns and reasons: yes. Korean application: no. ko.json and es.json carry 53 of 212 keys; every apply.* field label, error, disclosure, trust check, route, decision, and next-step string falls back to English. Product names, taglines, highlights, eligibility and resource card chrome are English in every language. html lang stays "en"; Noto Sans KR is loaded but not applied (body renders Inter). |
| M7 Rubric additions | partial | Step counter and elapsed timer: yes. "Why we ask" on every sensitive field: yes. Inline validation with friendly copy and Saved state: yes. "Verified once, applied to all" on review: present but generic ("every account in this bundle"), and the bundle it describes does not include the credit builder loan for Maya. |

## 3. Demo script dry run (docs/06 beat by beat)

Beats that cannot be performed as written today:

1. 0:45 "Switch the header to Korean. Landing: I am an international student and I want a checking account. Start." Start opens a chat with a greeting and no assistant turn, and the stale personaId would make the API answer as the last chip used. Only the Joon chip produces the scripted Korean turns, and the chip auto-send is flaky (worked on a direct URL load, blank on a client-side push and on one reload).
2. 0:45 "two cards: Simply U and the resource card Opening an account without an SSN." The build shows an eligibility card, three product cards (Savings, Free Checking, Simply U), and two resource cards (open-account requirements, wires). Fine content, wrong narration; and the cards are English inside a Korean turn.
3. 0:45 "Point out the chrome change ... Step 1 shows the Foreign status path." Works, but only if no application is already stored. Any rehearsal run leaves frontdesk.application in localStorage, and that beats the new prefill, so the Secure Zone resumes the previous run (I saw Joon's path with Maya's stored step 2). Clear storage between rehearsal and demo or fix the reset.
4. 0:45 "Sample ID, sample selfie." Before step 3 the driver types last name, DOB, email, phone, occupation, street, ZIP, passport number, issuing country, and ticks W-8BEN. Thirty seconds of live typing in front of judges, in the beat the script calls "no typing".
5. 0:45 "Trust readout in Korean application." The application is English regardless of the header language (M6 fail).
6. 0:45 "Decision: Almost there: verify by video at 3:15 today." The screen says "One more thing and you are done", the slots are 10:30, 1:15, 3:45, and the chosen slot is not echoed in the decision; the how-to line says weekdays 9 to 5 while the route card said 10 to 4.
7. 2:15 Maya "Continue. SSN path, prefilled name and school, ... Approved." The prefill works but the Secure Zone will still be sitting on Joon's decision screen unless storage is cleared (same gap as 3). This is the beat most likely to die live.
8. 3:00 "point at the line 'verified once, applied to savings, checking, and the credit builder loan'." The line reads "applied to every account in this bundle" and Maya's bundle is Savings + Simply U; the credit builder loan is a chat card only.
9. 3:15 Daniela "her approval ends with the Switch Kit: move direct deposit, re-point autopays, keep the old account one cycle, close it." Her next steps show one card, "Switch Kit: move your direct deposit". The LLC checklist by entity type does show in the chat (good). Her Spanish application is English.
10. Q&A "Accessibility ... phone number always visible, call me instead button." Larger text exists. /desk has no footer, so the phone number is not on the conversation screen; there is no "call me instead" control.

Beats that work as written: the Zelle question in Korean (quick reply, correct answer, Zelle page linked), the Secure Zone chrome change, the step 1 foreign-status checklist, the trust readout with confidence 82 and the University Branch scheduler, Maya's Simply U + Credit Builder cards with reasons and sources, the trust slide, the architecture slide, the non-goals slide, the close.

## 4. Ranked gap list

| # | Gap | Rubric points at stake | Effort (min, one engineer + agent) | Lane |
|---|-----|------------------------|--------------------------------------|------|
| 1 | Stored application beats new prefill; second persona resumes the first persona's run. Reset frontdesk.application when the Continue card writes a prefill whose personaId or products differ, and offer "Start over" in the Secure Zone header. | B 4, D 3, F 2 (the demo dies otherwise) | 20 | B (lib/apply/state.tsx, lib/apply/prefill.ts) |
| 2 | Chip auto-send is flaky and errors are silent. Guard the effect against StrictMode double-run correctly (send after mount via a microtask, or seed initial messages), render useChat error with a retry, and make the sentence flow send a first turn that mentions audience and goal (and clear personaId). | C 4, A 5, F 2 | 30 | A (components/desk/conversation.tsx, app/api/chat/route.ts) |
| 3 | Korean and Spanish application is English. Generate the missing 159 apply.* keys into ko.json and es.json (Claude, then a native read), set html lang from context, apply --font-kr when lang is ko. | C 4, A 5 (M6 is a headline claim) | 40 | C (messages/ko.json, es.json, app/layout.tsx) |
| 4 | Step 2 needs ten typed fields. Add a persona-aware "Use sample" button on step 2 that fills fictional sample data (labeled Sample), or extend prefill in personas.json with the non-sensitive fields. | B 4 | 25 | B (components/apply/steps/step-about.tsx, lib/apply/personas.ts) |
| 5 | Maya's bundle lacks the credit builder loan, and the review line is generic. Add credit-builder to Maya's prefill products and render the review line with the product names ("verified once, applied to Savings, Simply U, and the Credit Builder Loan"). | A 5, B 4 | 15 | A for personas.json, B for review-summary.tsx |
| 6 | Step 4 bundle cards have no reason line. Persist the chat reasons in the prefill (id + reason) and pass them to BundleCard. | A 5 | 20 | A writes reason into startApplication prefill, B reads it |
| 7 | Switch Kit is one card for Daniela and two for Robert. Append the rule-based switch steps to persona next steps when audience is switching_banks or notes mention moving banks, and give the kit a visible "Switch Kit" heading. | B 4, A 5 (hosts asked for this) | 20 | B (lib/apply/next-steps.ts) |
| 8 | Card chrome is English in every language: "Opens with", "Monthly fee", "Your path", "What to bring", product names, taglines, highlights. Move the chrome labels to messages and add ko/es name and tagline fields to products.json. | C 4 | 30 | A for cards and products, C for messages |
| 9 | Decision copy drifts from the route card: chosen slot not echoed, hours 9 to 5 vs 10 to 4, script says 3:15. Echo the booked slot in the decision item and use BRANCH hours everywhere. | E 2, F 2 | 10 | B (lib/apply/decision.ts, data/personas.json joon.decision) |
| 10 | No phone number or "call me instead" on /desk. Add the footer to the desk page and a small phone card action in the header for accessibility mode. | C 4 | 10 | C (app/desk/page.tsx, components/shared/header.tsx) |
| 11 | Deck gate slide has three competitor screenshots and no UFCU screenshot; the script's strongest line depends on the four-up. Capture open.ufcu.org step 1 and add it. | F 2 | 10 | C (docs/deck/index.html, docs/research/competitors) |
| 12 | Passport masked with the SSN pattern ("... .. 0000") and the review labels "First name: Joon Park". Mask passports as last three characters and label the row "Name". | E 2 | 10 | B (components/apply/review-summary.tsx) |

Order of work if only four fit: 1, 2, 5, 4. Those four turn the two live demo personas from "might die" into "runs twice in a row".

## 5. Three delight ideas under 20 minutes each

1. Before-and-after timer card on the decision screen: "Front Desk: 1:33. Today's flow: two hosts, a branch appointment, and a callback." Put the elapsed time next to a static line about the current process, so the speed beat is one frame nobody has to narrate. (B, 15 min)
2. "What the banker would say" toggle on the trust readout: one sentence per check in first person ("Your passport scanned clean, I just need a minute on video to confirm the address"), in the selected language. Turns a KYC table into the front desk the pitch is named after. (B for the toggle, A for copy, 20 min)
3. Sticky "Nothing sensitive was typed here" receipt on the Continue card: list the three things the conversation learned (name, path, products) with a lock and the words "the rest happens on the secure page", then animate the card sliding into the dark Secure Zone header on click. Makes the zone change a moment instead of a route. (A for the card, C for the transition, 20 min)
