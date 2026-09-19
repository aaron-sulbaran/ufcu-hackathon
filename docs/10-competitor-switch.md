# 10. Competitors and the switching story

The hosts said it at kickoff: show how easy it is to switch from a big bank to UFCU. This doc makes
that a first-class part of the product and the pitch, not a slide at the end.

## What every competitor's first screen asks for
Screenshots in docs/research/competitors/ (captured 2026-09-19; these are the online-access setup
pages for existing customers, which is the closest public equivalent of "get started online").

| Bank | First fields on screen one | Escape hatch for no SSN | Help |
|------|----------------------------|--------------------------|------|
| Capital One | Last name, Social Security Number or ITIN, date of birth | "Use bank account number instead" (still an identifier) | "Need help? Let's chat" |
| Second bank (blue "Getting started" flow) | Account, card or application number, Social Security number, username | "No Social Security number?" link | Info icons only; "You won't be able to come back to this page" |
| Wells Fargo | SSN or ITIN, date of birth | "I don't have an SSN or ITIN" checkbox; "Why do we ask for this?" link | none on screen |
| UFCU today (open.ufcu.org) | Name, SSN/ITIN, DOB, occupation, email, phone, address | none online; "schedule an appointment at your local branch" | phone number |

Pattern: identify first, help later. The first thing every one of them wants is a government number.
Wells Fargo's "Why do we ask for this?" is the only trust cue on any of the four screens, and it is
a dashed link. That single link is worth copying and doing better.

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
