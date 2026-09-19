# UFCU Current Online Membership / Account Opening Flow

Fetch date: 2026-09-19
Method used: Live browser automation (built-in Claude Browser tool), navigating https://ufcu.org and the linked application host https://open.ufcu.org. All steps below were read-only: no account was created, no form was submitted, and no real personal data (name, SSN/ITIN, DOB, address, phone, email) was ever entered. Where the flow required that data to advance, the flow was stopped and the screen was documented from the empty-state fields instead.

## Method used

- Browser: Claude's built-in Browser pane (Chromium-based), desktop viewport (1024x768) and a mobile viewport (375x812) for one responsiveness check.
- No login, no account creation, no submission of any step.
- On the one screen that required real personal identifiers to proceed (Step 1 of 5 on open.ufcu.org), the "fill manually" link was used only to reveal the field set; no values were typed into any field. This is documented below as "Screens not reachable without real data."

## Entry points

- Top global nav is collapsed behind a hamburger icon on ufcu.org (both desktop and mobile use the same collapsed menu; there is no persistent "Join" button in the visible header bar). Opening the hamburger menu shows, at the very top, above "Log In":
  - "Become A Member" (with a person-plus icon) - href resolves to the join landing page.
  - "Log In" (lock icon)
  - Language toggle "Espanol"
  - Below that, the mega-menu for Personal / Checking / Savings / etc.
- The homepage hero and body do NOT contain a "Join" or "Become a Member" call to action in the main content; the only visible top-of-page CTA is "Apply Now" for an auto loan and "Log In" / "Enroll Now" for existing online banking. A prospective member has to know to open the hamburger menu to find "Become A Member."
- Two other UFCU URLs resolve to the same join landing page:
  - /personal/checking/open-an-account
  - /personal/savings/open-an-account
  (Both silently redirect to the same "Open an Account" page rather than a checking- or savings-specific start, i.e. the product choice implied by the URL is not actually honored yet.)
- CTA text used across entry points: "Become A Member" (nav) and "Open an Account" / "Open a Free Checking Account" (homepage tile). There is no CTA literally labeled "Join."

## Screen 1: Eligibility / "Tell Us About Yourself" (on ufcu.org)

- URL: https://ufcu.org (client-side route change; page title becomes "Open a UFCU Account | UFCU"; the address bar does not show a distinct path in this environment)
- Page title: "Open a UFCU Account | UFCU"
- Headline: "Open an Account" (page banner) / "Let's get started!" (section header)
- Estimated time stated: "Completing an application usually takes just 3-5 minutes." (shown with a clock icon, before any fields)
- Eligibility asked first: Yes. This is the very first screen in the flow, before any product selection or personal info.
- Form fields:
  - Radio: "I am an employee, student or alumni of" (unlabeled as to why this matters; no explanation of "SEG" or field-of-membership concept)
    - Paired dropdown, label "Select", required if this radio is chosen. Options (verbatim): Ascension/Seton; Austin Community College (ACC); Concordia University (CTX); Foundation Communities; Galveston College; Goodwill; Huston-Tillotson University (HT); Indeed; St. Edward's University (SEU); Southwestern University (SU); Temple College (TC); Texas State University (TXST); TX A&M at Galveston (TAMUG); TX A&M HSC; University of Texas at Austin (UT Austin); University of Texas Medical Branch (UTMB); UTHealth-Houston; YMCA.
  - Radio: "I'd like to join UFCU through the American Consumer Council for free." with an inline link "American Consumer Council" that opens a modal dialog (see disclosures below).
  - Button/link: "Continue"
- Helper/sidebar content on this same screen ("What You'll Need" box):
  - "You'll need to be 18 years of age or older, and you'll want to have the following handy: a valid driver license or state ID; your social security number/ITIN."
  - "If you do not meet these requirements or lack these documents, please schedule an appointment (opens in a new window) at your local branch or call us at (512) 467-8080 or (800) 252-8311." -- link goes to https://appointments.ufcu.org/service
  - "Refer-a-Friend" callout: "If someone shared their Refer-a-Friend code with you, keep it handy. You'll enter it on the Fund your accounts page." with a link to "Refer-a-Friend Rules" (opens in a new window).
  - "Cards Designed for U" preview: shows three debit card designs (University of Texas, Texas State University, UFCU Classic) as a preview of card choice later in the flow. This is the only hint of product/personalization choice on this screen; it is marketing content, not an actual form control yet.
