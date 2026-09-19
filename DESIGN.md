# DESIGN.md

Source of truth for how Front Desk looks. Derived 2026-09-19 from ufcu.org's live stylesheet
(`/dist/css/main.min.css`), the brand swatch in the challenge PDF, and the three site screenshots
in docs/research/site/. When this file and a component disagree, the component is wrong.

## Typography
| Role | Family | Weight | Size / line-height | Color |
|------|--------|--------|--------------------|-------|
| h1 (page header band) | Montserrat | 700 | clamp(2.375rem, 5vw, 3.125rem) / 1 | white on navy |
| h1 (in content) | Montserrat | 700 | clamp(2.375rem, 5vw, 2.5rem) / 1.25 | #121f48 |
| h2 | Montserrat | 700 | clamp(1.875rem, 5vw, 2rem) / 1.3 | #121f48 |
| h3 | Montserrat | 550 (use 600) | clamp(1.5rem, 4.5vw, 1.75rem) / 1.4 | #121f48 |
| h4, card titles | Montserrat | 700 | 1.125rem to 1.25rem / 1.4 | #121f48 |
| Body | Inter | 400 | 1rem / 1.8125 desktop, 0.875rem / 1.57 under 75em | #121926 |
| Nav labels | Inter | 600 | 1rem | #121f48 |
| Buttons | Inter | 600 | 0.875rem / 1.5 | per variant |
| Small print, disclaimers | Inter | 300 | 0.75rem | #121926 |
| Korean | Noto Sans KR | 400 / 600 | inherits | inherits |

Rules: headings are Title Case ("Open an Account", "Tell Us About Yourself", "What You'll Need").
Hero headlines are lowercase with the "u" wink in orange ("get rolling with 4.99% APR for u",
"U have options."). Body copy is sentence case. No serif anywhere. No all-caps labels except
one-word badges. Bold is Montserrat 700 on headings and Inter 600 on interactive labels; body
never bolds whole sentences. `text-wrap: balance` on all headings.

## Color
| Token | Hex | Where the site uses it |
|-------|-----|------------------------|
| navy (primary, site) | #121f48 | page header bands, headings, nav text, "Become A Member" block, selection |
| navy (brand swatch) | #23335D | the challenge swatch; use for tints and the Secure Zone surfaces, not chrome |
| ink | #121926 | body text, inputs |
| cta orange | #ce4b0d | filled buttons, "u" accent, orange text on white pills, prices |
| cta hover | #eb7231 | button hover and focus |
| brand orange (logo ring) | #ff671d | logo only, thin rules |
| orange subtle | #fce1d2 | soft highlight panels |
| link teal | #005f73 | body links, promo cards (teal background, white text), rate labels |
| purple | #6247aa | "Log In" block, secondary links in header, ATM markers |
| gray band | #ededed | secondary nav band |
| gray panel | #f3f3f3 | "What You'll Need" side panel, form backgrounds |
| gray line | #e6e6e6 | dividers, card borders |
| muted text | #6c7689 | breadcrumbs, helper text |
| white | #ffffff | page background, header |

Strategy: Committed. Navy carries the header bands and headings, orange carries every action,
white is the field. Teal appears once per page at most (a promo card or links). Purple only in
the header. No gradients, no glass, no cream.

## Buttons
- Base: pill, `border-radius: 110px`, Inter 600 0.875rem, padding 12px 20px, background #ce4b0d,
  white text, hover and focus #eb7231, transition background 0.4s ease-out. Min width 200px in a hero.
- On navy or teal: white pill, 2px white border, text #121926 700; hover border #ce4b0d; or the
  white pill with orange text ("Open an Account" on the teal promo card).
- Outline on dark: transparent, 2px white border, white text, radius 2em.
- Navy block button ("Become A Member"): square, navy fill, white Inter 600, icon left.
- Purple block ("Log In"): square, #6247aa fill, white, lock icon.
- Never a rounded-rectangle 12px button; the site has none.

## Header (replicate)
White bar about 84px tall. Left: the oval logo in its own cell with a 1px gray line on the right.
Then primary nav: Personal (active, orange dot before it), Business, Locations, About, Resources,
Inter 600 navy. Right: globe + "Español", "Routing #: 314977405" with copy icon, search icon.
Far right: navy "Become A Member" block, purple "Log In" block, both full height.
Below on personal pages: a gray band (#ededed) with Checking, Savings, Credit Cards, Loans,
Insurance, Investments, each with a chevron, Inter 600.
Then the page header band: navy, white Montserrat h1, 2rem vertical padding. Under it a breadcrumb
"Home • Page" in muted gray with the current page in ink.

Front Desk mapping: primary nav links go to the real ufcu.org sections. The language select sits
where "Español" sits, with the globe. "Become A Member" becomes "Start application" (navy block) and
"Log In" stays purple and links to ufcu.org login. The gray band is omitted on the desk and the
application. The page header band is used on `/desk` ("Front Desk") and `/apply` ("Open an
Account", the site's own name for the flow) with the breadcrumb. The Secure Zone keeps the white
header but its page band and progress bar are navy, and a lock line sits in the band.

## Surfaces and shapes
- Cards: white, radius 8 to 16px, border 1px #e6e6e6 or the md shadow
  (`rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px`). No pastel card fills.
- Promo card: teal #005f73, white text, radius 16px, 2rem 3.3rem padding, white pill button with
  orange text. Use for the "Continue to secure application" moment only.
- Side panel: #f3f3f3, radius 8px, Montserrat h3, teal links. Use for "What You'll Need" on step 1
  and "Your visit so far" on the desk.
- Inputs: 1px #121f48 border, radius 4px, 44px tall, Inter 1rem, focus ring navy. Radios and
  checkboxes: native size 18px, navy accent-color.
- Radii scale: 3, 6, 10, 16, 24, pill.
- Spacing base 8px; section padding 2rem to 3rem; container max 1504px on the site, 72rem here.

## Motion
Buttons 0.4s background ease-out (site value). Everything else 150 to 250ms ease-out-quart.
Reduced motion: transitions off. No entrance animations.

## Copy voice
Friendly, second person, "you" only. Section headings Title Case, short. One "u" wink per page,
never more. Buttons say what happens: "Open an Account", "Continue", "Submit application".
