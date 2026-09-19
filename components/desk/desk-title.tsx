"use client";
// The one line under the page band. The band itself carries the "Front Desk" title, so this
// stays a quiet tagline. Client-side because the copy follows the language switch in the header.
import { useT } from "@/lib/i18n";

export function DeskTitle() {
  const t = useT();
  return <p className="py-4 text-sm text-ufcu-muted">{t("app.tagline")}</p>;
}
