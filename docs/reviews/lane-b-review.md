# Lane B review: Secure Zone (/apply)

Date: 2026-09-19. Read-only review against the running dev server on :3000.
Scope: app/apply/**, components/apply/**, lib/apply/**, plus how they consume
lib/apply/prefill.ts, data/personas.json, components/cards/product-card.tsx, messages/*.json.
Reference: docs/03-prd.md (M3, M4, M5, M7), docs/07, 08, 09, 10, AGENTS.md.

How it was tested: clean load with no prefill; a Joon prefill written to
localStorage (foreign_status, ko, personaId joon); a Maya prefill (ssn, personaId maya);
a rule-based switcher with no personaId (switching_banks); empty and garbage submits on
step 2; every gate on step 3 and 4; refresh at step 2 and step 3; language set to ko;
viewport 375 wide; console error log.

Verified end to end (all pass):
- Joon: video route, confidence 82, slot picker, W-8BEN checkbox on step 2 and W-8BEN
  acknowledgment on step 4, decision needs_item, four persona next steps with live links.
- Maya: instant route, confidence 96, approved, Credit Builder Loan step present.
- Switcher with no persona: instant 90, approved, Switch Kit (direct deposit, autopays,
  keep old account one cycle, close it) plus digital banking and ATMs.
- Step 2 empty submit: 9 friendly errors, each on its own field, aria-invalid set.
- Step 2 garbage (2005-03-14, not-an-email, 555, zip 787, ssn 12-34): 6 errors, all correct.
- Step 3 gates: no samples, samples without Verify, Verify without slot on video route.
- Step 4 gates: ESIGN, agreement, W-8BEN each produce their own error.
- Refresh at step 2 and step 3 returns to the same step with values and readout intact.
- 12 "Why we ask" toggles on the SSN path, 14 on the foreign path (every field, both
  ID fields, and the W-8BEN checkbox).
- Savings is locked (no Remove button), "Verified once, applied to every account in this
  bundle." appears on step 4 and twice on step 5.
- Secure chrome: darkest navy header, "Secure application" pill, lock line, off-white
  background, monospace step labels, orange progress bar, elapsed timer ticking.
- 375 wide: no horizontal overflow (scrollWidth 375), single column, controls reachable.
- No console errors, no console.log, no em dashes, no hardcoded hex, no file over 203 lines.

## Ranked findings (most severe first)

### 1. A stale application silently overrides a fresh prefill; nothing ever clears it
lib/apply/state.tsx:88-99, lib/apply/prefill.ts:16 (clearPrefill is never called anywhere)

What breaks: hydration reads frontdesk.application first and returns early; the prefill is
only consulted when there is no stored application. Reproduced: after a Maya-era step 2 was
persisted, writing the Joon prefill and reloading /apply kept step 2, path ssn, prefill null,
products [savings, simply-u]. In the demo this means: run Maya to the decision, go back to
the landing page, click Joon, press Continue to secure application, and the Secure Zone shows
Maya's approved screen. That is the single most likely way the live demo goes wrong. There is
also no Start over anywhere, and after the decision the ProgressHeader keeps showing Step 5
with the timer still ticking.

Fix: stamp the prefill on write (lane A's savePrefill already runs on every ContinueCard
mount) and compare on hydrate. Minimal version inside lane B:
- In loadPrefill's caller (state.tsx hydrate): if a prefill exists and
  stored.prefill?.context?.personaId !== prefill.context.personaId (or the stored
  application already has a decision), discard the stored application and start from
  withPrefill(emptyState(), prefill).
- Call clearPrefill() once the prefill has been folded into the application so the same
  prefill cannot re-apply.
- Add a "Start a new application" button on the decision screen that removes
  frontdesk.application and goes to step 1.

### 2. "Kept on this page only" is not true: SSN, ITIN, and passport number persist in plaintext
lib/apply/state.tsx:104-106 (persist writes the whole state), components/apply/review-summary.tsx:68
(apply.review.masked)

What breaks: every keystroke in the SSN, ITIN, or passport field is written to
localStorage["frontdesk.application"] in clear text and stays there after submit, after the
decision, and across sessions. The review screen masks the value and says it is kept on this
page only. A judge who opens DevTools during the compliance question sees the SSN. This is
the E category (10 points) and the trust story of the whole product.

Fix: strip the three ID fields before persisting (persist({...next, about: {...next.about,
ssn: "", itin: "", passportNumber: ""}}) and keep them in React state only), or at minimum
delete them from storage in submit() before update({decision}). Keep the mask. If the fields
must survive a refresh for the demo, say so on the review screen instead of the current copy.

### 3. Korean application is 95 percent English (M6 acceptance fails for Joon)
messages/ko.json (9 apply.* keys), messages/es.json (9), lib/apply/strings.ts (168 keys),
lib/apply/decision.ts:11-24 (plain English, not keys), data/personas.json (decision and
nextSteps are plain English)

What breaks: with lang ko, the only Korean on /apply is the header pill, the lock line,
"Step n of 5", the elapsed suffix, "Why we ask", Back, Continue, Submit, and the Simulated
badge. Untranslated groups, all of which fall back to English through APPLY_STRINGS:
- apply.step1..5.title, apply.cip, apply.step3.sub
- apply.path.* (5 options and 5 sublines), apply.checklist.title, apply.notes.title
- PATH_RULES documents and notes (lib/apply/rules.ts:29-93, plain English arrays)
- apply.f.* (16 field labels), apply.show, apply.hide, apply.optional, apply.prefilled
- apply.why.* (12 reasons)
- apply.verify.*, apply.trust.*, apply.detail.*, apply.route.*, apply.branch.hours
- apply.accounts.*, apply.disclosures.title, apply.disclosure.* (6)
- apply.review.*, apply.submitting, apply.decision.*, apply.next.* (19)
- apply.err.* (23 validation messages)
- Decision item and how strings (decision.ts and personas.json), persona nextSteps
- Product card labels "Opens with" and "Monthly fee" (lane A, product-card.tsx:21,25)

Fix: the keys are already in en.json (168), so this is a dictionary job, not a code job:
generate ko and es blocks for the apply.* keys and add them to ko.json and es.json.
For the pieces that are not keys (PATH_RULES documents and notes, decision.ts how lines),
either convert them to keys (apply.rule.ssn.doc1 and so on) or accept English there and
say so in the pitch. Also read prefill.context.lang on hydrate and call setLang so Joon's
handoff lands in Korean without touching the header switch (lane C owns lib/context.tsx,
so propose it in chat).

### 4. Two branch schedules contradict each other on Joon's decision screen
lib/apply/rules.ts:6-11 and lib/apply/strings.ts:109 ("Weekdays 10am to 4pm") versus
data/personas.json joon.decision.how[1] ("Monday to Friday, 9 AM to 5 PM")

What breaks: step 3 shows "Weekdays 10am to 4pm"; the decision two screens later says
"9 AM to 5 PM". Same branch, same demo, two answers. A judge reading the compliance and
trust screens will notice.

Fix: pick one (the branch packet transcription is the source) and change the other. Since
lane A owns personas.json, post the diff; or have Decision render BRANCH.hoursKey instead
of the persona's second how line.

### 5. The booked video slot is ignored by the decision screen
components/apply/steps/step-review.tsx:28, lib/apply/decision.ts:8-17, data/personas.json joon.decision

What breaks: Joon picks 1:15 PM on step 3 ("Booked for 1:15 PM today"), the review screen
repeats it, then the decision says "Book a slot at the University Branch; the next opening
is today" as if nothing was booked. The needs_item variant is the one the demo leads with.

Fix: in submit(), if state.trust?.route === "video" and state.verify.slot, override
decision.how[0] with t("apply.route.video.picked", { time: slot }) (or build the decision
from the rule with the slot passed in). Two lines.

### 6. Disclosures link to one generic page; messages/disclosures.json is not used
components/apply/disclosures.tsx:32-40, lib/apply/rules.ts:13, messages/disclosures.json
(298 lines, modified in the working tree, zero readers in app/ components/ lib/)

What breaks: all three "Read the full document" links open
https://ufcu.org/policies-legal/disclosures. The PRD (M3 step 4) asks for plain-language
summaries with a "read full PDF" link per document, and the rubric map (E) counts on
"consent checkboxes with plain summaries and full PDFs". Someone wrote richer summaries
and bullets into messages/disclosures.json (esign, membership_agreement, w8ben,
courtesy_pay) and the Secure Zone does not read it.

Fix: either import disclosures.json in disclosures.tsx (title, summary, bullets, fullUrl
per item, by lang with en fallback) or delete the file so the repo does not ship an unused
298-line document. If kept, use its fullUrl per item.

### 7. Persona script overrides the path the person actually picked
lib/apply/decision.ts:37-38, lib/apply/mock-verify.ts:35-36, lib/apply/next-steps.ts:50-51

What breaks: personaId comes from the prefill and wins over everything. If Joon changes
step 1 to "I have an ITIN" (the step is editable by design), step 3 still says the passport
MRZ checked out and the decision still asks for a video call to confirm the passport; Maya
switching to foreign_status still gets instant approval with a Texas driver license
readout. Rule-based logic exists and is correct; it just never runs for a persona.

Fix: only honour the persona when input.path === persona.prefill.path; otherwise fall
through to ruleBased. One condition in each of the three files.

### 8. Rule-based Switch Kit: three items have no link and one links to the wrong page
lib/apply/next-steps.ts:7-8, 27-29

What breaks: M5 says "Every item links to ufcu.org". The autopay, keep-open, and close
steps have no sourceUrl, and "Move your paycheck here" opens the open-account page (the
TODO on line 7 admits it). The campus ATM step is also appended for every audience,
including a 62-year-old switcher (Robert's rule path).

Fix: point URL_DEPOSIT at https://ufcu.org/resources/tools/forms (the direct deposit form
lives on the forms page; personas.json already uses it for Maya and Robert), give the three
Switch Kit steps the checking overview or forms URL, and gate the campus ATM step on
audience student or international_student (use the general fee-free ATM page otherwise).

### 9. APPLY_STRINGS is now a 180-line duplicate of en.json
lib/apply/strings.ts:7-186, messages/en.json:31-198

What breaks: the captain has merged all 168 apply.* keys into en.json (checked: zero
missing either way), so the fallback table is dead code by AGENTS.md rule 5. It also means
every apply string has two sources of truth for the rest of the day.

Fix: reduce strings.ts to useApplyT (which can become a re-export of useT) and delete
APPLY_STRINGS. Keep the file so imports do not churn. Also dead: apply.accounts.min and
apply.accounts.fee (no readers), clearPrefill (no callers, see finding 1 for a use),
and the async wrapper around a static JSON import in lib/apply/personas.ts.

### 10. State field silently rewrites "Texas" to "TE" and passes validation
components/apply/steps/step-about.tsx:66, lib/apply/schemas.ts:21

What breaks: onChange upper-cases and slices to two characters, so typing "Texas" stores
"TE", which matches /^[A-Za-z]{2}$/ and is accepted. The review screen then shows
"Austin, TE 78705". Same family: dob accepts 99/99/9999, and the street error copy promises
"A P.O. box cannot be used" while nothing checks for one.

Fix: make State a select over the 50 codes (or at least validate against a list), add a
date parse check to dob (month 1-12, day 1-31, year 1900 to today), and add
/\bP\.?O\.?\s*box\b/i as a refine on street so the copy is true.

### 11. Elapsed time on the decision screen is lost on refresh; the header timer never stops
components/apply/steps/step-review.tsx:19, 30-31; components/apply/progress-header.tsx:36

What breaks: elapsed is component state, so a refresh on the decision screen keeps the
decision (persisted) but drops "Start to finish". Meanwhile the header timer keeps counting
above the decision card. The rubric point is the number; it should be stable.

Fix: persist finishedAt alongside decision in update(), derive the readout from
finishedAt - startedAt, and pass running={!state.decision} to useElapsed.

### 12. Masking and money labels on the review screen are ambiguous
components/apply/review-summary.tsx:9-14, 86

What breaks: the passport number "M12345678" renders as "*** ** 5678" (SSN shape), and
each account renders as "Savings (Membership Account) - $0" where $0 is the monthly fee
with no label, one line under a card that said "Opens with $1".

Fix: mask non-SSN values as last three characters with a generic prefix, and render
"{name}: {minToOpen} to open, {monthlyFee} monthly" using the unused apply.accounts.min
and apply.accounts.fee keys.

### 13. "Drag a photo here" does nothing
components/apply/verify-panel.tsx:28-46

What breaks: the panel copy invites a drag and drop; there is no onDrop or onDragOver, so
a dropped file opens in the browser tab and navigates away from the application (state
survives, but the demo loses its place). The MOCK is labelled, which is good.

Fix: either add onDragOver={e => e.preventDefault()} and onDrop={e => {
e.preventDefault(); onSample(); }} so a drop behaves like Use sample, or change the copy
to "Take a photo or use the sample".

### 14. Inline errors are not programmatically tied to their inputs
components/apply/field.tsx:74, 88; components/apply/steps/id-fields.tsx:77, 83

What breaks: aria-invalid is set but the error <p> has no id and the input has no
aria-describedby, so a screen reader hears "invalid" without the friendly copy the UX
rubric is paying for. The Why we ask button also lacks aria-controls.

Fix: give the error paragraph id={`${name}-error`}, set aria-describedby on the Input when
error is present, and add aria-controls plus an id on the disclosure span.

### 15. Persisted state is trusted without validation
lib/apply/state.tsx:91-93, lib/apply/prefill.ts:12

What breaks: JSON.parse output from localStorage is cast straight to ApplicationState and
ApplicationPrefill. A prefill with a bad path or a products array that is not strings will
render undefined labels or crash productById. This is the one place the codebase's own
rule (zod for external input) is skipped, and localStorage is the only external input the
Secure Zone has.

Fix: a small zod schema for ApplicationPrefill (path enum, products array of string,
optional strings) in prefill.ts; on failure return { error } and start empty. Same for
the stored application step and path.

## What is good

- The flow does what the PRD promises, and it does it without typing: prefilled step 1,
  three sample buttons, one Verify click, three checkboxes, Submit. A scripted run reaches
  the decision in 7 seconds; a human run measured 1:32, under the 90-second acceptance.
- The three decision variants and three routes are all reachable and deterministic, and
  every simulated surface (readout, decision, verify button) carries the Simulated badge
  and a // MOCK comment. A judge cannot mistake it for a real KYC call.
- Validation is genuinely friendly. Every message says what to type and gives an example
  ("Use MM/DD/YYYY, like 03/14/2005", "Enter your occupation, or write Student"). Errors
  land on the right field and aria-invalid is set. Nothing gets through empty.
- "Why we ask" is on every field, not only the sensitive ones, with one plain regulatory
  sentence each. The CIP line on steps 1 and 2 is the Patriot Act notice in one sentence
  the rubric map asked for.
- Bundle logic is right: Savings locked with the membership explanation, prefill products
  merged with the membership product, Remove only on optional products, and the
  "verified once" sentence appears on step 4 and step 5.
- The secure chrome is a real signal, not a tint: darkest navy header, lock line, off-white
  page, monospace step labels, orange progress, all from tokens. No hex anywhere in the lane.
- State design is simple and survives refresh at every step. One context, one key,
  { data, error } at every boundary, no throws, no server calls, all files under 205 lines.
- Lane boundaries respected: lane A's ProductCard is wrapped, not copied; personas.json is
  read through a tolerant loader; strings were staged locally then merged into en.json.
