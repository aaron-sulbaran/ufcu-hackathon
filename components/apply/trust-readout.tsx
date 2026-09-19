"use client";
// MOCK: the four identity checks and the confidence score are simulated (lib/apply/mock-verify.ts).
// In production they map to a KYC vendor and the core; the panel says so on screen.
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { RouteCard } from "@/components/apply/route-card";
import { useApplyT } from "@/lib/apply/strings";
import type { VerificationStage } from "@/lib/apply/mock-verify";
import type { TrustCheck, TrustReadout as Readout } from "@/lib/types";

const CHECK_LABELS: Record<TrustCheck["id"], string> = {
  document: "apply.trust.document",
  face: "apply.trust.face",
  consistency: "apply.trust.consistency",
  watchlist: "apply.trust.watchlist",
};

// Pass is navy on the site's gray panel, review is ink on the soft orange, fail is the destructive red.
const PILL: Record<TrustCheck["status"], string> = {
  pass: "bg-ufcu-gray-panel text-ufcu-navy",
  review: "bg-ufcu-secondary-subtle text-ufcu-ink",
  fail: "bg-destructive text-white",
};

const STATUS_LABEL: Record<TrustCheck["status"], string> = {
  pass: "apply.trust.pass",
  review: "apply.trust.review",
  fail: "apply.trust.fail",
};

// On the instant path no document and no selfie were ever asked for, so these two checks are shown
// as not needed rather than as a pass for something that never happened.
const SKIPPED_DETAIL: Partial<Record<TrustCheck["id"], string>> = {
  document: "apply.detail.doc.notNeeded",
  face: "apply.detail.face.notNeeded",
};

export function TrustReadout({
  readout,
  stage,
  slot,
  onSlot,
  slotError,
}: {
  readout: Readout;
  stage?: VerificationStage;
  slot: string;
  onSlot: (slot: string) => void;
  slotError?: string;
}) {
  const t = useApplyT();
  return (
    <div className="card-ufcu flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-xl font-semibold text-ufcu-navy">{t("apply.trust.heading")}</h3>
        <SimulatedBadge />
      </div>

      <ul className="flex flex-col gap-2">
        {readout.checks.map((check) => {
          const skipped = stage === "instant" && Boolean(SKIPPED_DETAIL[check.id]);
          return (
            <li
              key={check.id}
              className="flex items-start justify-between gap-3 border-b border-ufcu-gray-line pb-2 last:border-b-0 last:pb-0"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-ufcu-navy">{t(CHECK_LABELS[check.id])}</span>
                <span className="text-sm text-ufcu-muted">
                  {t(skipped ? (SKIPPED_DETAIL[check.id] as string) : check.detail)}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold ${
                  skipped ? "bg-ufcu-gray-line text-ufcu-muted" : PILL[check.status]
                }`}
              >
                {t(skipped ? "apply.trust.notNeeded" : STATUS_LABEL[check.status])}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="flex items-baseline gap-3">
        <span className="font-heading text-4xl font-bold text-ufcu-navy">{readout.confidence}</span>
        <span className="text-sm text-ufcu-muted">{t("apply.trust.confidenceLabel")}</span>
      </div>

      {stage && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ufcu-navy">{t("apply.trust.how")}</p>
          <p className="max-w-prose text-sm text-ufcu-ink">
            {t(stage === "instant" ? "apply.trust.how.instant" : "apply.trust.how.stepup")}
          </p>
        </div>
      )}

      <RouteCard route={readout.route} slot={slot} onSlot={onSlot} error={slotError} />

      <p className="disclaimer text-ufcu-muted">{t("apply.trust.note")}</p>
    </div>
  );
}
