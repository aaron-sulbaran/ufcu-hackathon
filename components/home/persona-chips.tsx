"use client";
// Four demo personas. Each chip preloads a full context and jumps straight into the conversation.
import { useRouter } from "next/navigation";
import { usePersona } from "@/lib/context";
import { useT } from "@/lib/i18n";
import type { Audience, Goal, Lang } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface Chip {
  id: string;
  nameKey: string;
  blurbKey: string;
  audience: Audience;
  goal: Goal;
  lang: Lang;
}

const CHIPS: Chip[] = [
  { id: "maya", nameKey: "chip.maya.name", blurbKey: "chip.maya.blurb", audience: "student", goal: "build_credit", lang: "en" },
  { id: "joon", nameKey: "chip.joon.name", blurbKey: "chip.joon.blurb", audience: "international_student", goal: "checking", lang: "ko" },
  { id: "daniela", nameKey: "chip.daniela.name", blurbKey: "chip.daniela.blurb", audience: "business", goal: "checking", lang: "es" },
  { id: "robert", nameKey: "chip.robert.name", blurbKey: "chip.robert.blurb", audience: "switching_banks", goal: "unsure", lang: "en" },
];

export function PersonaChips() {
  const { setContext } = usePersona();
  const router = useRouter();
  const t = useT();

  const choose = (chip: Chip) => {
    setContext({ audience: chip.audience, goal: chip.goal, lang: chip.lang, personaId: chip.id });
    router.push(`/desk?persona=${chip.id}`);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-ufcu-primary">{t("landing.try")}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CHIPS.map((chip) => (
          <button key={chip.id} type="button" onClick={() => choose(chip)} className="text-left">
            <Card className="h-full ring-ufcu-primary-subtle transition-colors hover:ring-ufcu-secondary">
              <CardContent className="space-y-1">
                <p className="font-heading text-base text-ufcu-primary">{t(chip.nameKey)}</p>
                <p className="text-sm text-muted-foreground">{t(chip.blurbKey)}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
