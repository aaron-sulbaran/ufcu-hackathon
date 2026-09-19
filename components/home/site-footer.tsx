"use client";
// Contact line plus the required NCUA disclosure.
import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-ufcu-primary-subtle bg-muted/50">
      <div className="mx-auto max-w-5xl space-y-1 px-4 py-6 text-sm text-ufcu-primary">
        <p>
          {t("common.call")} | {t("common.branch")}
        </p>
        <p className="text-muted-foreground">{t("common.ncua")}</p>
      </div>
    </footer>
  );
}
