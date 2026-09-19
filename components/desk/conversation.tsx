"use client";
// The Front Desk conversation. The persona context rides along on every request, so the
// assistant answers in the right language for the right person even after the header switch.
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePersona } from "@/lib/context";
import { useT } from "@/lib/i18n";
import { getPersona } from "@/lib/ai/personas";
import { AssistantTurn } from "@/components/desk/assistant-turn";
import { Composer } from "@/components/desk/composer";
import { QuickReplies } from "@/components/desk/quick-replies";
import type { PersonaContext } from "@/lib/types";

export function Conversation() {
  const t = useT();
  const { context, setContext } = usePersona();
  const params = useSearchParams();
  const urlPersona = params.get("persona");

  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";

  const send = useCallback(
    (text: string, override?: PersonaContext) => {
      const ctx = override ?? context;
      sendMessage({ text }, { body: { context: ctx, personaId: ctx.personaId } });
    },
    [context, sendMessage],
  );

  // Persona auto-start: queue the first turn, then send it once the chat is live. Sending directly
  // inside the mount effect is dropped under React strict mode (the first Chat instance is discarded).
  const started = useRef(false);
  const [pending, setPending] = useState<{ text: string; ctx: PersonaContext } | null>(null);
  useEffect(() => {
    if (started.current) return;
    const persona = getPersona(urlPersona);
    if (!persona) return;
    started.current = true;
    setContext(persona.context);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPending({ text: persona.turns[0].user, ctx: persona.context });
  }, [urlPersona, setContext]);
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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-6 pb-4">
        {messages.length === 0 && (
          <p className="max-w-prose rounded-2xl rounded-tl-sm bg-ufcu-secondary-subtle px-4 py-3 leading-relaxed text-ufcu-primary">
            {t("desk.greeting")}
          </p>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <p key={message.id} className="ml-auto max-w-prose rounded-2xl rounded-br-sm bg-ufcu-primary px-4 py-3 text-white">
              {message.parts.map((part) => (part.type === "text" ? part.text : "")).join("")}
            </p>
          ) : (
            <AssistantTurn key={message.id} parts={message.parts} />
          ),
        )}

        {busy && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            ...
          </p>
        )}
        <div ref={bottom} />
      </div>

      <div className="sticky bottom-0 space-y-3 border-t border-ufcu-primary-subtle bg-background pb-4 pt-3">
        {messages.length > 0 && (
          <QuickReplies lang={context.lang} audience={context.audience} disabled={busy} onPick={(text) => send(text)} />
        )}
        <Composer busy={busy} onSend={(text) => send(text)} />
      </div>
    </div>
  );
}
