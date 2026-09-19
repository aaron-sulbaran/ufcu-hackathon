# 08. Brand tokens

Source: the "Brand Guidelines" swatch in Resources/Hackathon Challenge.pdf (page 2). UFCU gave colors
only; no typography, spacing, or logo rules. Typography below is our call, matched to what the live
site and application use (a serif display for headings, a clean sans for everything else).

## Palette
| Role | Subtle | Lighter | Base | Darker | Darkest |
|------|--------|---------|------|--------|---------|
| Primary (navy) | #CDCDE0 | #8182B1 | **#23335D** | #020442 | #020332 |
| Secondary (orange) | #FCE1D2 | #F49A6A | **#EF6820** | #D14D10 | #693829 |
| Accent (amber) | #FDEBDB | #F6A055 | **#F2780C** | #A95408 | #854207 |

## Contrast (WCAG, computed)
| Pairing | Ratio | Use |
|---------|-------|-----|
| White on primary #23335D | 12.3 | Header, buttons, any text size |
| White on darkest #020332 | 19.8 | Secure Zone chrome |
| Primary on white | 12.3 | Body text |
| Primary on primary-subtle #CDCDE0 | 7.9 | Cards, chips |
| Primary on secondary-subtle #FCE1D2 | 9.9 | Callouts, highlighted rows |
| White on secondary #EF6820 | 3.2 | Large text and icons only (AA large is 3.0); never body text |
| White on secondary-darker #D14D10 | 4.4 | Primary CTA button text passes AA normal |
| White on accent #F2780C | 2.8 | Fails; accent is for fills, borders, and decoration only |
| White on accent-darker #A95408 | 5.3 | Accent buttons if ever needed |
| Secondary #EF6820 on white | 3.2 | Large headings only; links must use #D14D10 |

Rules that follow: CTA buttons use `#D14D10` background with white text (or `#EF6820` with text at
18px+ bold). Links in body copy use `#D14D10`. Accent `#F2780C` is a progress bar, an underline, a
badge fill with navy text, never text on white.

## CSS variables (paste into app/globals.css at the setup sprint)
```css
:root {
  --ufcu-primary: #23335D; --ufcu-primary-subtle: #CDCDE0; --ufcu-primary-lighter: #8182B1;
  --ufcu-primary-darker: #020442; --ufcu-primary-darkest: #020332;
  --ufcu-secondary: #EF6820; --ufcu-secondary-subtle: #FCE1D2; --ufcu-secondary-lighter: #F49A6A;
  --ufcu-secondary-darker: #D14D10; --ufcu-secondary-darkest: #693829;
  --ufcu-accent: #F2780C; --ufcu-accent-subtle: #FDEBDB; --ufcu-accent-lighter: #F6A055;
  --ufcu-accent-darker: #A95408; --ufcu-accent-darkest: #854207;

  /* shadcn mapping */
  --background: #FFFFFF; --foreground: var(--ufcu-primary);
  --primary: var(--ufcu-primary); --primary-foreground: #FFFFFF;
  --secondary: var(--ufcu-secondary-subtle); --secondary-foreground: var(--ufcu-primary);
  --accent: var(--ufcu-accent-subtle); --accent-foreground: var(--ufcu-primary);
  --muted: #F4F5F9; --muted-foreground: #4B5573;
  --border: var(--ufcu-primary-subtle); --ring: var(--ufcu-secondary);
  --destructive: #B42318;
}
.secure-zone {
  --background: #F7F8FC; --primary: var(--ufcu-primary-darkest); --ring: var(--ufcu-primary-lighter);
}
```
Tailwind v4: expose them with `@theme inline { --color-ufcu-primary: var(--ufcu-primary); ... }` so
classes like `bg-ufcu-primary` and `text-ufcu-secondary-darker` exist.

## Where each color lives
- Landing and Front Desk: white background, navy text, navy header, orange-darker CTA, secondary-subtle
  for assistant cards, accent as the thin progress or highlight line.
- Secure Zone: darkest navy header with a lock icon, off-white background, navy-lighter focus rings,
  monospace step labels. The difference must be obvious at a glance; that is a deliberate signal.
- Trust readout: pass = navy on primary-subtle, review = navy on accent-subtle, fail = destructive.
- Never use orange for error states; orange is the brand's warmth, not a warning.

## Typography (our choice)
- Display: a serif for H1 and H2 (the live application uses one; Fraunces or Source Serif 4 from
  Google Fonts are close and free). Body and UI: Inter or the system sans. Minimum body 16px;
  accessibility mode 20px.
- Korean: Noto Sans KR. Spanish and Portuguese fall back fine on Inter.
