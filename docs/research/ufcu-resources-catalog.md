# UFCU Resources Catalog

Fetch date: 2026-09-19
Purpose: Catalog of University Federal Credit Union (UFCU) public web content under ufcu.org/resources and related sections, for building a retrieval corpus for an AI-assisted new-member onboarding chatbot.

## Sources fetched (2026-09-19)

1. https://ufcu.org/resources
2. https://ufcu.org/help (404, not found)
3. https://ufcu.org/faq (404, not found)
4. https://ufcu.org/disclosures (404 at this path; content lives at /policies-legal/disclosures, reached via links)
5. https://ufcu.org/rates (404 at this path; rates content found at /resources/tools/rates-fees)
6. https://ufcu.org/fees (404, not found)
7. https://ufcu.org/security (redirects/serves content equivalent to /resources/security-fraud)
8. https://ufcu.org/contact (404 at this path; contact content lives at /about/contact-us)
9. https://ufcu.org/locations
10. https://ufcu.org/resources/articles
11. https://ufcu.org/resources/member-services/banking
12. https://ufcu.org/resources/member-services/banking/zelle
13. https://ufcu.org/resources/member-services/banking/mobile
14. https://ufcu.org/resources/tools/financial-success
15. https://ufcu.org/resources/calculators
16. https://ufcu.org/resources/faqs/overdraft-services
17. https://ufcu.org/resources/faqs/digital-banking
18. https://ufcu.org/resources/faqs/security
19. https://ufcu.org/resources/tools/forms
20. https://ufcu.org/resources/tools/member-relief-center
21. https://ufcu.org/resources/tools/drive
22. https://ufcu.org/personal/loans/credit-builder
23. https://ufcu.org/personal/checking/simply-u
24. https://ufcu.org/resources/articles/detail/articles/2024/10/21/finance-tips-for-college-grads
25. https://ufcu.org/resources/articles/detail/articles/2026/08/19/what-is-a-credit-union
26. https://ufcu.org/resources/faqs/account-management
27. https://ufcu.org/resources/faqs/cards
28. https://ufcu.org/business/resources
29. https://ufcu.org/resources/retirement-resources
30. https://ufcu.org/resources/member-services/banking/digital-payment-solutions

30 fetches total: 4 failed (404), 26 returned usable content.

---

## Category: Resources Hub / Navigation

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/resources | Resources \| UFCU | Hub | Central navigation page linking to member services, articles, tools, FAQs, calculators, and retirement resources. | Orientation map; use to discover all other corpus sources and site structure. |

## Category: Digital Banking / Member Services (Banking)

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/resources/member-services/banking | Banking Services \| UFCU | Digital banking overview | Lists online banking, mobile app, phone banking, digital payment solutions, account alerts, direct deposit, wire transfers ($20 outgoing, incoming free), overdraft options, Credit Coach, Premier Banking. | Single jumping-off page for "how do I bank with UFCU digitally." |
| https://ufcu.org/resources/member-services/banking/mobile | UFCU Mobile App | Mobile app | iOS 16.0+ / Android 12.0+; mobile check deposit, bill pay, card lock/PIN change, alerts, credit score monitoring; nightly maintenance window 10pm-1am, Sunday midnight-4am; no on-device account data storage. | First app download and setup guidance for a new member. |
| https://ufcu.org/resources/member-services/banking/zelle | Zelle \| UFCU | Payments (thin page) | Landing page only; confirms Zelle is offered as a UFCU banking service but has no detail on limits, fees, or enrollment steps on-page. | Answers "does UFCU support Zelle" but chatbot must route detail questions to phone/appointment. |
| https://ufcu.org/resources/member-services/banking/digital-payment-solutions | Digital Payment Solutions \| UFCU | Digital wallets | Supports Apple Pay, Google Pay, Samsung Pay, Garmin Pay, PayPal, and Zelle. Add card to wallet via UFCU Mobile app; contactless in-store tap to pay; biometric + tokenization security; card number never shared with merchant; no fees stated. | Sending money / using phone to pay, common student and new-to-Texas use case. |
| https://ufcu.org/resources/faqs/digital-banking | Digital Banking FAQs | FAQ | Extensive Q&A on enrollment, password rules (8-40 chars), one-time passcodes (10-min expiry), alerts, statements (84 months available, ~1 year transaction history), Transfer to a Non-UFCU Member (P2P, no fee, 7-day claim window), mobile deposit, card activation/PIN, external-bank transfers (processed Sun-Thu 5pm). | Deep reference for "how do I use online/mobile banking" questions; largest content block in this catalog. |

