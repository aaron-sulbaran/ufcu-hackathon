"use client";
// MOCK: the decision comes from lib/apply/decision.ts, not from a core banking system.
import { AlertCircle, CheckCircle2, ExternalLink, Info } from "lucide-react";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { useApplyT } from "@/lib/apply/strings";
import type { Decision as DecisionValue } from "@/lib/types";

export function Decision({ decision }: { decision: DecisionValue }) {
  const t = useApplyT();

  return (
    <div className="card-ufcu flex flex-col gap-5 border-2 border-ufcu-navy p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {decision.kind === "approved" && <CheckCircle2 className="mt-2 size-6 shrink-0 text-ufcu-navy" aria-hidden />}
          {decision.kind === "needs_item" && <Info className="mt-2 size-6 shrink-0 text-ufcu-cta" aria-hidden />}
          {decision.kind === "not_yet" && <AlertCircle className="mt-2 size-6 shrink-0 text-destructive" aria-hidden />}
          <h2>
            {decision.kind === "approved" && t("apply.decision.approved.title")}
            {decision.kind === "needs_item" && t("apply.decision.needs.title")}
            {decision.kind === "not_yet" && t("apply.decision.notyet.title")}
          </h2>
        </div>
        <SimulatedBadge />
      </div>

      {decision.kind === "approved" && <p className="text-ufcu-ink">{t("apply.decision.approved.body")}</p>}

      {decision.kind === "needs_item" && (
        <div className="flex flex-col gap-4">
          <p className="panel-gray text-sm text-ufcu-ink">{decision.item}</p>
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-lg font-semibold text-ufcu-navy">{t("apply.decision.needs.how")}</h3>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-ufcu-ink">
              {decision.how.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </div>
      )}

      {decision.kind === "not_yet" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ufcu-ink">{decision.reason}</p>
          {decision.alternatives.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-heading text-lg font-semibold text-ufcu-navy">{t("apply.decision.alternatives")}</h3>
              <ul className="flex flex-col gap-2">
                {decision.alternatives.map((alt) => (
                  <li key={alt.id} className="card-ufcu flex flex-col gap-1 p-4">
                    <p className="font-heading text-base font-semibold text-ufcu-navy">{alt.name}</p>
                    <p className="text-sm text-ufcu-ink">{alt.tagline}</p>
                    <a
                      href={alt.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-ufcu-link underline-offset-2 hover:underline"
                    >
                      {t("apply.next.open")}
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
