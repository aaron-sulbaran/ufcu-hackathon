"use client";
// The persona sentence: "I am [audience] and I want [goal]." Saves the choice and starts the chat.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePersona } from "@/lib/context";
import { useT } from "@/lib/i18n";
import type { Audience, Goal } from "@/lib/types";
import { Button } from "@/components/ui/button";

const AUDIENCES: Audience[] = [
  "student",
  "international_student",
  "new_to_austin",
  "switching_banks",
  "business",
  "retiree",
  "other",
];
const GOALS: Goal[] = ["checking", "savings", "build_credit", "credit_card", "loan", "unsure"];

const selectClass =
  "mx-1 rounded-md border border-ufcu-primary-subtle bg-white px-2 py-1 font-heading text-2xl text-ufcu-primary underline decoration-ufcu-accent decoration-2 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ufcu-secondary sm:text-3xl";

export function PersonaSentence() {
  const { setContext } = usePersona();
  const router = useRouter();
  const t = useT();
  const [audience, setAudience] = useState<Audience>("student");
  const [goal, setGoal] = useState<Goal>("checking");

  const start = () => {
    setContext({ audience, goal });
    router.push("/desk");
  };

  return (
    <div className="space-y-6">
      <p className="flex flex-wrap items-center gap-y-2 font-heading text-2xl text-ufcu-primary sm:text-3xl">
        <span>{t("landing.iam")}</span>
        <select
          className={selectClass}
          value={audience}
          onChange={(e) => setAudience(e.target.value as Audience)}
          aria-label={t("landing.iam")}
        >
          {AUDIENCES.map((a) => (
            <option key={a} value={a}>
              {t(`audience.${a}`)}
            </option>
          ))}
        </select>
        <span>{t("landing.iwant")}</span>
        <select
          className={selectClass}
          value={goal}
          onChange={(e) => setGoal(e.target.value as Goal)}
          aria-label={t("landing.iwant")}
        >
          {GOALS.map((g) => (
            <option key={g} value={g}>
              {t(`goal.${g}`)}
            </option>
          ))}
        </select>
      </p>
      <Button
        type="button"
        onClick={start}
        className="h-11 bg-ufcu-secondary-darker px-6 text-base text-white hover:opacity-90"
      >
        {t("landing.start")}
      </Button>
    </div>
  );
}
