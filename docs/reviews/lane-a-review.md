# Lane A review: AI layer and Front Desk conversation

Date: 2026-09-19, 10:05 AM CDT. Read-only review against the running dev server on :3000
(no API key in the environment, so every live request is served in scripted mode).
Installed: ai 7.0.107, @ai-sdk/react 4.0.110, @ai-sdk/anthropic 4.0.58, next 16.3.5, zod 4.
`tsc --noEmit` and `eslint` on the lane A directories are both clean.

## Known bug: /desk?persona=maya never sends the first turn

Not reproducible against the current file. `components/desk/conversation.tsx` was modified at
09:58:15 (route.ts at 09:48), so the report likely predates that edit. Verified in the browser:

- Direct visit to /desk?persona=maya and /desk?persona=joon: exactly one POST /api/chat per
  load, the persona's user turn renders once, the "Scripted mode" badge and cards render.
- Home page chip "Maya" (client-side router.push): one POST, one turn.
- Stale localStorage context (retiree/es) before visiting ?persona=maya: the persona context
  wins, header language is en, quick replies are the student set.

Why the three suspects are not the cause:
- `lib/ai/personas.ts` imports only `data/personas.json` and types; no fs, safe on the client.
- `useSearchParams` under the Suspense boundary in `app/desk/page.tsx:17` resolves on the
  client before the effect runs.
- React strict mode double-mount: `useChat` registers `chat.stop()` as an unmount cleanup
  (`@ai-sdk/react/dist/index.js:364-371`), but `stop()` only aborts `this.activeResponse`,
  which `makeRequest` sets after the transport fetch resolves. The simulated unmount therefore
  finds nothing to abort, and the `started` ref blocks the second send. Net: one request.

If it comes back, check devtools first for a canceled request (abort) versus no request
(effect never fired), and confirm `.next` is not serving a stale chunk after the 09:58 edit.
One real fragility to keep in mind: the effect deps `[urlPersona, setContext, send]` change on
every render because `setContext` is recreated each render in `lib/context.tsx:25`; the guard
holds today, but any refactor that sets `started.current` after an await will double-send.

## Findings, most severe first

1. Scripted mode replays the last persona turn, including the application offer, on every
   later question (`app/api/chat/route.ts:41-45`, `lib/ai/personas.ts:13-17`).
   Verified: after Maya's three scripted turns, four quick-reply clicks produced three more
   "here is exactly what to bring" turns and three more Continue cards. The same index logic
   also answers off-script questions with the next scripted answer regardless of content
   ("How do I build credit?" is answered with "Simply U opens with $0"). This breaks the PRD
   rule that the invitation is offered once and never repeated (docs/03-prd.md:106,
   docs/10-competitor-switch.md:523-529), and a judge hits it within 60 seconds of clicking
   quick replies without a key.
   Fix: in `fallbackPayload`, use the persona turn only when `turnIndex < turns.length` and the
   last user text equals `turns[turnIndex].user`; otherwise return a generic scripted line plus
   `resourcesFor(lastUserText, context)` cards, and never emit `startApplication` again once it
   has been sent (check prior messages for a `tool-startApplication` part).

2. Live-mode failures never fall back to scripted turns, and the client shows nothing
   (`app/api/chat/route.ts:80-106`, `components/desk/conversation.tsx:23`).
   `streamText` does not throw synchronously; a bad key, unknown model, or network error
   arrives as an `error` chunk through `toUIMessageStream` (default `onError` masks it to
   "An error occurred."), so the `catch` block is dead code. `useChat`'s `error` is never
   destructured or rendered, so the judge sees "..." and then an empty turn.
   Fix: inside `execute`, read `toUIMessageStream(...)` with a reader loop and forward chunks
   with `writer.write`; if a chunk has `type === "error"` before any text or tool chunk, write
   the `scriptedStream` chunks for `fallbackPayload(...)` instead. On the client, render
   `error` from `useChat` as a one-line notice with a retry.