## Category: Fraud, Security & Disclosures

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/security (serves /resources/security-fraud content) | Security & Fraud Resources \| UFCU | Security | "Pause. Prevent. Protect." messaging; covers impersonation, phishing, romance scams, law-enforcement scams, tokenized-payment fraud; UFCU states it will never ask for password/PIN/one-time passcode. | Core fraud-avoidance content; must be in grounding corpus to correctly answer "is this a scam" questions. |
| https://ufcu.org/resources/faqs/security | Security FAQs | FAQ | Detailed FAQ distinguishing scam vs. fraud, phishing red flags, unauthorized-charge process (call 866-928-5450), P2P/Zelle payments "may be treated like cash and are not always reversible," fraud reporting via fraud@ufcu.org or phone menu. | Direct source for fraud-protection answers; contains exact phone numbers and irreversibility warning for Zelle. |
| https://ufcu.org/disclosures (content at /policies-legal/disclosures) | Disclosures \| UFCU | Legal | Index of PDFs: Membership/Account Agreement, Reg E EFT Agreement, Truth-in-Savings, Funds Availability, Arbitration Agreement, Credit Card Agreement, Online Banking Terms, Zelle/P2P/A2A Terms, ESIGN Disclosure, Overdraft Service Disclosure, Privacy Policy, Fraud Policy. | Authoritative legal source; chatbot should cite these PDFs rather than paraphrase for binding terms. |

## Category: Accounts & Getting Started

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/personal/checking/simply-u | Simply U Checking \| UFCU | Checking account | $0 to open, no monthly fee, no overdraft fees (spend-what-you-deposit model), no check-writing, instant-issue contactless Visa debit card, $1,000/day ATM limit, 500+ fee-free ATMs, mobile deposit. Eligibility requirements exist but are not detailed on-page. | Likely first account for a student or first-time member who wants to avoid overdraft risk; simplest onboarding product found. |
| https://ufcu.org/resources/tools/forms | Forms \| UFCU | Forms | Categorized list: account applications, banking forms (deposit slip, wire transfer), account management, direct deposit (including a University of Texas Workday portal link and a UT Student Financial Aid Box link), credit card forms, loan forms. | Direct-deposit setup for UT-affiliated new members is a named, dedicated pathway here. |
| https://ufcu.org/resources/tools/financial-success | Financial Success \| UFCU | Financial education hub | Credit Coach (free 8-question assessment via creditmountain.org), GreenPath free counseling partnership, Member Relief Center, in-branch Credit Review sessions, Credit Builder Loan, D.R.I.V.E. car-buying method. | Central hub for "help me get started financially," aimed at first-time and credit-building members. |
| https://ufcu.org/personal/loans/credit-builder | Credit Builder Loan \| UFCU | Credit building | Loan amounts $500-$2,500, terms 6-24 months, minimum $30/month payment, flat 3.00% APR, no application fee, payments reported to three credit bureaus, designed for little/no/poor credit. | Directly answers "how do I build credit as a student / first-time borrower." |
| https://ufcu.org/resources/faqs/account-management | Account Management FAQs | FAQ | Explains joint account holders (full access, own card/login), Power of Attorney (ends at death), beneficiaries (access only after death certificate), advises against sharing passwords; these changes require branch/phone, not online. | Useful for co-signers/parents helping a new student open or manage an account. |

