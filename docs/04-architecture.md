# 04. Architecture

Design goal: explainable on one slide, buildable by three people in parallel, runs from `pnpm dev`.

```
Browser (Next.js App Router)
  /            Landing: persona sentence, chips, language switch      (Owner C)
  /desk        Front Desk conversation, cards, "continue" handoff     (Owner A)
  /apply       Secure Zone: 5 steps, trust readout, decision          (Owner B)
        |
        | POST /api/chat  (AI SDK UI message stream)
        v
Route handler (app/api/chat/route.ts)                                 (Owner A)
  streamText({ model: anthropic(FRONT_DESK_MODEL), instructions, messages, tools, stopWhen: isStepCount(4) })
  tools: recommendProducts, showResources, checkEligibility, startApplication
        |
        v
lib/ai/corpus.ts     loads data/corpus/*.md (frontmatter: url, title, tags, audience) and data/products.json
lib/ai/retrieve.ts   tag + keyword score, top 6 chunks, no embeddings
lib/ai/personas.ts   scripted offline turns for the four personas
```

## Stack and versions
Next.js (latest stable, App Router, TypeScript strict), Tailwind, shadcn/ui for primitives, pnpm.
AI: `ai` (Vercel AI SDK), `@ai-sdk/react` (`useChat` with `DefaultChatTransport`), `@ai-sdk/anthropic`.
Route handler pattern per current AI SDK docs: `streamText` with `tool({ description, inputSchema: z.object(...), execute })`,
`convertToModelMessages`, `stopWhen: isStepCount(n)`, returned via `createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })`.
Client renders `message.parts` where `part.type === 'tool-recommendProducts'` etc. Verify exact
exports against the AI SDK docs at setup; do not code from memory.

Model: `claude-haiku-4-5-20251001` by default (fast, cheap, fine for grounded recommendations);
switch to `claude-sonnet-5` for the demo if latency is acceptable on the venue wifi.

## Shared types (lib/types.ts, Aaron owns; propose changes in chat)
```ts
export type Audience = 'student' | 'international_student' | 'new_to_austin' | 'business' | 'retiree' | 'other';
export type Goal = 'checking' | 'savings' | 'build_credit' | 'credit_card' | 'loan' | 'unsure';
export type Lang = 'en' | 'es' | 'ko' | 'pt' | 'fr';
export type IdentityPath = 'ssn' | 'itin' | 'foreign_status' | 'minor' | 'branch_assist';

export interface PersonaContext { audience: Audience; goal: Goal; lang: Lang; personaId?: string }

export interface ProductCard { id: string; name: string; tagline: string; minToOpen: string; monthlyFee: string;
  highlights: string[]; reason?: string; sourceUrl: string }

export interface ResourceCard { title: string; summary: string; sourceUrl: string; tags: string[] }

export interface EligibilityResult { path: IdentityPath; documents: string[]; notes: string[]; sourceUrls: string[] }

export interface ApplicationPrefill { context: PersonaContext; path: IdentityPath; products: string[];
  firstName?: string; preferredName?: string; email?: string; schoolAffiliation?: string; notes: string[] }

export interface TrustCheck { id: 'document' | 'face' | 'consistency' | 'watchlist'; status: 'pass' | 'review' | 'fail'; detail: string }
export interface TrustReadout { checks: TrustCheck[]; confidence: number; route: 'instant' | 'video' | 'branch'; simulated: true }

export type Decision = { kind: 'approved' } | { kind: 'needs_item'; item: string; how: string[] }
  | { kind: 'not_yet'; reason: string; alternatives: ProductCard[] };
```

## Data
- `data/products.json`: the product catalog (checking tiers, savings, money market, certificates,
  credit builder loan, secured card, business checking) with fees, minimums, highlights, `sourceUrl`,
  and `audiences` tags. Seeded from docs/research/ufcu-products-and-eligibility.md.
