# 02. Brainstorm: opportunities ranked by demo value against build cost

Scoring: Demo value 1 to 5 (how much a judge will remember it), Build cost in person-hours for one
of us with an AI coding agent, Risk (what breaks). MVP takes everything with value 4+ and cost <= 2h.

| # | Idea | Value | Cost | Risk | Verdict |
|---|------|-------|------|------|---------|
| 1 | Persona entry: "I am a [student / international student / new to Austin / starting a business / retiree] looking for [checking / savings / credit card / loan / not sure]" that seeds the conversation | 5 | 1h | low | MVP |
| 2 | Front-desk assistant: streaming chat with tool calls that render product and resource cards, every card linked to a real ufcu.org URL | 5 | 2h | API latency, hallucination | MVP (with offline fallback) |
| 3 | Identity paths instead of one SSN gate: SSN / ITIN / foreign status (passport + W-8BEN + I-20) with a "what you'll need" checklist generated from the answers | 5 | 1.5h | low | MVP |
| 4 | Secure Zone application, visibly distinct from chat, prefilled from the conversation, 5 short steps | 5 | 2h | scope creep | MVP |
| 5 | Mock identity verification with a visible trust meter (document check, liveness, data consistency, risk tier routing: instant / video banker / branch) | 4 | 1.5h | over-engineering | MVP, keep it to one screen |
| 6 | Decision screen that explains: approved / needs one more thing / not yet, with reasons and the alternative (secured card, credit builder loan) | 4 | 1h | low | MVP |
| 7 | Personalized next steps after approval (direct deposit from Workday for UT jobs, Zelle caveat for no-SSN, campus ATMs, credit builder loan) | 4 | 0.5h | low | MVP |
| 8 | Language switch EN / ES / KO covering UI strings and assistant replies | 4 | 1.5h | translation quality | MVP for 3 languages, PT/FR stretch |
| 9 | Plain-language disclosure summaries with "read the full PDF" links, translated | 3 | 1h | legal tone | Stretch |
| 10 | On-the-fly translation of a branch PDF (the banker's "amazing") | 3 | 1.5h | PDF parsing | Stretch, demo with a pre-extracted text |
| 11 | Business persona branch: entity type picker, document checklist, personal membership first | 3 | 1h | corpus thinness | Stretch (persona 3 scripted only if short on time) |
| 12 | Accessibility mode: large type, high contrast, "call me instead" button with branch phone, voice input | 3 | 1h | low | Stretch, shows "all generations" |
| 13 | Save and resume via a magic link or code | 2 | 1h | needs storage | Cut, mock with localStorage only |
| 14 | Figma design prototype of the flow | 3 | 1h (parallel) | none | Required deliverable; build from screenshots at 1:30 PM |
| 15 | Joint account and minor (Teen Checking with guardian) paths | 2 | 1h | branching | Cut, mention in future work |
| 16 | Real UFCU brand extraction (colors, type) from ufcu.org | 3 | 0.5h | none | MVP, do it in the setup sprint |
| 17 | Video call with a banker (mock scheduling screen) as the medium-risk identity route | 3 | 0.5h | none | MVP as a static screen in the trust routing |
| 18 | Referral code, card design picker, funding via linked bank | 1 | 1h | none | Cut; keep card design picker as a 10-minute delight if ahead |
| 19 | Voice-first onboarding | 3 | 2h+ | browser APIs | Cut |
| 20 | Credit score education mini-simulator | 2 | 1.5h | distraction | Cut |

## Ideas we considered and rejected
- A generic ChatGPT-style chat page. Explicit non-negotiable in the Google Doc: no wrapper UI.
  Every assistant turn must render structured cards or actions, not paragraphs.
- Real KYC vendor integration (Persona, Alloy). UFCU said not to. We mock and label.
- Rebuilding the whole ufcu.org. The banker said scope to onboarding; so did the challenge.
- A mobile app. The agenda mentions mobile, the challenge says web app that runs locally. We build
  a responsive web app and demo it at phone width in the deck.

## The concept in one paragraph
Front Desk is the digital version of the University Branch front desk. You tell it who you are and
what you are trying to do, in your language. It answers like a banker: which account, why, what it
costs, what you will need, with every claim linked to ufcu.org. When you are ready, it opens a
separate, visibly secure application that is already filled in with what you told it, routes you
down the identity path that fits you (SSN, ITIN, or foreign status), verifies you with a transparent
confidence readout, and ends with a decision it explains and a checklist of what to do next.

## Naming
Working title "Front Desk". Alternatives if the team wants something warmer: "Welcome Desk",
"UFCU Concierge", "Open Door". Decide at the setup sprint in under two minutes; the name only
appears in the header and the deck.