- Disclosures/legal text: none beyond the eligibility/ID requirements above at this step.
- Modal: clicking "American Consumer Council" opens a dialog titled "Joining the American Consumer Council": "No additional action is needed. UFCU takes care of everything for you. Your information will not be shared with third parties. The American Consumer Council's mission is to educate and guide consumers in their purchase of safe, reliable products and services." (This is UFCU's stated "join a nonprofit association" backdoor to eligibility for anyone who doesn't have a qualifying school/employer affiliation -- effectively how UFCU is open to the general public despite being a "credit union" with a field-of-membership requirement, but this is not explained anywhere as plainly as "anyone can join.")
- No ID upload, funding, e-signature, joint-owner, or ITIN/non-citizen options appear yet on this screen (ITIN is only mentioned in passing under "What You'll Need," as an alternative to SSN, with no further explanation of who needs an ITIN vs SSN).
- No progress indicator/step count is shown on this first screen (no "Step 1 of N").
- Links out: American Consumer Council modal; schedule an appointment; phone numbers; Refer-a-Friend Rules PDF/page.
- No live chat or FAQ widget present on this screen. The only help affordances are a phone number and a generic "Feedback" tab fixed to the right edge of the viewport (this is a site feedback/survey widget, not chat -- clicking it does not open a conversation, it is for post-visit satisfaction surveys).

## Screen 2: Handoff to application platform - "Tell us about yourself" (new vs. current member)

- URL: https://open.ufcu.org (a different subdomain; page title "Open a new account"; footer reads "Powered by Narmi", a third-party digital account-opening vendor used by many credit unions/community banks)
- Headline: "Tell us about yourself"
- No progress indicator visible yet.
- Form fields / choices:
  - Button: "I'm a new member" (arrow icon)
  - Button: "I'm a current member" (arrow icon)
  - Link: "Already started an application? Continue" (save-and-resume entry point, but only reachable if the applicant already has a saved-application link/session; there is no visible "save your progress" prompt during the flow itself, see Friction section)
- Language selector in the top right ("English" dropdown).
- Footer disclosures: "Insured by NCUA. Equal Housing Lender. Powered by Narmi." Support / Privacy Policy / Terms links. Phone: 512.467.8080. Email: members@ufcu.org.
- No chat widget on this screen either.
- This screen is a second, separate "are you new here" gate after the applicant already answered an implicit new-member question by clicking "Become A Member" on ufcu.org -- i.e. the eligibility/SEG selection made on ufcu.org is not obviously carried forward in any visible way (no "Welcome, UT Austin" confirmation), and the applicant is asked essentially the same "who are you" framing a second time.

## Screen 3: "Your info" - Step 1 of 5