3. Default model id is a dated snapshot (`app/api/chat/route.ts:24`, `.env.example:4`).
   `claude-haiku-4-5-20251001` is the old date-suffixed form; the current published ids are
   `claude-haiku-4-5` and `claude-sonnet-5` with no date suffix. If the dated id no longer
   resolves, every live turn takes the finding 2 path and renders blank, which would look like
   the app is broken rather than offline.
   Fix: set `DEFAULT_MODEL = "claude-haiku-4-5"` (or `claude-sonnet-5` for the demo), update
   `.env.example`, and curl one live turn with the real key before the demo.

4. Retrieval returns the fallback trio for every non-English query
   (`lib/ai/retrieve.ts:16-22`, `lib/ai/tools.ts:69-71`, `lib/ai/prompt.ts:37`).
   `terms()` strips everything outside `[a-z0-9]`, and the prompt tells the model every word
   including tool input is in the person's language, so a Korean or Spanish `showResources.query`
   yields zero terms and always returns open-account, membership, savings. Accented Spanish
   ("credito" vs "crédito") is split mid-word. In live mode Joon and Daniela never get a
   relevant resource card.
   Fix: describe `query` as "English keywords matching the page tags, for example zelle ssn
   wire" in the tool schema, and add `.normalize("NFD").replace(/[̀-ͯ]/g, "")` in
   `terms()`.

