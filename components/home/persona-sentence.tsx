"use client";
// The persona sentence: "I am [audience] and I want [goal]." Saves the choice and starts the chat.
// Montserrat 600 navy, with the two selects wearing the site's own input recipe.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePersona } from "@/lib/context";
import { useT } from "@/lib/i18n";
import type { Audience, Goal } from "@/lib/types";

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

// .input-ufcu is a full-width field; in the sentence it sits inline and sizes to the chosen option
// (field-sizing), not the longest one, so long translations do not push the sentence apart.
const selectStyle = { width: "auto", maxWidth: "100%", fieldSizing: "content" } as const;

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
      <p className="flex flex-wrap items-center gap-x-2 gap-y-3 font-heading text-[1.5rem] font-semibold leading-snug text-ufcu-navy sm:text-[1.75rem]">
        <span>{t("landing.iam")}</span>
        <select
          className="input-ufcu"
          style={selectStyle}
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
          className="input-ufcu"
          style={selectStyle}
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
      <button type="button" onClick={start} className="btn btn-cta btn-hero">
        {t("landing.start")}
      </button>
    </div>
  );
}
