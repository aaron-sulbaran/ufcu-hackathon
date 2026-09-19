// Builds a UI message stream by hand so a scripted turn reaches the client in exactly the
// shape a live turn does: one text part, then tool parts with their outputs.
import { createUIMessageStream, type UIMessageChunk } from "ai";
import type { ToolName } from "@/lib/types";

export interface ScriptedPayload {
  text: string;
  tools: { name: ToolName | string; result: unknown }[];
}

// `frame` writes the start and finish chunks. A live turn that failed mid-stream has already
// sent its own start, so the fallback there asks for the body only.
export function scriptedChunks(payload: ScriptedPayload, frame = true): UIMessageChunk[] {
  const chunks: UIMessageChunk[] = [];
  if (frame) {
    chunks.push({ type: "start" });
    chunks.push({ type: "start-step" });
  }
  chunks.push({ type: "data-mode", id: "mode", data: { mode: "scripted" } });

  const textId = "scripted-text";
  chunks.push({ type: "text-start", id: textId });
  chunks.push({ type: "text-delta", id: textId, delta: payload.text });
  chunks.push({ type: "text-end", id: textId });

  payload.tools.forEach((call, i) => {
    const toolCallId = `scripted-tool-${i}`;
    chunks.push({ type: "tool-input-available", toolCallId, toolName: call.name, input: {} });
    chunks.push({ type: "tool-output-available", toolCallId, output: call.result });
  });

  if (frame) {
    chunks.push({ type: "finish-step" });
    chunks.push({ type: "finish" });
  }
  return chunks;
}

export function scriptedStream(payload: ScriptedPayload) {
  return createUIMessageStream({
    execute: ({ writer }) => {
      for (const chunk of scriptedChunks(payload)) writer.write(chunk);
    },
  });
}
