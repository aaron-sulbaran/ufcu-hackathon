"use client";
// MOCK: the four identity checks and the confidence score are simulated (lib/apply/mock-verify.ts).
// In production they map to a KYC vendor and the core; the panel says so on screen.
import { Card, CardContent } from "@/components/ui/card";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { RouteCard } from "@/components/apply/route-card";
import { useApplyT } from "@/lib/apply/strings";
import type { TrustCheck, TrustReadout as Readout } from "@/lib/types";

const CHECK_LABELS: Record<TrustCheck["id"], string> = {
  document: "apply.trust.document",
  face: "apply.trust.face",
  consistency: "apply.trust.consistency",
  watchlist: "apply.trust.watchlist",
};

const PILL: Record<TrustCheck["status"], string> = {
  pass: "bg-ufcu-primary-subtle text-ufcu-primary",
  review: "bg-ufcu-accent-subtle text-ufcu-primary",
  fail: "bg-destructive/10 text-destructive",
};

const STATUS_LABEL: Record<TrustCheck["status"], string> = {
  pass: "apply.trust.pass",
  review: "apply.trust.review",
  fail: "apply.trust.fail",
};

export function TrustReadout({
  readout,
  slot,
  onSlot,
  slotError,
}: {
  readout: Readout;
  slot: string;
  onSlot: (slot: string) => void;
  slotError?: string;
}) {
  const t = useApplyT();
  return (
    <Card className="border-ufcu-primary-subtle">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl text-ufcu-primary-darkest">{t("apply.trust.title")}</h2>
          <SimulatedBadge />
        </div>

        <ul className="flex flex-col gap-2">
          {readout.checks.map((check) => (
            <li key={check.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t(CHECK_LABELS[check.id])}</span>
                <span className="text-xs text-muted-foreground">{t(check.detail)}</span>
              </span>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-xs ${PILL[check.status]}`}>
                {t(STATUS_LABEL[check.status])}
              </span>
            </li>
          ))}
        </ul>

        <p className="font-mono text-sm tracking-tight text-ufcu-primary">
          {t("apply.trust.confidence", { n: readout.confidence })}
        </p>

        <RouteCard route={readout.route} slot={slot} onSlot={onSlot} error={slotError} />

        <p className="text-xs text-muted-foreground">{t("apply.trust.note")}</p>
      </CardContent>
    </Card>
  );
}