## Category: Cards

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/resources/faqs/cards | Credit and Debit Cards FAQs | FAQ | 48-item FAQ: lost/stolen card process (800-252-8311 or 888-842-6328), dispute process (60 days, written, PO Box), Card Keeper self-service lock/PIN/replace, debit preauthorization holds (~72 hrs, gas stations up to $75), contactless/NFC "tap to pay" security. | Answers first-credit-card and card-security questions; contains exact phone numbers and hold-time facts. |
| https://ufcu.org/resources/calculators | Calculators \| UFCU | Tools | 8 calculators: vehicle payment, vehicle affordability, loan term comparison, mortgage payment, down payment, credit card payoff, business loan payment, Plus Checking bonus (2.25% APY) vs. Free Checking comparison. | Self-service planning tools members can be pointed to instead of guessing numbers. |

## Category: Overdraft & Fees

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/resources/faqs/overdraft-services | Overdraft Services FAQs | FAQ | Distinguishes Overdraft Protection Transfer (free, up to 3 linked accounts) from Courtesy Pay (opt-in for debit signature transactions; limits $100 new / $400 Free-Teen / $1,000 Plus / $1,500 Business after 90 days; no fee under $5; 45 days to repay). | Core "avoiding overdraft" content; directly matches a target onboarding scenario. |
| https://ufcu.org/rates (content at /resources/tools/rates-fees) | Personal Banking Rates & Fees \| UFCU | Rates/Fees | Free checking available; Plus Checking bonus dividend up to 2.25% APY ($10/mo fee waived at $10,000+ balance); savings 0.01% APY; Money Market 0.01%-3.25% APY tiered; Certificates/IRAs 3.25%-4.10% APY; auto loan APR 4.99%-17.90%; credit card APR 9.49%-17.90%; non-network ATM fee $1.00; outgoing wire $20; late fees $25-$35; safe deposit box $15-$350/yr. | Authoritative current numeric source for any rate/fee question; must be checked against the current live page before quoting since rates change. |

## Category: Locations & Access

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/locations | UFCU Locations | Locations | Branch/ATM locator with search and filters; describes Out-of-Branch Services (Coinstar coin transfer, Allpoint cash deposit); mobile app download links (iOS, Android). | "Where can I bank" for someone new to Texas/Austin. |

