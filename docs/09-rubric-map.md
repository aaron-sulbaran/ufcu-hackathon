# 09. Rubric map: what earns a 5 in each category

Official scorecard (Resources/Rubric_Scorecard_Participants.pdf). 100 points, six categories, 1 to 5
rating times a weight. Product fit, speed, and UX are 65 of the 100 points; compliance is 10.
Build and demo priorities follow that order.

| Cat | Weight | Points | What the 5 says | What we show to earn it | Owner |
|-----|--------|--------|-----------------|-------------------------|-------|
| A. Member onboarding and product fit | x5 | 25 | Understands member segments; journey naturally leads to an appropriate product bundle with clear value explanation | Persona sentence (segments, including switching from another bank), assistant recommends a bundle (savings + checking + credit builder) with a reason line per product, sources linked; Secure Zone step 4 shows the bundle with plain-language value | A, C |
| B. Speed and friction reduction | x4 | 20 | Dramatically faster end to end; progressive profiling, single flow for multiple products, reuse of verified data | Step counter with elapsed time on screen; prefill from the conversation; Switch Kit after approval; one application for the whole bundle; identity verified once and reused for every product; compare to today's two-host flow in the deck | B |
| C. UX intuitiveness and creativity | x4 | 20 | Exceptionally intuitive and inclusive; anticipates questions; strong microcopy, visuals, guidance | Cards not paragraphs; "why we ask" microcopy on every sensitive field; inline validation with friendly errors; state feedback (saved, verifying, done); language switch; accessibility mode | C, B |
| D. Technical execution and feasibility | x3 | 15 | Strong implementation; clear path to integration with core banking, CRM, KYC vendors | Working local app; architecture slide with a "swap points" row: KYC vendor behind the trust readout, core behind the decision, CRM behind the persona context; mocks labeled | A |
| E. Compliance, trust, risk awareness | x2 | 10 | Member-friendly consent, data use, regulatory steps; balances experience with safety | Chat never takes PII; Secure Zone explains why each field is needed; consent checkboxes with plain summaries and full PDFs; W-8BEN acknowledgment for foreign status; Patriot Act notice in one sentence | B |
| F. Pitch and communication | x2 | 10 | Memorable, concise, perfect before-versus-after, clear answers | Open on the current screen-one gate, close on the same person approved; rehearsed twice; Q&A owners by topic | C, all |

## Kickoff emphasis: switching from a competitor
The hosts asked teams to show how easy it is to switch from a big bank. See docs/10-competitor-switch.md:
every competitor's first screen asks for an SSN; ours asks what you need; approval ends with a Switch Kit.

## Changes this forces in the plan
1. Add a visible step and time counter to the Secure Zone (B). Ten minutes of work, four points of rubric.
2. Add "why we ask" helper text under every sensitive field (C and E). Copy lives in `messages/en.json`.
3. The application must open the whole bundle in one pass and say "verified once, used for all three" (B).
4. The architecture slide gets an integration row (D). No new code, one slide.
5. The demo must show the product bundle screen with value lines, not just the chat cards (A).
6. Compliance is 10 points; the trust readout stays but does not grow. One screen, no more.

## Kickoff notes that shape the pitch (Granola, 2026-09-19 8:30 AM)
- Judging is Shark Tank style; deliverables are due 2:30 PM, presentations at 3:00.
- They want reimagined, not incremental. "Simplicity is the ultimate form of sophistication."
- Explicit target: shift the member base younger; design as if you are the primary user.
- Minimal information captured while still validating identity and preventing fraud; balance
  regulation and privacy with a frictionless flow.
- Strong ideas may be investable; UFCU is open to startup conversations. Say what the product would be
  as a standalone in one line of the close.
- Products in scope: deposits, lending, mortgages, investments. "Experience is the real product."