- `data/corpus/*.md`: one file per ufcu.org page we ground on, frontmatter `url`, `title`, `tags`,
  `audience`, body 150 to 300 words. Seeded from docs/research/grounding-corpus-seed.md. Target 15 to
  20 files. The assistant may only cite URLs that exist here.
- `data/eligibility.json`: rules for `checkEligibility`: inputs (has SSN, has ITIN, citizenship
  status, age, affiliation) to path plus document list plus notes (e.g. "Zelle requires an SSN").
- `data/personas.json`: the four personas with context, prefill, scripted turns, trust readout, decision.

## Grounding without a vector store
The corpus is small (under 20 pages, under 8k tokens of summaries). Two layers:
1. The system prompt includes a compact index: one line per corpus file (title, tags, URL). Cheap
   and cacheable.
2. `showResources` and `recommendProducts` run a tag plus keyword score over the corpus and catalog
   and return the top matches with full text to the model, which then writes the reason lines.
The model is instructed to never state a fee, rate, or requirement that is not in a returned
chunk, and to answer "I do not have that on ufcu.org; here is who to call" otherwise.

## Prompt shape (lib/ai/prompt.ts)
Role: the front desk at UFCU's University Branch. Voice: warm, plain, two sentences max before a card.
Always: reply in `lang`; use tools rather than prose for products and resources; never ask for SSN,
ITIN, passport number, DOB, or address; when the person seems ready, call `startApplication`.
Facts block: credit union not a bank, non-profit, 17.9% rate cap, no UFCU student loans, membership
via affiliation or free ACC route, savings is the membership account. Persona block: audience, goal.

## Offline and demo reliability
`lib/ai/personas.ts` holds scripted assistant turns (text plus tool results) per persona. The client
uses them when `FRONT_DESK_OFFLINE=1`, when the API errors, or when a persona chip is used and the
"scripted" toggle is on. Scripted turns render through the same card components as live turns, so
the demo looks identical either way.

## Secure Zone state
React context `ApplicationProvider` with the prefill, form values, trust readout, and decision.
Persisted to localStorage under one key. No server calls except none; verification and decision are
computed client-side from `data/personas.json` (for personas) or from simple rules (for free-typed
applications: any sample ID passes, foreign status routes to video).

## Internationalization
`messages/{lang}.json` flat key-value. `lib/i18n.ts` exposes `useT()` reading the lang from a
context that the header switch sets and localStorage persists. Assistant language comes from the
same context via the request body. Generate `es.json` and `ko.json` from `en.json` with one Claude
call in a script (`scripts/translate.ts`), then a native reader skims them.

## Brand
Setup sprint extracts UFCU's palette and type from ufcu.org (navy header, orange CTA, serif display
for headings as seen in the current flow) into `app/globals.css` tokens. Secure Zone uses a
deliberately different chrome: darker header, lock badge, monospace step labels.

## Folder layout
```
app/
  layout.tsx, globals.css, page.tsx (landing)
  desk/page.tsx
  apply/page.tsx, apply/steps/*.tsx
  api/chat/route.ts
components/
  home/*, desk/*, cards/*, apply/*, ui/* (shadcn)
lib/
  types.ts, i18n.ts, ai/{prompt,corpus,retrieve,tools,personas}.ts, apply/{state,rules,mock-verify}.ts
data/
  products.json, eligibility.json, personas.json, corpus/*.md
messages/
  en.json, es.json, ko.json
scripts/
  translate.ts
docs/
```

## What we say to judges about identity (the one-slide version)
Trust is layered, not gated. Path selection (SSN / ITIN / foreign status) decides which documents
prove identity. Verification runs four checks (document authenticity, face match, data consistency,
watchlist) and produces a confidence score. Confidence picks a route: instant, a video call with a
banker, or a branch visit. The member sees all of it. In production the four checks map to a KYC
vendor and the core; today they are simulated and labeled as such.
