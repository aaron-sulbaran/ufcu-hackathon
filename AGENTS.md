# AGENTS.md (one-day hackathon edition)

Read this before touching code. It is short on purpose and it will not change during the day
except at the check-ins listed in docs/05-build-plan.md. Applies to every AI coding agent
(Claude Code, Cursor, Copilot, Codex) any of the three of us runs.

## What this is
Team LAN Party's entry for UFCU's Develop U Hackathon (Sat 2026-09-19, 9:25 AM to 2:30 PM build window).
Challenge: reimagine UFCU's new-member onboarding. Working title: **Front Desk**. See docs/03-prd.md.
Order of operations is the product: information first, identification only after the person decides.
Switching from another bank is a first-class audience (docs/10-competitor-switch.md).

## Stack (fixed; do not add frameworks)
- Next.js (App Router) + TypeScript strict + Tailwind + shadcn/ui, pnpm
- Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/anthropic`), Claude via ANTHROPIC_API_KEY
- zod for tool input schemas and any external input
- No database, no auth, no vector store. Grounding corpus is static files in `data/`.
- Must run locally with `pnpm install && pnpm dev`. That is the judging environment.

## Directory ownership (avoid merge conflicts)
| Path | Owner |
|------|-------|
| `app/api/chat/`, `app/desk/`, `components/desk/`, `components/cards/`, `lib/ai/`, `data/` | Lane A (AI layer, corpus, personas, cards) |
| `app/apply/`, `components/apply/`, `lib/apply/` | Lane B (Secure Zone application flow, mock identity, decision) |
| `app/page.tsx`, `components/home/`, `components/shared/`, `messages/` | Lane C (landing, persona entry, header, i18n) |
| `lib/types.ts`, `lib/context.tsx`, `lib/i18n.tsx`, `lib/products.ts`, `app/layout.tsx`, `app/globals.css`, `components/ui/` | Shared. Captain merges; propose in chat first |

Edit only inside your directories unless you asked in the team chat. Shared types live in one file.

## Brand
Colors come from `docs/08-brand.md` via CSS variables in `app/globals.css`. Never hardcode a hex in a component.
Orange `#EF6820` is never body text; CTAs use `#D14D10` with white text. Secure Zone uses the `.secure-zone` overrides.

## Rules that keep the codebase clean
1. Small commits every 20 to 30 minutes with a plain message: `feat(apply): mock ID step`.
2. `git pull --rebase origin main` before every push. Never force push. Never commit `.env.local`.
3. No new npm dependency after the 12:00 check-in without a message in the team chat.
4. No file over ~250 lines. Split components instead of growing them.
5. No dead code, no commented-out blocks, no console.log left behind at freeze (1:30 PM). Deliverables due 2:30 PM.
6. Every AI recommendation shown to a user must carry a `sourceUrl` that resolves to a real ufcu.org page from `data/corpus/`.
7. The chat never asks for SSN, ITIN, passport number, DOB, or address. Those fields exist only in `app/apply/`.
8. Mocks are labeled in code (`// MOCK:`) and in the UI ("Simulated" badge) so judges never think we faked a real system.
9. Prefer `{ data, error }` returns at module boundaries over throwing.
10. If a task would take more than 45 minutes, say so at the next check-in instead of going dark.

## Do not
- Do not restructure folders, rename shared types, or "refactor for cleanliness" mid-day.
- Do not add a backend beyond Next.js route handlers.
- Do not touch another owner's directory to "quickly fix" something; post the diff idea in chat.
- Do not write tests beyond the smoke checklist in docs/05-build-plan.md; the demo is the test.
