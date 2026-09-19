// POST /api/chat
// Body: { messages: UIMessage[]; context: PersonaContext; personaId?: string }
// Returns an AI SDK UI message stream. Live turns come from Claude; scripted turns come from
// data/personas.json when the model is unavailable, and render through the same cards.
import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { buildTools, resourcesFor, suggestedFor } from "@/lib/ai/tools";
import { systemPrompt } from "@/lib/ai/prompt";
import { isScriptedLine, nextScriptedTurn } from "@/lib/ai/personas";
import { t } from "@/lib/i18n-core";
import { scriptedChunks, scriptedStream, type ScriptedPayload } from "@/lib/ai/scripted-stream";
import type { PersonaContext } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const DEFAULT_MODEL = "claude-haiku-4-5";
const DEFAULT_CONTEXT: PersonaContext = { audience: "other", goal: "unsure", lang: "en" };

interface ChatBody {
  messages: UIMessage[];
  context?: PersonaContext;
  personaId?: string;
}

interface LoosePart {
  type: string;
  text?: string;
}

function messageText(message: UIMessage): string {
  return (message.parts as LoosePart[])
    .map((p) => (p.type === "text" && typeof p.text === "string" ? p.text : ""))
    .join(" ")
    .trim();
}

function lastUserText(messages: UIMessage[]): string {
  const users = messages.filter((m) => m.role === "user");
  const last = users[users.length - 1];
  return last ? messageText(last) : "";
}

// The offer is made once. If any earlier assistant turn already carried it, it never returns.
function alreadyOffered(messages: UIMessage[]): boolean {
  return messages.some(
    (m) => m.role === "assistant" && (m.parts as LoosePart[]).some((p) => p.type === "tool-startApplication"),
  );
}

// Scripted answers follow the script only while the person is on it. Off-script questions get a
// short line plus the ufcu.org pages that match, so the demo never replays the last turn.
function fallbackPayload(
  context: PersonaContext,
  personaId: string | undefined,
  messages: UIMessage[],
): ScriptedPayload {
  const asked = lastUserText(messages);
  const turnIndex = Math.max(0, messages.filter((m) => m.role === "user").length - 1);
  const turn = nextScriptedTurn(personaId, turnIndex, context.lang);

  if (personaId && turn && isScriptedLine(personaId, turnIndex, asked)) {
    const tools = (turn.assistant.tools ?? []).filter(
      (call) => call.name !== "startApplication" || !alreadyOffered(messages),
    );
    return { text: turn.assistant.text, tools, source: { personaId, turn: turnIndex } };
  }

  const resources = resourcesFor(asked, context);

  // First turn with no script to follow: open with a bundle, the way a persona turn does.
  if (turnIndex === 0) {
    return {
      text: t(context.lang, "desk.scripted.intro"),
      source: { textKey: "desk.scripted.intro" },
      tools: [
        { name: "recommendProducts", result: suggestedFor(context) },
        { name: "showResources", result: resources },
      ],
    };
  }

  if (resources.length > 0) {
    return {
      text: t(context.lang, "desk.scripted.help"),
      source: { textKey: "desk.scripted.help" },
      tools: [{ name: "showResources", result: resources }],
    };
  }
  return {
    text: t(context.lang, "desk.scripted.intro"),
    source: { textKey: "desk.scripted.intro" },
    tools: [{ name: "recommendProducts", result: suggestedFor(context) }],
  };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ChatBody | null;
  if (!body || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: "messages array required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const messages = body.messages;
  const context: PersonaContext = { ...DEFAULT_CONTEXT, ...(body.context ?? {}) };
  const personaId = body.personaId ?? context.personaId;

  const forcedOffline = process.env.FRONT_DESK_OFFLINE === "1" || !process.env.ANTHROPIC_API_KEY;

  if (forcedOffline) {
    return createUIMessageStreamResponse({
      stream: scriptedStream(fallbackPayload(context, personaId, messages)),
      headers: { "x-frontdesk-mode": "scripted" },
    });
  }

  // Persona chips follow the script even when the model is available, so the demo is repeatable
  // and instant. Anything typed off-script goes to the model.
  const userCount = messages.filter((m) => m.role === "user").length;
  if (isScriptedLine(personaId, Math.max(0, userCount - 1), lastUserText(messages))) {
    return createUIMessageStreamResponse({
      stream: scriptedStream(fallbackPayload(context, personaId, messages)),
      headers: { "x-frontdesk-mode": "scripted" },
    });
  }

  const result = streamText({
    model: anthropic(process.env.FRONT_DESK_MODEL ?? DEFAULT_MODEL),
    instructions: systemPrompt(context),
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(4),
    tools: buildTools(context),
  });

  // streamText reports a bad key, a bad model id, or a dropped connection as an error chunk
  // rather than a thrown error, so the fallback lives in the reader loop, not in a catch.
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const reader = toUIMessageStream({
        stream: result.stream,
        onEnd: ({ outcome }) => writer.setOutcome(outcome),
      }).getReader();
      let wroteStart = false;
      let wroteStep = false;
      let delivered = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) return;
        if (value.type === "error") {
          if (delivered) continue;
          if (!wroteStart) writer.write({ type: "start" });
          if (!wroteStep) writer.write({ type: "start-step" });
          for (const chunk of scriptedChunks(fallbackPayload(context, personaId, messages), false)) {
            writer.write(chunk);
          }
          writer.write({ type: "finish-step" });
          writer.write({ type: "finish" });
          return;
        }
        if (value.type === "start") wroteStart = true;
        if (value.type === "start-step") wroteStep = true;
        if (value.type === "text-delta" || value.type.startsWith("tool-")) delivered = true;
        writer.write(value);
      }
    },
  });

  return createUIMessageStreamResponse({ stream, headers: { "x-frontdesk-mode": "live" } });
}
