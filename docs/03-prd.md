# 03. PRD / MVP plan: Front Desk

Owner: Aaron (captain). Status: draft for team approval Saturday 9:10 AM after the rubric read.

## Problem
UFCU's online account opening turns away the people its branches welcome. The first screen demands
an SSN or ITIN and a state ID; international students, people between documents, and anyone who
does not know which account they need are told to call or come in. The flow asks for full PII before
showing a single product, explains nothing in plain language, is English-first, and ends at
"You've been approved" with no guidance. The banker on Guadalupe St fills all of those gaps by hand,
in five languages, every day.

## Goal
A new member goes from "I think I need a bank account" to a submitted, trustworthy, prefilled
application in under five minutes, in their language, understanding what they opened and why,
without typing sensitive data into an AI.

## Users (demo personas, detail in docs/07-personas.md)
1. Maya, 19, UT sophomore, first account, wants to build credit, knows nothing about banking.
2. Joon, 23, Korean graduate student on F-1, no SSN yet, passport and I-20 in hand, prefers Korean.
3. Daniela, 34, starting a food-truck LLC in Austin, needs a business account, Spanish-comfortable.
4. (Stretch) Robert, 62, moving to Austin for an Ascension Seton job, wants big text and a phone number.

## Non-negotiables (from the team Google Doc)
- Languages: English, Spanish, Korean in the MVP; Portuguese and French as stretch; Mandarin only if free.
- A personalization layer: natural language in, personalized recommendation out.
- Every recommendation and card links to the real ufcu.org source.
- The conversation invites natural interaction with cards and real resources, and offers a simple
  non-chat way to start the application, prefilled from the conversation.
- The application looks and feels different from the chat so nobody types an SSN into a chatbot.
- No "ChatGPT wrapper" design. Assistant turns render cards, checklists, and actions, not essays.
- Architecture simple enough to explain on one slide. Model API only where it earns its place.

## MVP scope (must ship by 1:45 PM feature freeze)

### M1. Persona entry (Owner C)
Landing page in UFCU brand. Headline plus a two-dropdown sentence: "I am a [student / international
student / new to Austin / starting a business / retired or retiring / other] and I want [a checking
account / to start saving / to build credit / a credit card / a loan / I am not sure]". Submitting
opens the Front Desk conversation with that context. Four persona chips ("Try as Maya") preload the
demo paths. Language switch in the header (EN / ES / KO).

Acceptance: choosing any combination and pressing Start lands in the conversation with a first
assistant turn that references both choices. Persona chips work offline.

### M2. Front Desk conversation (Owner A)
Streaming chat over Claude via the AI SDK. System prompt carries the persona context, the language,
and the grounding corpus index. Tools the model can call:
- `recommendProducts` returns 1 to 3 product cards from `data/products.json` with reasons.
- `showResources` returns resource cards (title, one line, URL) from `data/corpus/`.
- `checkEligibility` returns the identity path (`ssn`, `itin`, `foreign_status`, `minor`,
  `branch_assist`) and the document checklist for it.
- `startApplication` emits a prefill object; the client renders a "Continue to secure application"
  card and navigates on click.
Every product and resource card shows its `sourceUrl`. The assistant replies in the selected language.
Offline mode (`FRONT_DESK_OFFLINE=1` or API failure) serves scripted turns for the four personas so
the demo cannot die on wifi.

Acceptance: for each persona, the first three turns produce at least one product card and one
resource card with valid URLs, then a `startApplication` card. No turn asks for SSN, DOB, or address.

### M3. Secure Zone application (Owner B)
Route `/apply`, visibly different chrome: dark header, lock icon, "Secure application. No AI reads
this page." Progress bar with five steps:
1. Your path: identity path preselected from prefill (editable): SSN / ITIN / Foreign status. Shows
   the document checklist for that path.
2. About you: name, DOB, email, phone, address, occupation. ID field varies by path (SSN, ITIN, or
   passport number plus country plus W-8BEN acknowledgment checkbox). Prefilled where the chat knew it.
3. Verify you: simulated document capture (upload or "use sample") and selfie. Returns a trust readout
   (see M4).
4. Your accounts: preselected products from the chat, editable, each with monthly fee and minimum,
   plain-language disclosure summaries with "read full PDF" links (Savings is always included and
   explained as the membership account).
5. Review and submit: summary, then the decision screen (M5).
Fields validated with zod. State in React context plus localStorage so a refresh does not lose it.

Acceptance: a persona can go from prefilled step 1 to the decision screen in under 90 seconds with
no typing except the sample ID button.

### M4. Trust and identity readout (Owner B, copy by Owner A)
One panel after the verify step: four checks with status and a one-line explanation each
(Document authenticity, Face match, Data consistency, Sanctions and watchlist), a confidence score,
and a routing outcome: Instant (green), Video verification with a banker (amber, shows a mock
scheduler with the University Branch), or Branch visit (red, shows address and hours). All mocked,
labeled "Simulated", deterministic per persona so the demo is repeatable.

Acceptance: Maya routes Instant; Joon routes Video verification; Daniela routes Instant for the
personal membership and shows the business document checklist as a follow-up.

### M5. Decision and next steps (Owner B, content Owner A)
Decision screen with three variants: Approved, Needs one more thing (lists the item, offers upload
or branch), Not yet (explains why in plain language and offers the alternative, e.g. secured card or
credit builder loan). Below it a personalized checklist: set up direct deposit (UT Workday link for
students), enroll in digital banking, the Zelle caveat for no-SSN members, nearest campus ATMs,
the credit builder loan card for credit-building goals. Every item links to ufcu.org.

Acceptance: each persona reaches a different decision variant or checklist, and every link resolves.

### M6. Internationalization (Owner C)
`messages/en.json`, `es.json`, `ko.json` for all UI strings, generated once with Claude and hand-checked
by whoever reads the language. Assistant replies follow the selected language via the system prompt.
Language persists across chat and application.

Acceptance: switching to Korean before starting as Joon yields a Korean landing page, Korean assistant
turns, and a Korean application.

## Stretch (only after the 12:00 scope freeze confirms MVP is green)
S1. Portuguese and French dictionaries. S2. Translated disclosure summaries. S3. Accessibility mode
(large type, high contrast, "Call me instead"). S4. Business entity picker with document checklist
as a real step. S5. Debit card design picker (UT Longhorn card) as a delight moment. S6. On-the-fly
translation of the printed checking overview sheet.

## Non-goals (say them out loud in the pitch)
Real KYC, real core banking, real funding, authentication, a database, mobile native, joint accounts,
minors, mortgages, save-and-resume across devices, and anything that cannot be explained in one slide.

## Success criteria for Saturday
- Demo runs end to end for two personas in under four minutes on a laptop with wifi off (offline mode).
- Judges can answer "how do you trust identity" from the trust readout without us explaining it.
- Every card a judge clicks opens a real ufcu.org page.
- Codebase: `pnpm install && pnpm dev` works on a fresh clone; no file over 250 lines; no dead code.
- Deck of at most 8 slides, delivered in 5 minutes with 30 seconds of slack.

## Open questions to settle at the 9:10 AM huddle
1. Product name (2 minutes, Aaron decides if no consensus).
2. Which two personas lead the demo (recommendation: Joon first, then Maya; Daniela in the deck).
3. Whether to cite the banker by name (Aaron asks her by text before the demo; default is "the front
   desk banker at the University Branch").
4. Who owns lane B and lane C (depends on Lisa's and Nicklas's comfort with React and with copy).
