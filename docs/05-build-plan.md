# 05. Build plan: one day, three people, three agents

Principle: integrate early, cut early, rehearse early. Nobody goes dark for more than 45 minutes.
The captain (Aaron) is the orchestrator: owns interfaces, merges shared files, runs check-ins, and
is the only person who changes scope.

## Lanes
| Lane | Owner | Delivers | Directories |
|------|-------|----------|-------------|
| A. AI layer and corpus | Aaron | Route handler, tools, prompt, corpus and product data, persona scripts, offline mode, chat UI cards | `app/api/chat`, `app/desk`, `components/desk`, `lib/ai`, `data` |
| B. Secure Zone | Owner B | `/apply` five steps, path logic, mock verification, trust readout, decision and next steps | `app/apply`, `components/apply`, `lib/apply` |
| C. Front door, i18n, design deliverable, deck | Owner C | Landing, persona sentence and chips, product and resource card components, language switch and dictionaries, brand tokens, Figma flow, slides | `app/page.tsx`, `components/home`, `components/cards`, `messages`, `docs/deck` |

Assign B and C at 9:10 based on comfort: the stronger React person takes B (more state), the
stronger writer and designer takes C (copy, translations, Figma, deck). Each lane owner drives
their own AI coding agent with AGENTS.md loaded and the relevant docs pasted in.

## Timeline with check-ins
All times Saturday. "CI" = check-in, five to ten minutes, everyone stops typing, captain runs it.

### 9:00 to 9:25  Kickoff and rubric read
- Read the official scorecard once. Captain maps each rubric line to an M-item in docs/03-prd.md.
  Anything the rubric weights that we do not cover gets a line in the stretch list or a slide.
- Settle the four open questions in docs/03-prd.md. Assign lanes.

### 9:25 to 9:50  Setup sprint (CI-0 at 9:50)
Captain runs these on the shared repo while B and C get keys and clone (brand tokens from docs/08-brand.md go into globals.css in this sprint):
```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
pnpm add ai @ai-sdk/react @ai-sdk/anthropic zod
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge input select progress dialog tabs
```
Then: commit `lib/types.ts` with the shared types from docs/04-architecture.md, `data/products.json`
with five products, `messages/en.json` with 20 keys, `.env.example`, and the brand tokens in
`globals.css`. Push. B and C pull and confirm `pnpm dev` renders on their machines.
CI-0 gate: three laptops running the same commit. Interfaces frozen: types, route names, tool names.

### 9:50 to 10:50  Build block 1: vertical slices
- A: `/api/chat` streams a reply with one tool (`recommendProducts`) rendering one card. Corpus loader.
- B: `/apply` shell with progress bar and step 1 (path picker with document checklist) reading a
  prefill from localStorage.
- C: landing with the persona sentence, chips, language switch wired to `useT()` with EN only.
CI-1 at 10:50: each lane demos its slice on `main`. Captain checks: is the handoff (desk to apply
via localStorage prefill) working end to end even if ugly? If not, that is the only thing anyone
touches until it is.

### 10:50 to 12:00  Build block 2: complete the happy path
- A: all four tools, resource cards with URLs, `startApplication` card, persona system prompt, scripted
  offline turns for Maya and Joon.
- B: steps 2 to 5 with zod validation, mock verify with the trust readout, decision variants.
- C: product and resource card components used by A, ES and KO dictionaries generated, brand pass.
CI-2 at 12:00 (lunch at desks): run persona Maya end to end from landing to decision. Then Joon.
**Scope freeze.** Captain writes the cut list on the whiteboard. Stretch items only get in if
every MVP acceptance line in docs/03-prd.md is green.

### 12:15 to 1:30  Build block 3: personas, language, polish
- A: Daniela and Robert scripted turns, eligibility rules, next-steps checklist content, prompt tuning
  against hallucination (fees, rates, student loans).
