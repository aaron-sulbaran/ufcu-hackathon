"use client";
// Stage 1 of identity verification: the check that runs on the details already on file, before
// anyone is asked for a photo. The member sees one progress line while it runs, then one outcome
// card (components/apply/outcome-card.tsx); the per-check detail is demo material and lives behind
// the disclosure at the bottom of the step. MOCK: nothing is queried anywhere; the outcome is rule
// based (lib/apply/mock-verify.ts) so the demo runs the same way every time.
import { Loader2 } from "lucide-react";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { useApplyT } from "@/lib/apply/strings";

export function StageOnePanel() {
  const t = useApplyT();
  return (
    <div className="card-ufcu flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-xl font-semibold text-ufcu-navy">{t("apply.stage1.title")}</h3>
        <SimulatedBadge />
      </div>
      <p className="flex items-center gap-2 text-ufcu-ink" aria-live="polite">
        <Loader2 className="size-4 shrink-0 animate-spin text-ufcu-navy" aria-hidden />
        {t("apply.stage1.progress")}
      </p>
    </div>
  );
}