- URL: https://open.ufcu.org (in-app step, same host)
- Progress indicator: "Step 1 of 5" (top right, persistent across this app's screens -- first real progress indicator in the whole flow)
- Headline: "Your info" / subheading "Let's get started"
- Initial state of this step: "Enter your phone number to load your details, or fill manually." with a single "Phone number" field and a "Next" button. This suggests UFCU/Narmi can prefill identity data from a phone-number lookup (likely a prior-relationship or data-broker match) before asking for anything else.
- Choosing "fill manually" expands the full form for this step:
  - Radio: "Do you want to open a joint account?" - Yes / No (defaults to No pre-selected in the UI as rendered)
  - Section header: "PERSONAL DETAILS"
    - Text field: "First name" (required, no explicit asterisk shown but no way to proceed without it)
    - Text field: "Last name"
    - Text field: "Social security number/ITIN" (has an info "i" icon, presumably a tooltip explaining SSN vs ITIN, not expanded during this read-only pass)
    - Text field: "Date of birth (mm/dd/yyyy)"
    - Text field: "Occupation"
    - Text field: "Email"
    - Text field: "Mobile phone"
    - Checkbox: "Under penalty of perjury, I certify that I am a U.S. citizen or resident alien and the number shown above is my correct taxpayer identification number. To receive dividends, I understand I must provide a valid Social Security Number." (a legal certification bundled as a plain checkbox, not a separate e-sign step)
  - Section header: "RESIDENTIAL ADDRESS"
    - Text field: "Residential address"
    - Text field: "Apt/Fl/suite"
    - Text field: "City"
    - Dropdown: "State" (full list of all US states/territories/military codes)
    - Text field: "Zip code"
    - Checkbox: "Mailing address is the same as my residential address"
  - Disclosure block (Patriot Act / CIP notice): "To help the government fight the funding of terrorism and money laundering, federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account. What this means for you: When you open an account, we will ask for your name, address, date of birth, and other information that will allow us to identify you. We may also ask to see your driver's license or other identifying documents."
  - Button: "Next"
- No ID upload control appears yet on this step (the CIP notice implies it will be requested later, likely alongside document capture in a subsequent step).
- No funding, e-signature, or product-selection controls appear on this step either -- all of that is presumably in steps 2-5, which are not reachable without submitting real identity data.
- This is the wall: proceeding past this screen requires a real first/last name, a real SSN or ITIN, a real date of birth, and a real address, which the task rules prohibit entering. The flow was stopped here.

## Friction and gaps observed

- The "Become A Member" entry point is hidden inside a collapsed hamburger menu on both desktop and mobile; there is no persistent, obviously-labeled "Join" button in the page body or header.
- Two different URLs (checking open-an-account, savings open-an-account) both silently collapse into the same generic join flow -- the implied product choice from the link text/URL is not honored, which will confuse anyone who clicked "Open a Free Checking Account" expecting to land on a checking-specific flow.
- The applicant is asked "who are you" twice in a row: once as a SEG/affiliation picker on ufcu.org, then again as "I'm a new member / I'm a current member" on open.ufcu.org, with no visible confirmation that the first answer carried over.
- "Field of membership" (the credit-union concept that you must belong to a qualifying group) is never explained in plain language. The dropdown just says "I am an employee, student or alumni of" with a fixed list of ~17 schools/employers, and the only way to learn that literally anyone can qualify is to notice and click the small "American Consumer Council" link and read its modal. This is a significant piece of hidden information: UFCU is effectively open to the general public via a $0 association membership, but nothing on the page says that plainly (e.g. no "Don't see your employer or school? Anyone can join for free" framing).
- Jargon/undefined terms: "SEG" is never used on-screen (good), but related concepts are still unexplained: "share account" is not shown on the screens reached, but "Social security number/ITIN" is presented with only a small info-icon tooltip and no inline guidance on who should use an ITIN vs SSN (e.g. non-citizens); "field of membership" and "credit union membership" concepts are implicit only.
- The FAQ that answers a core eligibility question ("Do I Need to Live in Austin to Become a Member?") is mis-filed under the "Money Market" FAQ category, not under anything like "Membership" or "Getting Started," making it very hard to find by browsing rather than searching. Its answer is also circular/non-committal: "Membership reaches beyond Austin. Visit UFCU.org for current eligibility details or reach out and we'll help you find your path to Membership in minutes" -- it doesn't actually state the eligibility rule, it just points back to the same site.
- No live chat widget exists anywhere in the flow (join landing page, application handoff page, or the FAQ/eligibility page). The only "help" affordances are a phone number, an email address (members@ufcu.org, shown only on the Narmi-hosted screens), and a generic "Feedback" tab that is a satisfaction-survey widget, not a way to ask a question.
- No visible save-and-resume affordance during the flow itself -- the only save/resume entry point is a "Continue" link on the very first Narmi screen ("Already started an application?"), which only helps if the applicant already knows to look for it or has a saved link/cookie; there's no visible "we'll email you a link to finish later" offer while actually filling out Step 1.
- The Patriot Act/CIP identity-verification disclosure and the SSN/perjury certification are both presented as dense paragraphs and a plain checkbox embedded mid-form, rather than a distinct, clearly-flagged legal step -- easy to skim past without registering what's being agreed to.
- A dismissible site-wide maintenance banner ("scheduled maintenance... Online Banking, the Mobile app, and Phone Banking will be unavailable") sits above the fold and, on mobile, pushes all join-flow content below the initial viewport, so a mobile visitor sees only a red warning banner and the hamburger/logo before any "Open an Account" content appears.
- No product selection (which checking/savings product, share account, etc.) is presented before or during the personal-info step; it appears to be deferred to steps 2-5, which are gated behind supplying a real SSN and other PII, so an undecided prospective member cannot compare products without first committing significant personal data.
- The phone-number "load your details" auto-fill option on Step 1 is not explained (what source it pulls from, whether it's a soft credit-bureau or identity-verification lookup), which could raise privacy concerns for a cautious applicant with no way to learn more in-line.
- The joint-account radio defaults to "No" pre-selected rather than forcing an explicit choice, which is a minor dark-pattern-adjacent default (easy to miss if you actually wanted a joint account).

## Opportunities to differentiate

- Surface a single, persistent, plainly-labeled "Join" or "Become a Member" button in the main header (not buried in a hamburger menu), so the entry point doesn't require exploration.
- Replace the fixed SEG dropdown with an eligibility-first conversational check: ask a couple of plain questions ("Do you live/work/study in Texas? Are you affiliated with one of these schools or employers?") and if none apply, immediately and clearly state the free-association path ("You can still join for free -- here's how") instead of hiding it behind a small link and modal.
- Collapse the two "who are you" gates (SEG picker, then new/current member) into one continuous step with visible state carried forward ("Welcome, UT Austin affiliate -- let's set up your account") so nothing feels re-asked.
- Make product selection (checking vs. savings vs. both, Plus vs. Free Checking) happen early, with a plain-language comparison, before demanding SSN/DOB/address -- let people window-shop before committing PII.
- Add a real, visible progress indicator from the very first screen (the current flow only shows "Step 1 of 5" once you're already on the second host, open.ufcu.org), and make the total step count and what's coming ("Personal info -> ID verification -> Product & funding -> E-sign -> Done") visible up front so the "3-5 minutes" claim feels credible.
- Add inline, plain-language microcopy next to SSN/ITIN ("Not a US citizen or resident? Use your ITIN instead -- here's what that is") and next to the field-of-membership question, rather than relying on a generic info-icon tooltip.
- Offer a genuine save-and-resume affordance surfaced proactively (e.g. "email me a link to finish this later") rather than a small "Already started an application?" link that only helps people who already know it exists.
- Add a real assistance channel (live chat or an AI concierge) directly inside the application flow, scoped to answering eligibility/documents/product questions, instead of only a phone number and a post-visit feedback survey widget.
- Separate the identity-verification (Patriot Act/CIP) disclosure and the SSN perjury certification into their own clearly-labeled micro-step with a short explanation of why the government requires it, rather than embedding dense legal paragraphs and a bare checkbox mid-form.
- Fix basic information architecture: file the "Do I need to live in Austin" FAQ (and similar eligibility FAQs) under an actual "Membership" or "Getting Started" category, and give it a real, direct answer instead of a circular referral back to the site.
- Make the dismissible maintenance/security banner collapse automatically or move below the fold on mobile so it doesn't push all "Open an Account" content off the initial screen.
- Consider an AI-assisted document/ID capture and prefill step earlier in the process (UFCU already gestures at this with the "enter your phone number to load your details" option) but explain what data source is used and let the applicant opt in knowingly, which would build trust rather than raise suspicion.
- Show the debit-card design choice (already previewed as marketing content on the landing page) as an actual step later in the real flow, since UFCU already treats it as a selling point.

## Screens not reachable without real data

- Step 1 of 5 ("Your info") on open.ufcu.org could not be completed/advanced past without entering a real first name, last name, Social Security Number/ITIN, date of birth, occupation, email, mobile phone, and residential address, plus checking the SSN perjury certification. Per the task's read-only rule, none of this was entered, and the flow was not submitted.
- Steps 2 through 5 of the open.ufcu.org application (very likely covering: identity/document verification or ID upload, product selection and account terms, funding the account/initial deposit, Refer-a-Friend code entry, e-signature of account agreements, and a final confirmation) were not reached and could not be documented, because they sit behind the Step 1 personal-information wall described above.
- No dedicated static "membership eligibility" or "before you apply" checklist page distinct from the application itself was found at guessed URLs (e.g. /membership, /about/membership-eligibility both returned a site 404). The closest equivalents are: the "What You'll Need" sidebar on the Screen 1 join landing page (documented above), and the single Money-Market-categorized FAQ "Do I Need to Live in Austin to Become a Member?" found via on-site search.