- B: decision explanations, next-steps checklist UI, video-banker scheduler mock, "Simulated" badges.
- C: Korean and Spanish pass through the whole flow, accessibility mode if time, screenshots for Figma.
CI-3 at 1:05: full run in Korean as Joon. Bug list on the whiteboard, ranked. Nothing new starts.
**1:30 feature freeze.** After this only bug fixes, copy, and demo prep. Any commit that is not a
fix needs the captain's ok.

### 1:30 to 2:15  Demo prep
- C builds the deck (docs/06-demo-and-pitch.md outline) and the Figma flow from screenshots.
- A records a backup screen capture of the full demo (QuickTime) in case the laptop or wifi dies.
- B runs the code hygiene sweep (below) and fixes the README run steps on a fresh clone.
CI-4 at 2:00: dress rehearsal with a timer. Two runs. Cut words until it lands at 4:30.

### 2:15 to 2:30  Pencils down (deliverables due 2:30)
Final commit tagged `demo`. Laptop that presents: wifi checked, offline mode tested, zoom level set,
notifications off, battery charged, HDMI adapter located.

### 3:00  Present. Order of speakers in docs/06-demo-and-pitch.md.

## Scope-cut ladder (cut from the top when behind at any CI)
1. Robert persona and accessibility mode (keep one slide).
2. Portuguese and French.
3. Translated disclosure summaries.
4. Business document checklist as a real step (keep as a card in Daniela's chat).
5. Video-banker scheduler mock (keep as a static message).
6. Live model calls (fall back to scripted turns for the whole demo; the UI is identical).
7. Funding step (skip; mention).
8. Korean (keep Spanish, which two of us can check).
Never cut: persona entry, source-linked cards, the visibly separate Secure Zone, the identity path
picker, the trust readout, the explained decision.

## Git protocol
- One branch: `main`. No PRs, no reviews; the check-ins are the reviews.
- Commit every 20 to 30 minutes. Message format `feat(lane): what` or `fix(lane): what`.
- Before push: `git pull --rebase origin main`. If a conflict is in your directory, resolve it. If it
  is in a shared file, stop and ping the captain.
- Never `git push --force`. Never commit `.env.local` or `node_modules`.
- Captain tags `ci-1`, `ci-2`, `ci-3`, `freeze`, `demo` so we can roll back to a known-good state in
  one command if a merge goes wrong.

## Quality gates (captain checks at CI-2, CI-3, and the sweep)
Code hygiene:
- `pnpm lint` and `pnpm tsc --noEmit` pass.
- No file over 250 lines; no unused components; no `console.log`; no commented-out code; no TODOs
  without an owner.
- No dependency that is not in docs/04-architecture.md.
- Every mock has `// MOCK:` and a "Simulated" badge where a user sees it.
Product hygiene:
- Every card URL opens a real ufcu.org page (spot check ten).
- The chat never asks for SSN, ITIN, passport number, DOB, or address (grep the prompt and the
  scripted turns).
- No claim about student loans, mortgages, or rates that is not in `data/`.
Demo hygiene (smoke checklist, run at CI-2, CI-3, CI-4):
1. Fresh clone, `pnpm install`, `pnpm dev`, landing loads under 3 seconds.
2. Maya: sentence to chat to two cards to continue to apply to instant to approved to checklist.
3. Joon in Korean: same path, foreign status, video route, needs-one-item or approved variant.
4. Wifi off, offline mode: Maya again, identical screens.
5. Refresh mid-application: state survives.
6. Phone width: landing and chat usable.

## Communication
One group chat. Every commit message is also a one-line status there if it changes something
another lane consumes. Blockers get posted the moment they are 15 minutes old, not at the next CI.
The captain spends at most 50% of the day coding; the other half is integrating and unblocking.

## Using AI coding agents well on the day
- Each owner opens their agent in the repo root with AGENTS.md, docs/03-prd.md, docs/04-architecture.md,
  and their lane's section of this file in context.
- Ask for one component or one function at a time. Paste the shared types. Review the diff before
  accepting. Reject anything that adds a dependency, a folder, or touches another lane.
- When the agent suggests a refactor, the answer is no until 1:30 PM, and then still no.
- If an agent output is over 250 lines, ask it to split before you paste it.
