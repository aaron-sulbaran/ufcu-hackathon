"use client";
// Four demo personas. Each chip preloads who the person is and jumps straight into the conversation,
// in whatever language is already selected.
// White site cards, Montserrat name, Inter blurb, a teal "Try it" line at the foot.
import { useRouter } from "next/navigation";
import { usePersona } from "@/lib/context";
import { useT } from "@/lib/i18n";
import type { Audience, Goal } from "@/lib/types";

interface Chip {
  id: string;
  nameKey: string;
  blurbKey: string;
  audience: Audience;
  goal: Goal;
}

const CHIPS: Chip[] = [
  { id: "maya", nameKey: "chip.maya.name", blurbKey: "chip.maya.blurb", audience: "student", goal: "build_credit" },
  { id: "joon", nameKey: "chip.joon.name", blurbKey: "chip.joon.blurb", audience: "international_student", goal: "checking" },
  { id: "daniela", nameKey: "chip.daniela.name", blurbKey: "chip.daniela.blurb", audience: "business", goal: "checking" },
  { id: "robert", nameKey: "chip.robert.name", blurbKey: "chip.robert.blurb", audience: "switching_banks", goal: "unsure" },
];

export function PersonaChips() {
  const { setContext } = usePersona();
  const router = useRouter();
  const t = useT();

  const choose = (chip: Chip) => {
    setContext({ audience: chip.audience, goal: chip.goal, personaId: chip.id });
    router.push(`/desk?persona=${chip.id}`);
  };

  return (
    <div className="space-y-4">
      <p className="font-semibold text-ufcu-navy">{t("landing.try")}</p>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => choose(chip)}
            className="card-ufcu flex h-full flex-col gap-2 p-5 text-left transition-shadow hover:shadow-ufcu"
          >
            <span className="font-heading text-[1.125rem] font-bold leading-snug text-ufcu-navy">
              {t(chip.nameKey)}
            </span>
            <span className="text-sm leading-snug text-ufcu-ink">{t(chip.blurbKey)}</span>
            <span className="mt-auto pt-2 text-sm font-semibold text-ufcu-link">{t("landing.tryIt")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
