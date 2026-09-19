"use client";
// Stage 1 of identity verification: the check that runs on the details already on file, before
// anyone is asked for a photo. MOCK: nothing is queried anywhere; the outcome is rule based
// (lib/apply/mock-verify.ts) so the demo runs the same way every time.
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { useApplyT } from "@/lib/apply/strings";
import type { StageOneRow, VerificationStage } from "@/lib/apply/mock-verify";

const PILL: Record<StageOneRow["status"], string> = {
  pass: "bg-ufcu-gray-panel text-ufcu-navy",
  review: "bg-ufcu-secondary-subtle text-ufcu-ink",
};

export function StageOnePanel({
  rows,
  revealed,
  checking,
  stage,
}: {
  rows: StageOneRow[];
  revealed: number;
  checking: boolean;
  stage?: VerificationStage;
}) {
  const t = useApplyT();
  return (
    <div className="card-ufcu flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-xl font-semibold text-ufcu-navy">{t("apply.stage1.title")}</h3>
        <SimulatedBadge />
      </div>

      <p className="max-w-prose text-sm text-ufcu-ink">{t("apply.stage1.body")}</p>

      <ul className="flex flex-col gap-2" aria-live="polite">
        {rows.slice(0, revealed).map((row) => (
          <li
            key={row.id}
            className="flex items-center justify-between gap-3 border-b border-ufcu-gray-line pb-2 last:border-b-0 last:pb-0"
          >
            <span className="text-sm font-semibold text-ufcu-navy">{t(row.labelKey)}</span>
            <span className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold ${PILL[row.status]}`}>
              {t(row.status === "pass" ? "apply.trust.pass" : "apply.trust.review")}
            </span>
          </li>
        ))}
      </ul>

      {checking && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ufcu-navy">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {t("apply.stage1.checking")}
        </p>
      )}
      {!checking && stage === "instant" && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ufcu-navy">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          {t("apply.stage1.confirmed")}
        </p>
      )}
      {!checking && stage === "stepup" && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ufcu-navy">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {t("apply.stage1.unconfirmed")}
        </p>
      )}
    </div>
  );
}
