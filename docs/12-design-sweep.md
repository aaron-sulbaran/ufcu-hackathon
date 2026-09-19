# 12. Design sweep against ufcu.org

Method: designlang extraction of ufcu.org plus a read of the site's compiled stylesheet, compared
against the running app at 11:00 AM. Ground truth is in DESIGN.md; screenshots in docs/research/site/.

## Findings, ranked

### Critical (the app currently reads as "not UFCU")
1. **Headings are a serif.** We set Source Serif 4 for every heading. The site has no serif at all;
   headings are Montserrat 700, Title Case, navy. This is the single biggest tell.
   Fix: Montserrat everywhere headings appear, weights per DESIGN.md. (app/layout.tsx, globals.css)
2. **Body text is navy.** We paint body copy #23335D. The site paints it #121926 (near-black) and
   reserves navy for headings and chrome. Our pages look tinted. Fix: ink token on body.
3. **Buttons are rounded rectangles.** The site's only button shape is a pill (110px radius),
   Inter 600 at 14px, orange #ce4b0d with #eb7231 hover. Ours are 12px rectangles with an
   opacity hover. Fix: one `.btn` recipe plus variants, applied everywhere (landing CTA, quick
   replies, Send, Continue, Use sample, Verify, Submit).
4. **Header is a single bar.** The site header is a system: logo cell with divider, primary nav with
   an orange active dot, utilities (language, routing number, search), then navy and purple action
   blocks. Below it a page-title band with breadcrumb. Ours has the logo and a select.
   Fix: components/shared/header.tsx rebuilt to that structure; new page-header band component
   used on /desk ("Front Desk") and /apply ("Open an Account").

### Important
5. **Links are orange.** Site body links are teal #005f73 (nav links purple). Our "Source on ufcu.org"
   and every link use orange. Fix: link token teal, underline on hover as the site does.
6. **Cards are pastel blocks.** Product and resource cards use an orange-subtle fill. Site cards are
   white with a hairline border or the md shadow; teal promo cards carry calls to action.
   Fix: white cards; the Continue card becomes the teal promo card with a white pill and orange text.
7. **The application does not borrow the site's own flow chrome.** The real flow says "Open an
   Account", shows a clock with "usually takes 3 to 5 minutes", and a gray "What You'll Need"
   panel. Ours says "Secure application" in a mono badge. Fix: page band "Open an Account", the clock
   line with our live timer ("usually under 3 minutes"), the checklist in a #f3f3f3 panel with a
   Montserrat h3, and the lock line kept.
8. **Headline voice.** Site heroes are lowercase with an orange "u" ("get rolling with 4.99% APR for
   u", "U have options."). Ours is a full sentence in serif. Fix: landing headline "the front desk,
   for u" (or "tell us what u need" if the team prefers the ask), sub in Inter, Title Case h2s.
9. **Form controls.** Site selects and inputs have a 1px navy border, 4px radius, 44px height; radios
   are native with navy accent. Ours use shadcn defaults with a subtle border. Fix: input recipe.
10. **Monospace and uppercase tracking** in the Secure Zone step labels ("STEP 1 OF 5") and the
    review. The site never uses mono or tracked caps. Fix: Inter 600, sentence case "Step 1 of 5".

### Minor
11. Gray secondary nav band: omit on our pages, but the page band plus breadcrumb must exist so the
    header does not end abruptly.
12. Footer: site footer is navy with white link columns; ours is a one-liner. Acceptable for the
    demo; add NCUA and Equal Housing text in Inter 300 12px.
13. Focus rings: navy 2px, not orange.
14. Disclaimer type: Inter 300, 12px, as the site does under rates.

## Plan (three lanes, about 75 minutes, freeze still 1:30)
| Phase | Owner | Work | Files |
|-------|-------|------|-------|
| 1. Tokens (done by captain first, 15 min) | Aaron | Montserrat + Inter fonts, ink and link tokens, heading rules, `.btn` recipe and variants, input recipe, card and panel recipes, remove serif | app/layout.tsx, app/globals.css |
| 2. Header and page band (agent, 25 min) | shared | Header rebuilt per DESIGN.md; PageHeader component (band + breadcrumb + optional clock line); wire into /, /desk, /apply; footer text | components/shared/**, app/desk/page.tsx, app/apply/page.tsx, app/page.tsx |
| 3a. Landing and desk (agent, 30 min) | A + C | Hero copy and type, persona sentence in Montserrat, chips as white cards, desk visit panel as gray panel, cards white, Continue card as teal promo, quick replies as outline pills, composer input recipe | components/home/**, components/desk/**, components/cards/** |
| 3b. Secure Zone (agent, 30 min) | B | Band and clock line, step labels sentence case, gray checklist panel, inputs and radios recipe, buttons to pills, trust readout white card, decision typography | components/apply/**, app/apply/** |
| 4. Screenshot QA (captain, 15 min) | Aaron | Side by side with docs/research/site/, fix drift, commit | |

Constraints: no new dependencies; Montserrat and Inter via next/font; every color through tokens;
no serif; no em dashes. Lanes 3a and 3b run in parallel after phase 2 lands.
