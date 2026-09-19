# 10. Competitors and the switching story

The hosts said it at kickoff: show how easy it is to switch from a big bank to UFCU. This doc makes
that a first-class part of the product and the pitch, not a slide at the end.

## What every competitor's first screen asks for
Screenshots in docs/research/competitors/ (captured 2026-09-19; these are the online-access setup
pages for existing customers, which is the closest public equivalent of "get started online").

| Bank | First fields on screen one | Escape hatch for no SSN | Help |
|------|----------------------------|--------------------------|------|
| Capital One | Last name, Social Security Number or ITIN, date of birth | "Use bank account number instead" (still an identifier) | "Need help? Let's chat" |
| Chase (online enrollment) | Account, card or application number, Social Security number, username | "No Social Security number?" link | Info icons only; "You won't be able to come back to this page" |
| Wells Fargo | SSN or ITIN, date of birth | "I don't have an SSN or ITIN" checkbox; "Why do we ask for this?" link | none on screen |
| UFCU today (open.ufcu.org) | Name, SSN/ITIN, DOB, occupation, email, phone, address | none online; "schedule an appointment at your local branch" | phone number |

Pattern: identify first, help later. The first thing every one of them wants is a government number.
Wells Fargo's "Why do we ask for this?" is the only trust cue on any of the four screens, and it is
a dashed link. That single link is worth copying and doing better.

## Why they all look the same (and why that does not bind the experience)
It is regulation, but it binds less than it looks. The Customer Identification Program rule under the
USA PATRIOT Act (implemented for credit unions through NCUA rules and the Bank Secrecy Act) requires
a financial institution to collect, before an account is opened, at minimum: name, date of birth,
address, and an identification number. For a U.S. person that number is a taxpayer ID, normally an
SSN. For a non-U.S. person it can be a passport number, an alien ID number, or another
government-issued document number. Verification can happen through documents or non-documentary
means, and the rule sets what must be collected before the account exists, not the order in which a
website asks. Separately, the IRS tax certification (W-9 for U.S. persons, W-8BEN for foreign
persons) is what the branch packet's "not a U.S. citizen, will complete a W-8" checkbox covers.

So three things follow, and they are the argument for our design:
1. Asking for an SSN on screen one is a habit, not a requirement. Nothing stops an institution from
   helping first and collecting CIP data at the moment of application.
2. A no-SSN path is legal and already how the branch operates: passport plus W-8BEN, with the SSN or
   ITIN added later if the person gets one.
3. Everything the rule requires is still collected, in the Secure Zone, with the reason stated next
   to each field. That is the rubric's "explains why data is needed" line, earned by design rather
   than by a dashed link.
(Plain reading of public rules for a hackathon prototype; not legal advice, and say so if pressed.)

## The invitation to membership is an offer, not a push
The front desk helps whether or not you join. The assistant answers, recommends, and links. When the
person has enough to decide, it offers once: "Want me to start your application with what you've told
me? Nothing sensitive goes in until you get there." The card is a button, not a nag; no countdown, no
"limited time", no repeating the offer every turn. If they keep asking questions, it keeps helping.
This is the credit-union posture in product form and it is the difference between a front desk and a
sales funnel. Rubric C rewards it; the hosts asked for it.

## The UFCU difference we build around
A credit union is a non-profit that exists for its members, and its branches already act like it:
a person at the front desk asks what you need before anyone asks who you are. Front Desk keeps that
order online. Information first, identification when you have decided. By the time a person reaches
a field that asks for an SSN, ITIN, or passport, they already know which accounts they are opening,
why, what they cost, and what the number is for. And if they do not have that number, the path
exists instead of a phone number.

Deck line: "Every other first screen asks who you are. Ours asks what you need."

## Switching as a use case (added to the product)
1. Landing sentence gains an audience option: "switching from another bank". Goal options stay the
   same. This maps directly to rubric A (member segments).
2. The assistant, for a switcher, asks one question ("what do you use most: paycheck, bills, cards,
   savings?") and recommends the bundle plus a Switch Kit.
3. Switch Kit is a next-steps checklist after approval, each item a card with a ufcu.org link where
   one exists: move your direct deposit (employer form, UT Workday link for campus jobs), list your
   autopays to re-point (rent, phone, subscriptions), keep the old account open for one statement
   cycle, set up digital banking and the mobile app, add your debit card to your wallet, then close
   the old account. Rubric B rewards "clear time-savers"; this is one.
4. Prefill is the mechanism the hosts were describing: everything the person told the front desk
   flows into the application, so switching costs a conversation, not a form. Say that sentence in
   the demo when the Secure Zone opens already filled in.

## Persona changes
- Daniela (business) now explicitly banks personally at Wells Fargo and is moving both personal and
  business to UFCU; her next steps include the Switch Kit. She is the switching demo if there is time.
- Robert (stretch) is a Chase customer moving from Ohio; if he is cut, his switching story rides on
  Daniela.

## Pitch placement
- Opener: the three competitor first screens side by side with UFCU's own, SSN fields circled, then
  Front Desk's first screen: "I am a ... and I want ...". Fifteen seconds.
- Close: "Switching costs a conversation, not a form."
