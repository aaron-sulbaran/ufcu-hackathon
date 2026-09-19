// Builds a UI message stream by hand so a scripted turn reaches the client in exactly the
// shape a live turn does: one text part, then tool parts with their outputs.
import { createUIMessageStream } from "ai";
import type { ToolName } from "@/lib/types";

export interface ScriptedPayload {
  text: string;
  tools: { name: ToolName | string; result: unknown }[];
}

export function scriptedStream(payload: ScriptedPayload) {
  return createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "start-step" });
      writer.write({ type: "data-mode", id: "mode", data: { mode: "scripted" } });

      const textId = "scripted-text";
      writer.write({ type: "text-start", id: textId });
      writer.write({ type: "text-delta", id: textId, delta: payload.text });
      writer.write({ type: "text-end", id: textId });

      payload.tools.forEach((call, i) => {
        const toolCallId = `scripted-tool-${i}`;
        writer.write({ type: "tool-input-available", toolCallId, toolName: call.name, input: {} });
        writer.write({ type: "tool-output-available", toolCallId, output: call.result });
      });

      writer.write({ type: "finish-step" });
      writer.write({ type: "finish" });
    },
  });
}
