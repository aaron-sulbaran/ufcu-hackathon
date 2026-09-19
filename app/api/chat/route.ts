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
import { buildTools, recommendedProducts } from "@/lib/ai/tools";
import { systemPrompt } from "@/lib/ai/prompt";
import { getPersona, nextScriptedTurn } from "@/lib/ai/personas";
import { scriptedStream, type ScriptedPayload } from "@/lib/ai/scripted-stream";
import type { PersonaContext } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const DEFAULT_CONTEXT: PersonaContext = { audience: "other", goal: "unsure", lang: "en" };

interface ChatBody {
  messages: UIMessage[];
  context?: PersonaContext;
  personaId?: string;
}

function countUserTurns(messages: UIMessage[]): number {
  return messages.filter((m) => m.role === "user").length;
}

function fallbackPayload(context: PersonaContext, personaId: string | undefined, turnIndex: number): ScriptedPayload {
  const turn = nextScriptedTurn(personaId, turnIndex);
  if (turn) return { text: turn.assistant.text, tools: turn.assistant.tools ?? [] };

  const persona = getPersona(personaId);
  if (persona) {
    const last = persona.turns[persona.turns.length - 1];
    return { text: last.assistant.text, tools: last.assistant.tools ?? [] };
  }

  return {
    text: "I'm in scripted mode right now, so I'm working from what I already know about UFCU. Here is what usually fits.",
    tools: [
      {
        name: "recommendProducts",
        result: recommendedProducts(
          [
            { id: "savings", reason: "Your membership account. Every UFCU relationship opens with it, for $1." },
            { id: "simply-u", reason: "No monthly fee, no minimum balance, and no overdraft fees." },
          ],
          context,
        ),
      },
    ],
  };
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatBody;
  const messages = body.messages ?? [];
  const context = body.context ?? DEFAULT_CONTEXT;
  const personaId = body.personaId ?? context.personaId;
  const turnIndex = Math.max(0, countUserTurns(messages) - 1);

  const forcedOffline = process.env.FRONT_DESK_OFFLINE === "1" || !process.env.ANTHROPIC_API_KEY;

  if (forcedOffline) {
    return createUIMessageStreamResponse({
      stream: scriptedStream(fallbackPayload(context, personaId, turnIndex)),
      headers: { "x-frontdesk-mode": "scripted" },
    });
  }

  try {
    const result = streamText({
      model: anthropic(process.env.FRONT_DESK_MODEL ?? DEFAULT_MODEL),
      instructions: systemPrompt(context),
      messages: await convertToModelMessages(messages),
      stopWhen: isStepCount(4),
      tools: buildTools(context),
    });

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.merge(
          toUIMessageStream({
            stream: result.stream,
            onEnd: ({ outcome }) => writer.setOutcome(outcome),
          }),
        );
      },
    });

    return createUIMessageStreamResponse({ stream, headers: { "x-frontdesk-mode": "live" } });
  } catch {
    return createUIMessageStreamResponse({
      stream: scriptedStream(fallbackPayload(context, personaId, turnIndex)),
      headers: { "x-frontdesk-mode": "scripted" },
    });
  }
}