## Category: Articles / Financial Education

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/resources/articles | Articles \| UFCU | Article hub | Organized into 11 categories (Be a Wise Consumer, Business Tools, Buy & Own a Car, Buy & Own a Home, Conquer Life's Challenges, Establish Your Finances, Insure Your Home & Property, Invest & Save, Manage Your Finances, Prioritize Your Security, Understand Your Credit); lists 18 featured articles. | Index for pulling many more corpus articles later; category taxonomy useful for chatbot topic routing. |
| https://ufcu.org/resources/articles/detail/articles/2026/08/19/what-is-a-credit-union | What Is a Credit Union? A Comprehensive Guide by UFCU | Article - Establish Your Finances | Defines credit union as a not-for-profit, member-owned cooperative with democratic governance (one member, one vote); NCUA insurance up to $250,000; notes tradeoffs (membership eligibility, fewer branches). States UFCU founded 1936. | Foundational "what is a credit union / why join" content for true newcomers. |
| https://ufcu.org/resources/articles/detail/articles/2024/10/21/finance-tips-for-college-grads | Finance Tips for College Grads | Article - Establish Your Finances | Four tips: get a job (loan repayment often starts 6 months post-grad), start retirement savings early (esp. with employer match), understand your credit score, build a student loan repayment strategy; mentions UFCU's free credit reviews. | Directly matches "students / people new to independent finances" persona. |
| https://ufcu.org/resources/tools/drive | D.R.I.V.E. with UFCU | Article/Program - Buy & Own a Car | Car-buying framework: Decide on Your Path, Research Your Options, Ideal Game Plan, Vehicle Buyer's Check, Execute & Enjoy; includes affordability calculator and 17+ term glossary. | Useful if onboarding scope extends to first major purchase (car) financed through UFCU. |

## Category: Business Banking

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/business/resources | Business Resource Center \| UFCU | Business | Organizes content by starting/building/growing a business; links to Texas business-formation articles, cash flow templates, business loan calculator, and partner orgs (Texas SBDC, PeopleFund, Business Community Lenders, EGBI); Business Advisor line (512) 421-7310. | Matches "starting a small business" persona directly. |

## Category: Hardship / Relief

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/resources/tools/member-relief-center | Member Relief Center \| UFCU | Hardship support | Member Relief Loans (low-interest, up to 90 days no payment), loan payment skip options, mortgage assistance line (800-240-4214), business hardship line, plus external community resources (Findhelp.org, 2-1-1 Texas, ConnectATX.org, Central Texas Food Bank). | Safety-net content for a member who hits financial trouble after joining. |

## Category: Retirement

| URL | Title | Category | Summary | Why a new member needs it |
|-----|-------|----------|---------|---------------------------|
| https://ufcu.org/resources/retirement-resources | Retirement Resources \| UFCU | Retirement | Silvur partnership for Medicare/Social Security/tax planning, Retirement Readiness Calculator, early Social Security direct deposit (2 days early), Step-Up Certificates, Investment Services via LPL Financial. | Lower priority for a brand-new/young member but rounds out the corpus for completeness. |

---

## Gaps / failed fetches

- https://ufcu.org/help: 404 Not Found. No content retrieved. A help-center equivalent was not located at this exact path; closest analog is /resources/faqs/* and /about/contact-us.
- https://ufcu.org/faq: 404 Not Found. FAQ content instead lives under /resources/faqs/<topic> (bill-pay, money-market, simply-u, digital-banking, cards, mfa, overdraft-services, shared-branches, unclaimed-property, credit-coach, services-for-all, digital-payments, account-management, security). Only a subset of these topic FAQs were fetched in this pass (overdraft-services, digital-banking, security, account-management, cards); bill-pay, money-market, simply-u, mfa, shared-branches, unclaimed-property, credit-coach, services-for-all, and digital-payments FAQs were discovered but not individually fetched.
- https://ufcu.org/fees: 404 Not Found. Fee content instead lives at /resources/tools/rates-fees (personal) and /resources/tools/business-rates-and-fees (business, not fetched in this pass).
- https://ufcu.org/contact: 404 Not Found. Contact content instead lives at /about/contact-us (linked from many pages but not independently fetched for its own content/hours detail beyond what other pages already stated).
- https://ufcu.org/disclosures, https://ufcu.org/rates, https://ufcu.org/security: none of these exact paths returned their own dedicated page; in each case the equivalent content was reached via the linked canonical path (/policies-legal/disclosures, /resources/tools/rates-fees, /resources/security-fraud respectively). Treat the exact URLs above as redirect-equivalent, not confirmed independently.
- Not fetched due to scope/budget: /resources/tools/business-rates-and-fees, /resources/tools/manage-account-access, /resources/faqs/bill-pay, /resources/faqs/money-market, /resources/faqs/simply-u, /resources/faqs/mfa, /resources/faqs/shared-branches, /resources/faqs/unclaimed-property, /resources/faqs/credit-coach, /resources/faqs/services-for-all, /resources/faqs/digital-payments, /policies-legal/privacy-policy, /policies-legal/online-and-mobile-privacy-policy, /policies-legal/visa-zero-liability, /policies-legal/fraud-policy, /policies-legal/member-conduct-policy, most individual legal PDFs, most individual articles beyond the 3 fetched, /about/contact-us direct fetch. These are good candidates for a follow-up crawl pass if the corpus needs to grow beyond this seed.
