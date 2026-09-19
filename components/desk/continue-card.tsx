"use client";
// The offer, made once. The persistent place to continue is the "Your Visit So Far" panel,
// which also writes the prefill, so this card never has to nag or repeat itself.
// Same compact teal shape as the panel: one heading, one pill, no receipt.
import Link from "next/link";
import { useDeskT } from "@/components/desk/strings";

export function ContinueCard() {
  const t = useDeskT();

  return (
    <article className="promo-teal flex flex-col gap-3" style={{ padding: "1.25rem", borderRadius: "12px" }}>
      <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700, color: "#fff" }}>
        {t("desk.ready")}
      </h3>
      <Link
        href="/apply"
        className="btn btn-white w-full justify-center text-center"
        style={{ color: "var(--ufcu-cta)" }}
      >
        {t("desk.continue")}
      </Link>
    </article>
  );
}
