# 07. Demo personas (hard-coded, deterministic)

These live in `data/personas.json` and drive the persona chips, the scripted offline turns, the
prefill, the trust readout, and the decision. Facts in the assistant turns must match `data/`
and the research docs; if a fact is not there, do not put it in a turn.

## 1. Maya Torres (chip: "Try as Maya")
- Context: `student`, `build_credit`, `en`. 19, UT Austin sophomore, campus job through Workday,
  never had a bank account, parents bank elsewhere.
- Identity path: `ssn`. Documents: Texas driver license, SSN.
- Scripted turns:
  1. User: "I've never had a bank account and I want to start building credit."
     Assistant: two sentences, then `recommendProducts` -> Simply U (reason: $0 to open, no monthly
     fee, no overdraft fees, built for first accounts) and Credit Builder Loan (reason: deposit held in
     savings, fixed monthly payments reported to the bureaus, deposit returned at payoff). Then
     `showResources` -> "Building credit as a student" page, "Simply U" page.
  2. User: "How much do I need to open it?"
     Assistant: $0 for Simply U; Savings is your membership account and opens with $1. Source cards.
  3. Assistant: `checkEligibility` -> path `ssn`, documents [Texas ID or driver license, SSN], notes
     ["You qualify through UT Austin"]. Then `startApplication` with products [savings, simply-u],
     schoolAffiliation "University of Texas at Austin".
- Trust readout: all pass, confidence 96, route `instant`.
- Decision: `approved`. Next steps: direct deposit via UT Workday, enroll in digital banking, Credit
  Builder Loan card, campus ATMs.

## 2. Joon Park (chip: "Try as Joon", default language ko)
- Context: `international_student`, `checking`, `ko`. 23, Korean, first-year MS at UT on F-1, arrived
  three weeks ago, no SSN yet, has passport, I-20, and a West Campus lease.
- Identity path: `foreign_status`. Documents: passport, I-20 or DS-2019, W-8BEN acknowledgment,
  proof of Austin address. Notes: "No SSN needed to open." "Zelle requires an SSN; use wire or the
  international transfer options." "You can add an SSN or ITIN later."
- Scripted turns (in Korean, with English mirror in the JSON for the team to check):
  1. User: "I just arrived from Korea and I do not have a social security number. Can I open an account?"
     Assistant: yes, plainly. `checkEligibility` -> `foreign_status` with the checklist.
     `recommendProducts` -> Simply U or Free Checking (reason: no fees, no minimum, debit card),
     Savings (membership). `showResources` -> "What you'll need to open an account", "International
     transfers and wires".
  2. User: "Can I use Zelle to pay my roommate?"
     Assistant: not without an SSN; explains, links the Zelle page; suggests the alternatives listed
     in the corpus.
  3. Assistant: `startApplication` with products [savings, free-checking], path `foreign_status`.
- Trust readout: document pass, face pass, consistency `review` ("address is three weeks old"),
  watchlist pass, confidence 82, route `video`. Scheduler mock: University Branch, next slot today.
- Decision: `needs_item` -> "A five-minute video call with a banker to confirm your passport", how:
  [book the slot, or visit 2244 Guadalupe St]. Next steps: campus ATMs, wire instructions, Zelle
  caveat, "add your SSN later" card.

## 3. Daniela Ruiz (chip: "Try as Daniela", language es or en)
- Context: `business`, `checking`, `es`. 34, opening a food-truck LLC in Austin, has an EIN and
  formation documents, personal account elsewhere, parents are Spanish-first.
- Identity path: `ssn` for the personal membership, then the business checklist.
- Scripted turns:
  1. User: "I'm starting a food truck LLC and need a business account."
     Assistant: explains that membership opens with a personal savings account first, then the business
     account attaches. `recommendProducts` -> Savings (membership) and Business Checking (from
     `data/products.json`, source link). `showResources` -> business account documents page.
  2. User: "What documents do I need for the LLC?"
     Assistant: `checkEligibility` (business branch) -> Texas formation documents, EIN letter,
     assumed-name certificate if any, government ID for each signer. Source card.
  3. Assistant: `startApplication` with products [savings, business-checking] and a note that the
     business documents step follows the personal membership.
- Trust readout: all pass, confidence 94, route `instant`.
- Decision: `approved` for membership, next steps: "Upload business documents" card, business
  rates and fees page, digital banking enrollment.

## 4. Robert Hayes (chip: "Try as Robert", stretch)
- Context: `new_to_austin`, `unsure`, `en`. 62, starting at Ascension Seton next month, moving from
  Ohio, wants to talk to a person, reads with glasses.
- Identity path: `ssn`. Accessibility mode on: large type, high contrast, phone number pinned.
- Scripted turns:
  1. User: "I'm moving to Austin for a job at Seton. I don't know what I need."
     Assistant: asks one question (paycheck and bills, or savings too?), then `recommendProducts` ->
     Plus Checking (reason: dividends and fee waived with direct deposit) and Money Market only if he
     mentions a large balance. `showResources` -> "Ascension/Seton membership", branches near him.
  2. User: "Can I just call someone?"
     Assistant: yes, shows the phone card and "call me instead" action, and offers to keep going.
  3. `startApplication` with products [savings, plus-checking].
- Trust readout: all pass, confidence 97, route `instant`. Decision: `approved`.

## Persona JSON shape
```json
{
  "id": "joon", "chipLabel": "Try as Joon", "context": { "audience": "international_student", "goal": "checking", "lang": "ko" },
  "prefill": { "path": "foreign_status", "products": ["savings", "free-checking"], "firstName": "Joon", "schoolAffiliation": "University of Texas at Austin", "notes": ["No SSN yet"] },
  "turns": [ { "user": "...", "assistant": { "text": "...", "tools": [ { "name": "recommendProducts", "result": [ "..." ] } ] } } ],
  "trust": { "checks": [ ... ], "confidence": 82, "route": "video", "simulated": true },
  "decision": { "kind": "needs_item", "item": "...", "how": [ "..." ] },
  "nextSteps": [ { "title": "...", "sourceUrl": "..." } ]
}
```
