"use client";
// The Front Desk. Left: what the visit has collected so far. Right: the conversation, which
// reads as notes from a person at a desk, not as a chat thread. The persona context rides
// along on every request, so the desk answers in the right language for the right person.
// The selected language always wins: a persona plays in it, and scripted turns redraw when it changes.
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePersona } from "@/lib/context";
import { getPersona, scriptedLine } from "@/lib/ai/personas";
import { defaultPathFor } from "@/lib/ai/eligibility";
import { savePrefill } from "@/lib/apply/prefill";
import { AssistantTurn, DeskNote } from "@/components/desk/assistant-turn";
import { Composer } from "@/components/desk/composer";
import { QuickReplies } from "@/components/desk/quick-replies";
import { VisitPanel } from "@/components/desk/visit-panel";
import { collectRecommended, collectVisit } from "@/components/desk/tool-output";
import { localizeParts, localizeUserText } from "@/components/desk/localize";
import { useDeskT } from "@/components/desk/strings";
import type { ApplicationPrefill, Audience, EligibilityResult, Goal, PersonaContext, ProductCard } from "@/lib/types";

// Becoming a member is one click from any screen, so the desk needs an opinion about the
// accounts before the model has recommended any. Savings is the membership account; the
// checking pick follows the audience, the way a banker would guess and then confirm.
function startingProducts(audience: Audience): string[] {
  const checking = audience === "student" || audience === "international_student" ? "simply-u" : "free-checking";
  const products = ["savings", checking];
  if (audience === "business") products.push("business-checking");
  return products;
}

// What clicking "Open" on a card says the person is after, so the context remembers it even
// if the landing dropdown said something else.
function goalForProduct(product: ProductCard): Goal {
  if (product.id === "credit-builder") return "build_credit";
  switch (product.kind) {
    case "checking":
    case "business":
      return "checking";
    case "savings":
    case "money_market":
    case "certificate":
      return "savings";
    case "credit_card":
      return "credit_card";
    default:
      return "loan";
  }
}

export function Conversation() {
  const t = useDeskT();
  const { context, setContext, setGoal } = usePersona();
  const router = useRouter();
  const params = useSearchParams();
  const urlPersona = params.get("persona");
  // The landing search box hands its sentence over as /desk?q=..., which the desk says out loud
  // as the person's first turn. A persona chip outranks it: that run is a scripted demo.
  const urlQuery = params.get("q")?.trim() || null;

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
    // Arrived from the landing search box: send what they typed, once, as their own words, and
    // drop any persona from a previous run so the desk does not answer as someone else.
    if (urlQuery) {
      if (context.personaId) setContext({ personaId: undefined });
      setPending({ text: urlQuery, ctx: { ...context, personaId: undefined } });
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
  }, [urlPersona, urlQuery, armed, context, setContext, t]);

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
  const recommended = collectRecommended<ProductCard>(shown);
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const showReplies = !busy && (messages.length === 0 || lastAssistant !== undefined);

  // The handoff is built here, from the cards on screen, as soon as there is a recommendation.
  // A real startApplication result later refines it; it never takes away what someone clicked.
  const served = visit.prefill;
  const askedPath = visit.eligibility?.path;
  const prefill = useMemo<ApplicationPrefill | null>(() => {
    if (recommended.length === 0) return served ?? null;
    const ids = ["savings", ...recommended.map((p) => p.id).filter((id) => id !== "savings")];
    const products = served ? [...ids, ...served.products.filter((id) => !ids.includes(id))] : ids;
    const productReasons: Record<string, string> = {};
    for (const product of recommended) {
      if (products.includes(product.id) && product.reason) productReasons[product.id] = product.reason;
    }
    return {
      context,
      path: served?.path ?? askedPath ?? defaultPathFor(context.audience),
      products,
      firstName: served?.firstName,
      preferredName: served?.preferredName,
      email: served?.email,
      schoolAffiliation: served?.schoolAffiliation,
      notes: served?.notes ?? [],
      productReasons: { ...productReasons, ...served?.productReasons },
    };
  }, [recommended, served, askedPath, context]);

  // Once a handoff has been written the desk stops rewriting it: the click said which account,
  // and a re-render on the way to /apply must not widen it back to the whole recommendation.
  const handedOff = useRef(false);

  // Written on every change so the Secure Zone always reads the accounts now on screen.
  const prefillKey = prefill ? JSON.stringify(prefill) : null;
  useEffect(() => {
    if (handedOff.current) return;
    if (prefillKey) savePrefill(JSON.parse(prefillKey) as ApplicationPrefill);
  }, [prefillKey]);

  // "Become a member" before anything has been recommended: save the starting bundle, then go.
  const becomeMember = useCallback(() => {
    handedOff.current = true;
    savePrefill(
      prefill ?? {
        context,
        path: defaultPathFor(context.audience),
        products: startingProducts(context.audience),
        notes: [],
        productReasons: {},
      },
    );
    router.push("/apply");
  }, [prefill, context, router]);

  // "Open" on a card goes straight to the secure application with that one account plus the
  // savings that carries membership. No bundle to curate, no second screen to agree with.
  const openProduct = useCallback(
    (product: ProductCard) => {
      const goal = goalForProduct(product);
      handedOff.current = true;
      savePrefill({
        context: { ...context, goal },
        path: served?.path ?? askedPath ?? defaultPathFor(context.audience),
        products: product.id === "savings" ? ["savings"] : ["savings", product.id],
        firstName: served?.firstName,
        preferredName: served?.preferredName,
        email: served?.email,
        schoolAffiliation: served?.schoolAffiliation,
        notes: served?.notes ?? [],
        productReasons: product.reason ? { [product.id]: product.reason } : {},
      });
      setGoal(goal);
      router.push("/apply");
    },
    [context, served, askedPath, router, setGoal],
  );

  return (
    <div className="flex flex-col gap-6 pb-4 md:flex-row md:items-start md:gap-8">
      <VisitPanel context={context} visit={{ ...visit, prefill }} onBecome={becomeMember} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-8 pb-4">
          {messages.length === 0 && !pending && <DeskNote text={t("desk.greeting")} />}

          {shown.map((message, index) =>
            message.role === "user" ? (
              // What the person said sits in its own bordered box on the right, so the column
              // reads as a conversation with two sides even though the desk keeps no bubble.
              <div key={message.id} className="flex justify-end">
                <div
                  className="max-w-prose bg-white leading-relaxed text-ufcu-ink"
                  style={{ border: "1px solid var(--ufcu-navy)", borderRadius: "12px", padding: "12px 16px" }}
                  data-testid="user-message"
                >
                  {localizeUserText(
                    message.parts.map((part) => (part.type === "text" ? part.text : "")).join(""),
                    context.personaId,
                    shown.slice(0, index).filter((m) => m.role === "user").length,
                    lang,
                  )}
                </div>
              </div>
            ) : (
              <AssistantTurn
                key={message.id}
                parts={message.parts}
                shownProducts={recommended}
                onOpenProduct={openProduct}
              />
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
            <QuickReplies
              lang={context.lang}
              audience={context.audience}
              disabled={busy}
              lead={scriptLead}
              openLabel={!scriptLead && messages.length > 0 ? t("desk.quick.open") : undefined}
              onOpen={becomeMember}
              onPick={(text) => send(text)}
            />
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
