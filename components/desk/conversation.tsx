"use client";
// The Front Desk. Left: what the visit has collected so far. Right: the conversation, which
// reads as notes from a person at a desk, not as a chat thread. The persona context rides
// along on every request, so the desk answers in the right language for the right person.
// The selected language always wins: a persona plays in it, and scripted turns redraw when it changes.
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePersona } from "@/lib/context";
import { getPersona, scriptedLine } from "@/lib/ai/personas";
import { AssistantTurn, DeskNote } from "@/components/desk/assistant-turn";
import { Composer } from "@/components/desk/composer";
import { QuickReplies } from "@/components/desk/quick-replies";
import { VisitPanel } from "@/components/desk/visit-panel";
import { collectVisit } from "@/components/desk/tool-output";
import { localizeParts, localizeUserText } from "@/components/desk/localize";
import { useDeskT } from "@/components/desk/strings";
import type { ApplicationPrefill, EligibilityResult, PersonaContext, ProductCard } from "@/lib/types";

export function Conversation() {
  const t = useDeskT();
  const { context, setContext } = usePersona();
  const params = useSearchParams();
  const urlPersona = params.get("persona");

  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status, error, regenerate } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";
  // When a persona script is active, its next line leads the quick replies so the demo can be tapped through.
  const userCount = messages.filter((m) => m.role === "user").length;
  const scriptLead = scriptedLine(context.personaId, userCount, context.lang);

  const send = useCallback(
    (text: string, override?: PersonaContext) => {
      const ctx = override ?? context;
      sendMessage({ text }, { body: { context: ctx, personaId: ctx.personaId } });
    },
    [context, sendMessage],
  );

  // The stored context hydrates in a parent effect, which runs after this one, so the opening
  // decision waits a tick. Persona chips wait too: the persona sets who, the stored context says which language.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setArmed(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Auto-start: queue the first turn, then send it once the chat is live. Sending directly
  // inside the mount effect is dropped under React strict mode (the first Chat is discarded).
  const started = useRef(false);
  const [pending, setPending] = useState<{ text: string; ctx: PersonaContext } | null>(null);
  useEffect(() => {
    if (started.current || !armed) return;
    started.current = true;
    const persona = getPersona(urlPersona);
    if (persona) {
      const { audience, goal, personaId } = persona.context;
      setContext({ audience, goal, personaId });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPending({
        text: scriptedLine(persona.id, 0, context.lang) ?? persona.turns[0].user,
        ctx: { audience, goal, personaId, lang: context.lang },
      });
      return;
    }
    // Arrived cold: the greeting below is the first turn, and nothing is sent.
    if (context.audience === "other" && context.goal === "unsure") return;
    // Arrived through the landing sentence: say it out loud, and drop any persona from a
    // previous run so the desk does not answer as someone else.
    const ctx: PersonaContext = { ...context, personaId: undefined };
    if (context.personaId) setContext({ personaId: undefined });
    const text =
      context.goal === "unsure"
        ? t("desk.sentence.unsure", { audience: t(`audience.${context.audience}`) })
        : t("desk.sentence", { audience: t(`audience.${context.audience}`), goal: t(`goal.${context.goal}`) });
    setPending({ text, ctx });
  }, [urlPersona, armed, context, setContext, t]);

  useEffect(() => {
    if (!pending || status !== "ready") return;
    const next = pending;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPending(null);
    send(next.text, next.ctx);
  }, [pending, status, send]);

  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, status]);

  const lang = context.lang;
  const shown = useMemo(
    () => messages.map((m) => (m.role === "assistant" ? { ...m, parts: localizeParts(m.parts, lang) } : m)),
    [messages, lang],
  );
  const visit = useMemo(() => collectVisit<ProductCard[], EligibilityResult, ApplicationPrefill>(shown), [shown]);
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const showReplies = !busy && (messages.length === 0 || lastAssistant !== undefined);

  return (
    <div className="flex flex-col gap-6 pb-4 md:flex-row md:items-start md:gap-8">
      <VisitPanel context={context} visit={visit} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-8 pb-4">
          {messages.length === 0 && !pending && <DeskNote text={t("desk.greeting")} />}

          {shown.map((message, index) =>
            message.role === "user" ? (
              <p key={message.id} className="max-w-prose pl-4 text-right leading-relaxed text-ufcu-ink/90 sm:ml-auto">
                {localizeUserText(
                  message.parts.map((part) => (part.type === "text" ? part.text : "")).join(""),
                  context.personaId,
                  shown.slice(0, index).filter((m) => m.role === "user").length,
                  lang,
                )}
              </p>
            ) : (
              <AssistantTurn key={message.id} parts={message.parts} />
            ),
          )}

          {busy && (
            <p className="pl-4 text-sm text-ufcu-muted" aria-live="polite">
              ...
            </p>
          )}

          {error && (
            <div className="card-ufcu flex flex-wrap items-center gap-3 px-4 py-3 text-sm text-ufcu-ink">
              <span>{t("desk.error")}</span>
              <button
                type="button"
                onClick={() => regenerate()}
                className="btn btn-cta"
              >
                {t("desk.retry")}
              </button>
            </div>
          )}

          {showReplies && (
            <QuickReplies lang={context.lang} audience={context.audience} disabled={busy} lead={scriptLead} onPick={(text) => send(text)} />
          )}
          <div ref={bottom} />
        </div>

        <div className="sticky bottom-0 border-t border-ufcu-gray-line bg-background pb-4 pt-3">
          <Composer busy={busy} onSend={(text) => send(text)} />
        </div>
      </div>
    </div>
  );
}
