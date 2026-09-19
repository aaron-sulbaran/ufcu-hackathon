# 06. Demo and pitch

Five minutes on the clock, two minutes of Q&A. Judges are UFCU's technology and everyday-banking
leadership. They know the current flow; they do not need it explained, they need to see it beaten.

## Speaking order
- Opener and problem (0:00 to 0:45): Owner C
- Live demo (0:45 to 3:45): Aaron drives, Owner B narrates the Secure Zone and trust readout
- Architecture, trust, future (3:45 to 4:45): Owner B on trust, Aaron on architecture and future
- Close (4:45 to 5:00): Owner C
Everyone speaks. Rotate who answers Q&A by topic: product (C), identity and trust (B), technical (A).

## Script
**0:00 Opener.** One slide: Capital One, a second bank, Wells Fargo, and UFCU's own first screens side
by side, the SSN field circled on each (docs/research/competitors/). "Every other first screen asks
who you are. Ours asks what you need." Then the UFCU sidebar text: "your social security
number/ITIN ... otherwise schedule an appointment at your local branch." Say: "Yesterday we
sat with the front-desk banker at the University Branch on Guadalupe. She opens accounts for
international students without an SSN every week, translates for members in five languages, and
explains checking versus savings by hand. The website turns all of those people away on screen one.
We built the front desk, online. We call it Front Desk."

**0:45 Demo, Joon.** Switch the header to Korean. Landing: "I am an international student and I want
a checking account." Start. The assistant answers in Korean with two cards: Simply U checking with a
reason, and the resource card "Opening an account without an SSN" linking to ufcu.org. Ask in Korean
"Can I use Zelle?" and the assistant says no, because Zelle requires an SSN, and links the page.
Click "Continue to secure application". Point out the chrome change: dark header, lock, "no AI reads
this page." Step 1 shows the Foreign status path with the checklist: passport, I-20, W-8BEN, campus
address. Sample ID, sample selfie. Trust readout: document pass, face pass, consistency pass,
watchlist pass, confidence 82, route: video verification with a banker, mock scheduler shows the
University Branch. Decision: "Almost there: verify by video at 3:15 today" with the next-steps list
including the Zelle caveat and campus ATMs.

**2:15 Demo, Maya.** English. Chip "Try as Maya". "I want to build credit and I have never had a bank
account." Cards: Simply U plus Credit Builder Loan with the reason ("$500 deposit held in savings,
six monthly payments, deposit returned, reported to bureaus") and the source link. Continue. SSN path,
prefilled name and school, sample ID, instant route, Approved, next steps: direct deposit from UT
Workday, enroll in digital banking, credit builder loan card. 

**3:00 Bundle and speed beat.** On Maya's review screen point at the step counter and the line "verified once, applied to savings, checking, and the credit builder loan", then the elapsed time. That is the before-and-after in one frame.

**3:15 Daniela, the switch.** Ten seconds live or one slide: she banks at Wells Fargo, she is opening a
food-truck LLC, she gets a document checklist by entity type before she fills a form, and her
approval ends with the Switch Kit: move direct deposit, re-point autopays, keep the old account one
cycle, close it. "Switching costs a conversation, not a form."

**3:45 Trust slide (Owner B).** Paths, four checks, confidence, three routes. "Trust is layered, not
gated. Every check is simulated today and labeled that way; in production each maps to a KYC vendor
and the core."

**4:15 Architecture slide (Aaron).** One diagram: Next.js, one route handler, Claude with four tools,
a static corpus of 18 ufcu.org pages, no database. "Every recommendation carries the URL it came
from. The assistant cannot cite a page that is not in the corpus, and it never sees an SSN."

**4:35 Future (Aaron).** Real KYC vendor behind the same readout, save-and-resume by SMS, the
banker's translation of printed disclosures, joint and teen accounts, and the same assistant inside
the mobile app after onboarding.

**4:45 Close (Owner C).** "Simple, in your language, honest about what it needs from you, and it ends
with what to do next. Switching costs a conversation, not a form. That is the front desk. Thank you."

## Deck outline (8 slides max, docs/deck/)
1. Title: Front Desk, LAN Party.
2. The gate: four first screens (Capital One, second bank, Wells Fargo, UFCU) with SSN fields circled,
   banker quote. "Every other first screen asks who you are. Ours asks what you need."
3. Who we built for: the four personas in one row.
4. Live demo (placeholder slide, switch to browser).
5. Trust is layered: paths, checks, confidence, routes.
6. Architecture on one slide.
7. What we did not build and why (honest non-goals win trust with a CTO audience).
8. Future and thanks. Optional: Figma flow thumbnail.

## Judge Q&A prep
- "How do you know the assistant is accurate?" It can only cite pages in the corpus we curated from
  ufcu.org, every card carries its URL, and it is instructed to defer to a phone number when the
  corpus is silent. Show a card link opening the real page.
- "Why should we trust an LLM with onboarding?" It never touches sensitive data; the application is a
  separate zone with no model calls. The model does recommendation and explanation, which is what
  the banker does verbally today.
- "What about fraud and synthetic identity?" The trust readout is the surface for whatever KYC stack
  UFCU runs; confidence thresholds decide instant versus human. Foreign-status applicants route to a
  human by default, which is the policy today, just faster.
- "Compliance: CIP, Patriot Act, W-8BEN?" Paths map to the documents the branch already accepts. The
  W-8BEN is in the branch packet. We show the acknowledgment where the branch would hand over paper.
- "Accessibility for older members?" Big type mode, plain language, phone number always visible,
  "call me instead" button, language switch. (Show if built, otherwise say it is next.)
- "Cost to run?" One Haiku-class call per turn, cached system prompt, static corpus. Cents per applicant.
- "What would you do with two more weeks?" Real KYC vendor, save-and-resume, joint and teen paths,
  translated disclosures, analytics on drop-off per step.
- "How is this easier than switching to Chase or Wells?" Their first screen asks for an SSN before
  anything else (show the slide). Ours asks what you need, recommends, prefills, and ends with a Switch
  Kit that moves direct deposit and autopays. The person types their identity number once, late, with
  the reason next to the field.
- "Isn't asking for the SSN up front a regulatory requirement?" The CIP rule requires name, date of
  birth, address, and an ID number before an account is opened, and for non-U.S. persons that number
  can be a passport. It says what to collect before opening, not when a website asks. We collect all
  of it in the Secure Zone with the reason beside each field, after the person has decided. The
  branch already opens accounts with passport plus W-8BEN; we put that path online.
- "Why not just fix the existing Narmi flow?" We did not replace it; we put a front desk in front of
  it and prefilled it. The Secure Zone could be Narmi tomorrow.

## Backup plan
- Wifi dies: `FRONT_DESK_OFFLINE=1`, identical screens.
- Laptop dies: backup screen recording on a second laptop and a phone.
- Timer dies: the opener and close are fixed; the demo drops Maya to the deck if past 3:15.
