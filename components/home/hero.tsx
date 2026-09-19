"use client";
// Landing hero in the site's own voice: a headline with an orange wink word (*U*, *ti*,
// *vous*, *você*, *당신*), an Inter sub in ink, then a Title Case h2 over the persona sentence.
import { useT } from "@/lib/i18n";
import { PersonaSentence } from "@/components/home/persona-sentence";

// Translators wrap the wink in *asterisks* so it can sit anywhere in the sentence.
// English without a marker still paints a trailing standalone "u"/"U".
export function splitWink(text: string): [string, string, string] {
  const start = text.indexOf("*");
  const end = text.lastIndexOf("*");
  if (start !== -1 && end !== start) {
    return [text.slice(0, start), text.slice(start + 1, end), text.slice(end + 1)];
  }
  return / u$/i.test(text) ? [text.slice(0, -1), text.slice(-1), ""] : [text, "", ""];
}

export function Hero() {
  const t = useT();
  const [head, wink, tail] = splitWink(t("landing.headline"));

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1>
          {head}
          {wink && <span className="u">{wink}</span>}
          {tail}
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