5. English leaks into Korean and Spanish turns (`lib/ai/tools.ts:28`, `app/api/chat/route.ts:48`,
   `components/cards/eligibility-card.tsx:12,17`, `components/cards/product-card.tsx:21,25`).
   The forced savings reason, the generic scripted intro, and the card chrome labels ("Your
   path", "What to bring", "Opens with", "Monthly fee") are hardcoded English. Joon's Korean
   demo shows English labels on every card.
   Fix: card labels through `useT()` with four new keys in `messages/*.json` (ask lane C); the
   savings reason and scripted intro from a `Record<Lang, string>` keyed by `context.lang`.

6. Grounding data disagrees with itself and cites pages outside the corpus
   (`data/products.json:7`, `data/corpus/savings-overview.md:12`, `lib/ai/prompt.ts:43`,
   `data/eligibility.json:105`).
   Certificate terms are "3 to 18 months" in the catalog and "3 to 60 months" in the corpus;
   the model sees both. The prompt says "Only these URLs exist" listing corpus URLs, yet the
   catalog cites `business/checking/checking` and `resources/faqs/simply-u/detail`, and
   eligibility.json cites `business/checking/checking`; none are in `data/corpus/`, which
   contradicts AGENTS.md rule 6.
   Fix: correct the certificate highlight, and add two corpus files (business checking, Simply U
   FAQ) so every `sourceUrl` in data/ resolves to a corpus page.

7. Model prose will contain markdown and can contain URLs and numbers that bypass the cards
   (`lib/ai/prompt.ts:14-16`, `components/desk/assistant-turn.tsx:27-33`, `lib/ai/corpus.ts:61`).
   Text parts render as raw strings, so `**bold**` and `- bullets` show as asterisks and
   dashes. Nothing checks prose for URLs; `CORPUS_URLS` is exported for that purpose and unused.
   Fix: add "Plain text only. No markdown, no bullet lists, no URLs or dollar amounts in prose;
   cards carry those." to VOICE, and in `tool-output.ts` `partText` strip `https?://\S+` tokens
   not present in `CORPUS_URLS`.

8. Nothing stops a person from typing an SSN into the composer (`components/desk/composer.tsx:16-22`).
   The prompt forbids asking, but a typed nine-digit number goes straight to the model. Rubric E
   says "chat never takes PII" and a judge may test exactly this.
   Fix: in `submit`, match `/\b\d{3}-?\d{2}-?\d{4}\b/`; if it hits, do not send and show
   `t("desk.noSensitive")` ("Keep that for the secure application; nothing sensitive goes in
   here.").

9. A saved application shadows a newer prefill (`components/desk/continue-card.tsx:15-17`,
   `lib/apply/state.tsx:84-100`).
   The handoff itself works: `frontdesk.prefill` holds the full `ApplicationPrefill` (verified).
   But lane B hydrates from its own saved state first and only reads the prefill when nothing
   is saved, so a judge who runs Maya to /apply, returns home, runs Joon, and clicks Continue
   sees Maya's application.
   Fix (lane B directory, post in chat): when the stored state's `prefill.context.personaId`
   differs from the fresh prefill's, prefer the fresh prefill; or export a `clearApplication()`
   that ContinueCard calls in its effect.

10. Request body is trusted without validation (`app/api/chat/route.ts:65-68`, `lib/ai/prompt.ts:39`).
    Malformed JSON returns a 500 (verified). A partial `context` (missing `audience`) throws in
    `systemPrompt` at `.replace`. AGENTS.md and the global rules ask for zod on external input.
    Fix: `z.object({ messages: z.array(z.any()), context: contextSchema.default(DEFAULT_CONTEXT),
    personaId: z.string().optional() }).safeParse(await req.json().catch(() => null))`, return
    400 on failure.

11. Changing `?persona=` while already on /desk does nothing (`components/desk/conversation.tsx:34-42`).
    The `started` ref and the un-keyed `useChat` keep the old conversation; only a full remount
    (via the home page) starts the new persona. A judge editing the URL bar gets a stale chat.
    Fix: pass `id: urlPersona ?? "desk"` to `useChat` and reset `started.current = false` in an
    effect keyed on `urlPersona`.

12. Dead code and leftovers (`lib/ai/corpus.ts:61,68`, `lib/ai/retrieve.ts:7`,
    `app/api/chat/route.ts:76,100,104`).
    `CORPUS_URLS` and `docByUrl` are unused (or use them per finding 7); `STOP` lists "do"
    twice; the `x-frontdesk-mode` header is never read by the client. AGENTS.md rule 5 says no
    dead code at freeze. No `console.log` and no em dashes anywhere in the lane A scope.
    Fix: delete or wire each one.

13. Corpus loader depends on `process.cwd()` at request time (`lib/ai/corpus.ts:16,49-57`).
    Fine for `pnpm dev`, which is the judging environment, but a Vercel deploy would need
    `outputFileTracingIncludes` for `data/corpus/**` or the route 500s. Note only.

14. `stopWhen: isStepCount(4)` with four tools and a two-sentence rule (`app/api/chat/route.ts:85`).
    A turn that calls checkEligibility, recommendProducts, showResources, and startApplication in
    sequence uses all four steps and ends without closing text. Acceptable; bump to 5 if live
    turns end abruptly.

## What is good

- The AI SDK v7 usage matches the installed types: `instructions`, `convertToModelMessages`
  (awaited), `isStepCount`, `toUIMessageStream({ stream: result.stream, onEnd })`,
  `writer.setOutcome`, `createUIMessageStreamResponse`, `tool({ inputSchema, execute })` with
  zod 4, and `sendMessage(..., { body })` merging `context` and `personaId` at the top level of
  the JSON (confirmed by curl and by the server reading `body.context`).
- `scripted-stream.ts` emits the exact chunk sequence a live turn produces, so scripted and live
  turns render through the same `tool-${name}` parts; the client narrows on `output-available`.
- All four persona scripts validate: every product card matches products.json field for field,
  every resource URL is in the corpus, every eligibility result and prefill has the right shape,
  and each persona's `startApplication` appears exactly once in its script.
- Hallucination posture is right where it matters: products, resources, eligibility, and the
  prefill are all data-derived; the model only writes reason lines and notes. Prompt rules cover
  no sensitive questions, no rates outside the data, offer once, no disparaging the old bank.
- Eligibility rules are compact and correct: under-13 and under-18 branch, SSN, ITIN, foreign
  status, branch assist, business documents appended, affiliation matched against the list with
  the ACC route as the default.
- i18n plumbing works end to end: the persona context sets the language, the header switch
  changes it, quick replies switch sets, and the system prompt names the language on every
  request.
- The Continue card writes a complete prefill that lane B reads; the conversation collects no
  sensitive data by design.
- Every card carries a visible ufcu.org source link that opens in a new tab.
- Files are small (largest lane A source is 111 lines), tsc and eslint are clean.
