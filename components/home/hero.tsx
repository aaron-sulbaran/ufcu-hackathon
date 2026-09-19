"use client";
// Headline, accent line, sub, and the persona sentence. The page never asks for identity data here.
import { useT } from "@/lib/i18n";
import { PersonaSentence } from "@/components/home/persona-sentence";

export function Hero() {
  const t = useT();
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-heading text-4xl leading-tight text-ufcu-primary sm:text-5xl">
          {t("landing.headline")}
        </h1>
        <div className="h-1 w-16 bg-ufcu-accent" aria-hidden />
        <p className="max-w-xl text-base text-ufcu-primary/80 sm:text-lg">{t("landing.sub")}</p>
      </div>
      <PersonaSentence />
    </section>
  );
}
