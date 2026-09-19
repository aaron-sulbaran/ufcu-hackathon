"use client";
// The Front Desk. Left: what the visit has collected so far. Right: the conversation, which
// reads as notes from a person at a desk, not as a chat thread. The persona context rides
// along on every request, so the desk answers in the right language for the right person.
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePersona } from "@/lib/context";
import { getPersona } from "@/lib/ai/personas";
import { AssistantTurn, DeskNote } from "@/components/desk/assistant-turn";
import { Composer } from "@/components/desk/composer";
import { QuickReplies } from "@/components/desk/quick-replies";
import { VisitPanel } from "@/components/desk/visit-panel";
import { collectVisit } from "@/components/desk/tool-output";
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

  const send = useCallback(
    (text: string, override?: PersonaContext) => {
      const ctx = override ?? context;
      sendMessage({ text }, { body: { context: ctx, personaId: ctx.personaId } });
    },
    [context, sendMessage],
  );

  // The stored context hydrates in a parent effect, which runs after this one, so the opening
  // decision waits a tick. Persona chips do not wait: their context comes from the URL.
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
    if (started.current) return;
    const persona = getPersona(urlPersona);
    if (persona) {
      started.current = true;
      setContext(persona.context);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPending({ text: persona.turns[0].user, ctx: persona.context });
      return;
    }
    if (!armed) return;
    started.current = true;
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

  const visit = collectVisit<ProductCard[], EligibilityResult, ApplicationPrefill>(messages);
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const showReplies = !busy && (messages.length === 0 || lastAssistant !== undefined);

  return (
    <div className="flex flex-col gap-6 pb-4 md:flex-row md:items-start md:gap-8">
      <VisitPanel context={context} visit={visit} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-8 pb-4">
          {messages.length === 0 && !pending && <DeskNote text={t("desk.greeting")} />}

          {messages.map((message) =>
            message.role === "user" ? (
              <p key={message.id} className="max-w-prose pl-4 text-right italic leading-relaxed text-muted-foreground sm:ml-auto">
                {message.parts.map((part) => (part.type === "text" ? part.text : "")).join("")}
              </p>
            ) : (
              <AssistantTurn key={message.id} parts={message.parts} />
            ),
          )}

          {busy && (
            <p className="pl-4 text-sm text-muted-foreground" aria-live="polite">
              ...
            </p>
          )}

          {error && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-ufcu-primary-subtle bg-white px-4 py-3 text-sm text-ufcu-primary">
              <span>{t("desk.error")}</span>
              <button
                type="button"
                onClick={() => regenerate()}
                className="rounded-lg bg-ufcu-secondary-darker px-3 py-1.5 font-semibold text-white"
              >
                {t("desk.retry")}
              </button>
            </div>
          )}

          {showReplies && (
            <QuickReplies lang={context.lang} audience={context.audience} disabled={busy} onPick={(text) => send(text)} />
          )}
          <div ref={bottom} />
        </div>

        <div className="sticky bottom-0 border-t border-ufcu-primary-subtle bg-background pb-4 pt-3">
          <Composer busy={busy} onSend={(text) => send(text)} />
        </div>
      </div>
    </div>
  );
}
