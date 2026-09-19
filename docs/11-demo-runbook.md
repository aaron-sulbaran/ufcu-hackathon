# 11. Demo runbook (exact clicks)

Run on the presenting laptop with `pnpm dev` already up and http://localhost:3000 open in a fresh
window at 125% zoom. Wifi may be on or off; the persona chips serve the scripted turns either way.

## How the modes work
- Persona chips live under "See a sample visit" at the bottom of the landing (collapsed; click it
  once at the start of the demo, or go straight to /desk?persona=joon). They follow their script: instant, identical every time,
  badge "Scripted mode". The quick-reply buttons under each desk turn lead with the script's next
  line, so the whole persona path is taps, no typing.
- Anything typed in the composer goes to Claude live (needs ANTHROPIC_API_KEY in .env.local). If the
  key is missing or the call fails, the same request falls back to a scripted answer with matching
  ufcu.org cards. Set FRONT_DESK_OFFLINE=1 to force scripted for everything.
- Before each run: click "Start over" in the Secure Zone header, or clear site data. A new persona's
  prefill already replaces an old application, but Start over is the clean habit.

## Beat 1: Joon (Korean, no SSN) about 90 seconds
1. Landing: scroll to "See a sample visit", click it, then "Try it" on Joon (or open
   /desk?persona=joon directly). The chip sets Korean.
2. Desk turn 1 arrives in Korean with the eligibility card (passport, I-20, W-8BEN, address) and
   two account cards. Point at "Source on ufcu.org".
3. Tap the first quick reply (the Zelle question). Desk explains Zelle needs an SSN, with source.
4. Tap the first quick reply again ("I'd like to open"). The Continue card appears and the left
   panel "Your visit so far" shows name, path, accounts. Say: "Nothing sensitive was typed here."
5. Click "Continue to secure application". Point at the chrome change and "No AI reads this page."
6. Step 1: foreign-status path preselected, checklist visible. Continue.
7. Step 2: click "Use sample data" (labeled Simulated). Point at "Why we ask" and the W-8BEN
   acknowledgment. Continue.
8. Step 3 runs "Checking your information" on its own. For Joon it cannot match a taxpayer number, so
   the step-up appears: "Today's flow stops here and sends you to a branch. Instead we ask for a
   government ID and a quick selfie online." Say that line. "Use sample" on the panels, Verify. Trust
   readout: document pass, face pass, consistency "review", confidence 82, route: video call with a
   banker. Point at the "placeholder for a third-party identity verification service" note. Pick
   10:30 AM. Continue.
9. Step 4: bundle with Savings locked and "Verified once, applied to Savings and Free Checking".
   Tick the three disclosures (ESIGN, Membership Agreement, W-8BEN). Continue.
10. Step 5: Submit. Decision: "One more thing", booked slot echoed, elapsed time, next steps
    including the Zelle caveat and "Add your SSN later".

## Beat 2: Maya (English, first account, credit) about 60 seconds
1. Header: Start over. Landing: "See a sample visit", then "Try it" on Maya (or /desk?persona=maya).
2. Desk turn 1: three cards (Savings, Simply U, Credit Builder Loan) with reasons. Tap the lead
   quick reply twice. Continue card appears.
3. Secure Zone: SSN path preselected. Continue. "Use sample data". Continue. Step 3 checks her details
   and clears her in two seconds: no upload, document and face marked "Not needed", confidence 96.
   Say: "Verified from what she typed. No document, no branch." Continue. Step 4: "Verified once, applied to Savings, Simply U, and the
   Credit Builder Loan". Tick. Continue. Submit.
4. Decision: approved, "Start to finish 0:3x" next to "The same opening today takes two hosts, a
   branch appointment, and a callback." Next steps: UT Workday direct deposit, digital banking,
   Credit Builder Loan, campus ATMs.

## Beat 3: live question (15 seconds, only if time)
On the landing, type "Can I use Zelle without an SSN?" into the "Or just ask" box, or use one of the
starter pills; the desk opens and answers. One source card shows; the rest sit under "More
information". The answer comes from
Claude with the Zelle source card. If wifi is dead the same question gets the scripted card.

## Beat 4: Daniela (Spanish, business, switching) one slide, not live
The five minutes are Joon (step-up), Maya (no step-up), the trust slide, the architecture slide, and
the close. Daniela's Switch Kit lives on the persona slide; only go live if the first two beats
finish under 3:00.
"See a sample visit" then "Try it" on Daniela: Spanish desk, business document checklist, then the Switch Kit under its own
heading on the decision screen.

## Recovery
- Blank desk after a chip: reload the page; the auto-start waits for the browser to hydrate.
- A stale run shows up: click Start over.
- Live answer rambles: tap a quick reply instead; the scripted path resumes only if the text
  matches, so prefer chips for the persona beats and typing for the live beat.
