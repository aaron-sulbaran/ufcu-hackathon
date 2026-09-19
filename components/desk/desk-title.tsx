"use client";
// Page title. Client-side because the copy follows the language switch in the header.
import { useT } from "@/lib/i18n";

export function DeskTitle() {
  const t = useT();
  return (
    <div className="space-y-1 py-5">
      <h1 className="font-heading text-3xl leading-tight text-ufcu-primary sm:text-4xl">
        {t("landing.headline")}
      </h1>
      <p className="text-sm text-muted-foreground">{t("app.tagline")}</p>
    </div>
  );
}
