"use client";
// Landing hero in the site's own voice: a lowercase headline with the orange "u" wink,
// an Inter sub in ink, then a Title Case h2 over the persona sentence.
import { useT } from "@/lib/i18n";
import { PersonaSentence } from "@/components/home/persona-sentence";

// The site paints only the trailing standalone "u" orange. Every other language keeps a
// plain headline, so the split runs only when the string actually ends in " u".
export function splitTrailingU(text: string): [string, string] {
  return text.endsWith(" u") ? [text.slice(0, -1), "u"] : [text, ""];
}

export function Hero() {
  const t = useT();
  const [head, wink] = splitTrailingU(t("landing.headline"));

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1>
          {head}
          {wink && <span className="u">{wink}</span>}
        </h1>
        <p className="max-w-xl text-ufcu-ink">{t("landing.sub")}</p>
      </div>

      <div className="space-y-5">
        <h2>{t("landing.h2")}</h2>
        <PersonaSentence />
      </div>
    </section>
  );
}
