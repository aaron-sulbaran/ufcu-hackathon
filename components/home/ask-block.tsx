"use client";
// The second way in, right under the sentence: three starter questions for whoever the person
// said they are, then a one-line composer. Both save the sentence's choices and hand the desk
// the question in the URL, so the landing is the start of the conversation, not a gate in front
// of it. The pills come from the desk's own set, so the landing and the desk ask the same things.
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { QuickReplies } from "@/components/desk/quick-replies";
import { usePersona } from "@/lib/context";
import { useHomeT } from "@/components/home/strings";
import type { Audience, Goal } from "@/lib/types";

export function AskBlock({ audience, goal }: { audience: Audience; goal: Goal }) {
  const { context, setContext } = usePersona();
  const router = useRouter();
  const t = useHomeT();
  const [value, setValue] = useState("");

  // A question from the landing carries the sentence with it, and drops any persona left over
  // from a scripted run so the desk answers this person, not the last demo.
  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    setContext({ audience, goal, personaId: undefined });
    router.push(`/desk?q=${encodeURIComponent(text)}`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(value);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-ufcu-navy">{t("landing.orAsk")}</p>
      <QuickReplies lang={context.lang} audience={audience} onPick={ask} />
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="landing-ask">
          {t("landing.ask.placeholder")}
        </label>
        <input
          id="landing-ask"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("landing.ask.placeholder")}
          autoComplete="off"
          className="input-ufcu min-w-0 sm:flex-1"
          style={{ width: "100%" }}
        />
        <button type="submit" disabled={value.trim().length === 0} className="btn btn-cta w-full sm:w-auto">
          {t("landing.ask")}
        </button>
      </form>
    </div>
  );
}
