# Front Desk: speaker notes

Five minutes on the clock, two minutes of Q&A. Judges are UFCU's technology and everyday-banking
leadership; they know the current flow, so do not explain it, just beat it. One paragraph per slide,
condensed from docs/06-demo-and-pitch.md. Owner B and Owner C are Lisa and Nicklas (lane assignment
settled at the 9:10 AM huddle); Aaron is Owner A. Rotate Q&A answers by topic: product (Owner C),
identity and trust (Owner B), technical (Aaron).

## Slide 1: Title (Owner C, 0:00)
Open on the team and the name. "We are LAN Party: Lisa, Aaron, and Nick. This is Front Desk, the UFCU
front desk, online." Keep it to five seconds, then move straight into the gate.

## Slide 2: The gate (Owner C, 0:00 to 0:45)
Show Capital One, Chase, Wells Fargo, and UFCU's own first screen side by side, SSN field circled on
each. Say: "Every other first screen asks who you are. Ours asks what you need." Then read UFCU's own
sidebar line: "your social security number/ITIN ... otherwise schedule an appointment at your local
branch." Tell the banker story: "Yesterday we sat with the front-desk banker at the University Branch
on Guadalupe. She opens accounts for international students without an SSN every week, translates for
members in five languages, and explains checking versus savings by hand. The website turns all of
those people away on screen one. We built the front desk, online. We call it Front Desk."

## Slide 3: Who we built for (Owner C into Aaron, transition)
Name the four people fast: Maya, first account, building credit from zero. Joon, F-1 student, three
weeks in Austin, no SSN yet, speaks Korean. Daniela, opening a food-truck LLC, moving off Wells Fargo.
Robert, a Chase customer relocating for a job, wants a phone number. "Watch two of them go through it
live." Hand off to Aaron for the demo.

## Slide 4: Live demo (Aaron drives, Owner B narrates, 0:45 to 3:45)
Switch the header to Korean for Joon: "I am an international student and I want a checking account."
The assistant answers in Korean with Simply U and the no-SSN resource card, then says no to Zelle
because it requires an SSN and links the page. Continue to the Secure Zone, dark header, lock icon,
"no AI reads this page." Foreign status path, checklist, sample ID and selfie, trust readout at
confidence 82, routed to a video call with a banker, mock scheduler shows the University Branch. Then
switch to English for Maya: "I want to build credit and I have never had a bank account." Simply U
plus the Credit Builder Loan with reasons, SSN path, instant route, approved, next steps including
direct deposit from UT Workday. On Maya's review screen point at the step counter and the line
"verified once, applied to savings, checking, and the credit builder loan," then the elapsed time.
That is the before and after in one frame. If time allows, ten seconds on Daniela: she banks at Wells
Fargo, gets a document checklist by entity type, and her approval ends with a Switch Kit. "Switching
costs a conversation, not a form."

## Slide 5: Trust is layered (Owner B, 3:45 to 4:15)
"Trust is layered, not gated." Walk the three paths (SSN, ITIN, foreign status), the four checks
(document, face, consistency, watchlist), the confidence score, and the three routes (instant, video
banker, branch). Read the CIP line: the rule requires name, date of birth, address, and an ID number
before an account opens, and that governs what is collected, not the order a website asks for it. Close
with: "Every check is simulated today and labeled that way; in production each maps to a KYC vendor and
the core."

## Slide 6: Architecture on one slide (Aaron, 4:15 to 4:35)
"Every recommendation carries the URL it came from. The assistant cannot cite a page that is not in the
corpus, and it never sees an SSN." Walk the diagram top to bottom: the browser's three routes, one route
handler, Claude with four tools next to the static corpus of about 18 ufcu.org pages, no database. End
on the swap points row: KYC vendor, core banking, CRM, each a known integration point, not a gap.

## Slide 7: What we did not build and why (Aaron, folds in the 4:35 future beat)
Say the non-goals out loud before a judge has to ask: no real KYC vendor, no real core banking or
funding, no production authentication, no database, no mobile app, no joint or minor accounts, no
mortgages, no save-and-resume across devices. "None of that is hidden, all of it is a swap point." Then
the future line: a real KYC vendor behind the same readout, save-and-resume by SMS, translated
disclosures, joint and teen accounts, and the same assistant inside the mobile app after onboarding.

## Slide 8: Close (Owner C, 4:45 to 5:00)
"Simple, in your language, honest about what it needs from you, and it ends with what to do next.
Switching costs a conversation, not a form. That is the front desk. Thank you."

## Judge Q&A prep
- How do you know the assistant is accurate? It can only cite pages in the corpus we curated from
  ufcu.org, every card carries its URL, and it is instructed to defer to a phone number when the
  corpus is silent. Show a card link opening the real page.
- Why should we trust an LLM with onboarding? It never touches sensitive data; the application is a
  separate zone with no model calls. The model does recommendation and explanation, which is what the
  banker does verbally today.
- What about fraud and synthetic identity? The trust readout is the surface for whatever KYC stack
  UFCU runs; confidence thresholds decide instant versus human. Foreign-status applicants route to a
  human by default, which is the policy today, just faster.
- Compliance: CIP, Patriot Act, W-8BEN? Paths map to the documents the branch already accepts. The
  W-8BEN is in the branch packet. We show the acknowledgment where the branch would hand over paper.
- Accessibility for older members? Big type mode, plain language, phone number always visible, "call
  me instead" button, language switch. Show it if built, otherwise say it is next.
- Cost to run? One Haiku-class call per turn, cached system prompt, static corpus. Cents per applicant.
- What would you do with two more weeks? Real KYC vendor, save-and-resume, joint and teen paths,
  translated disclosures, analytics on drop-off per step.
- How is this easier than switching to Chase or Wells? Their first screen asks for an SSN before
  anything else, show the slide. Ours asks what you need, recommends, prefills, and ends with a Switch
  Kit that moves direct deposit and autopays. The person types their identity number once, late, with
  the reason next to the field.
- Isn't asking for the SSN up front a regulatory requirement? The CIP rule requires name, date of
  birth, address, and an ID number before an account is opened, and for non-U.S. persons that number
  can be a passport. It says what to collect before opening, not when a website asks. We collect all
  of it in the Secure Zone with the reason beside each field, after the person has decided. The branch
  already opens accounts with passport plus W-8BEN; we put that path online.
- Why not just fix the existing Narmi flow? We did not replace it; we put a front desk in front of it
  and prefilled it. The Secure Zone could be Narmi tomorrow.

## Backup plan
Wifi dies: FRONT_DESK_OFFLINE=1, identical screens. Laptop dies: backup screen recording on a second
laptop and a phone. Timer dies: the opener and close are fixed; the demo drops Maya to the deck if past
3:15.
