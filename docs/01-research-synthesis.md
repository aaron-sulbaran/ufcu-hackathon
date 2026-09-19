# 01. Research synthesis

Four inputs: (a) a 2026-09-18 interview with the front-desk banker at UFCU's University Branch on
Guadalupe St (Granola note "UFCU Hackathon - User Interview"), (b) the current online application
video UFCU provided, (c) a read-only walkthrough of the live join flow on ufcu.org and open.ufcu.org
(docs/research/current-onboarding-flow.md), (d) a crawl of ufcu.org products, eligibility, and
resources (docs/research/ufcu-products-and-eligibility.md, ufcu-resources-catalog.md,
grounding-corpus-seed.md), plus the printed branch packet (docs/research/branch-packet-transcription.md).

## The one-sentence insight
The branch says yes to people the website says no to. The online flow's first screen requires an SSN
or ITIN and a state ID and tells everyone else to "schedule an appointment at your local branch."
The banker at that branch opens accounts for international students without an SSN every week
(passport plus a W-8BEN Certificate of Foreign Status, which is literally in the packet she handed us),
translates for Spanish, Portuguese, French, Korean, and Russian speakers using Google Translate,
and explains the difference between checking, savings, and money market by hand. None of that
exists online.

## What the banker told us (2026-09-18)
- UFCU is a non-profit credit union; interest is capped at 17.9% by law. Members should hear this.
- Checking and savings dominate; three checking tiers; no fees, no minimum balances.
- Credit-building products are the ones they push: Credit Builder Loan (deposit about $500 locked
  in savings, pay $20 to $30 a month for six months, get the deposit back plus a score boost) and
  a secured credit card. This is the flagship for students starting from zero.
- No student loans (federal restriction). Do not let the assistant claim otherwise.
- International students are welcome and do not need an SSN. Requirement is a government ID and an
  SSN if they have one. J-1 holders are a common case.
- Zelle requires an SSN, so business, org, and international-student accounts do not get it, and
  nothing in the app or on Zelle's site says so. Staff hear about this constantly.
- Recent policy change requires an address; this hurt unhoused members. (Sensitive; we note it, we
  do not build around it.)
- Language: Spanish site exists via a corner toggle. Portuguese, French, Korean, Mandarin, and Russian
  speakers are common. Printed PDFs have no translations. On-the-fly translation of the account
  PDFs was called "amazing, it would help everybody involved."
- People do not know checking from savings from money market. Europeans especially expect one account.
- Wish list, in her words: clearer recommendations online, natural language ("I want a credit card")
  that pulls personalized suggestions, and a decision screen that explains why someone was denied
  and what to do instead (secured card) rather than a dry rejection.
- She offered her name for citation and to connect us to her manager. Ask Aaron before using either.

## What the current flow does (video plus live walkthrough)
1. ufcu.org "Open an Account": "usually takes 3 to 5 minutes." Radio: "I am an employee, student or
   alumni of [dropdown of ~17 schools and employers]" or "join through the American Consumer Council
   for free" (a modal explains ACC). Sidebar "What You'll Need": 18+, driver license or state ID,
   SSN/ITIN. Otherwise schedule a branch appointment or call.
2. Handoff to open.ufcu.org (vendor: Narmi). Re-asks new vs current member. Save-and-resume only via a
   prior link. Language dropdown exists here (English default).
3. Step 1 of 5 "Your info": joint account toggle, then full PII: name, SSN, DOB, occupation, email,
   phone, address with autocomplete, Patriot Act notice, SSN perjury checkbox, CAPTCHA.
4. Step 2 "Choose your accounts": tabs Recommended / Checking / Savings / Money Market / Certificates.
   Cards show minimum to open, benefits, monthly fee, "Explore more". Savings is preselected.
5. Step 3 "Fund your accounts": yes/no, link a bank (MX), account number, or card; amounts; pick a
   debit card design (UT Longhorn, Texas State, Classic); courtesy pay opt-in; refer-a-friend code.
6. Step 4 "Disclosures": ESIGN consent and the Membership and Account Agreement as embedded PDFs.
7. Step 5 "Review": summary, "Submit application", spinner, "You've been approved!" with account
   numbers and an "Enroll Now" button for digital banking.

## Friction we can attack (ranked by how visible it is in a demo)
1. The SSN/ITIN gate on screen one excludes international students, the exact group the branch
   serves. No online path for passport plus W-8BEN.
2. PII before product. You give an SSN before you know what account you want or why.
3. Product choice is a tab strip of jargon with no guidance. "Recommended" is not personalized.
4. Disclosures are two PDF walls. No plain-language summary, no translation.
5. English only until the vendor step, and then only a dropdown. No Korean, Portuguese, French.
6. The approval screen is a dead end: account numbers and "Enroll Now". No "here is what to do next
   for you" (direct deposit from your campus job, credit builder loan, the Zelle caveat).
7. Eligibility is confusing (field of membership, SEG, ACC) and the free ACC path is hidden.
8. Two hosts, two "who are you" gates, no visible continuity, no chat, no in-flow help.

## What UFCU actually offers (from the site crawl; full detail with URLs in docs/research/)
- Checking: Teen (13 to 17, guardian joint owner), Simply U ($0 open, $0 fee, no overdraft fees;
  the right first account), Free Checking ($400 courtesy pay), Plus ($10/mo waived at $10k balance
  or $4k deposits, up to 2.25% APY).
- Savings $1 minimum (the membership account). Money Market $2,500. Certificates $1,000.
- Membership: affiliation with UT Austin, ACC, St. Edward's, Texas State, Ascension/Seton, Indeed,
  and others, or the free ACC route. Effectively anyone can join.
- Account opening: SSN or ITIN plus government ID, 18+. Nothing on the site covers passport,
  I-20, visa, or W-8BEN. That gap is our demo.
- Business accounts: documents by entity type (sole prop: SSN/EIN plus DBA; LLC/corp: formation
  docs plus EIN). Good for the business persona.
- Two branches by campus: 2244 Guadalupe St and 4611 Guadalupe St.
- Fees worth knowing: $35 courtesy pay, $20 domestic wire, 1% international transaction, $1
  non-network ATM.
- No mortgage page at guessable URLs and no UFCU student loan. The assistant must not invent either.

## Implications for the build
- Lead the demo with the international student. It is the sharpest before/after and it is true.
- The assistant is a front-desk banker, not a search box: it asks who you are and what you need,
  recommends with reasons, links every claim to ufcu.org, and hands you into a prefilled application.
- The application is a separate, visibly different "secure zone". Sensitive fields live there only.
- Identity paths, not one gate: SSN, ITIN, or foreign status (passport plus W-8BEN plus enrollment
  document), with a mocked verification layer and a confidence readout the judges can see.
- Decision screens explain. Approved, needs-one-more-thing, or not-yet, each with reasons and options.
- Languages: EN, ES, KO at minimum for the demo; PT, FR as dictionary files if time allows.
