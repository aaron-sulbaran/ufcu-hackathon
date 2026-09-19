"use client";
// MOCK: the decision comes from lib/apply/decision.ts, not from a core banking system.
import { AlertCircle, CheckCircle2, ExternalLink, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { useApplyT } from "@/lib/apply/strings";
import type { Decision as DecisionValue } from "@/lib/types";

export function Decision({ decision }: { decision: DecisionValue }) {
  const t = useApplyT();

  return (
    <Card className="border-ufcu-primary">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {decision.kind === "approved" && <CheckCircle2 className="mt-1 size-6 text-ufcu-primary" aria-hidden />}
            {decision.kind === "needs_item" && <Info className="mt-1 size-6 text-ufcu-accent-darker" aria-hidden />}
            {decision.kind === "not_yet" && <AlertCircle className="mt-1 size-6 text-destructive" aria-hidden />}
            <h1 className="font-heading text-2xl leading-tight text-ufcu-primary-darkest">
              {decision.kind === "approved" && t("apply.decision.approved.title")}
              {decision.kind === "needs_item" && t("apply.decision.needs.title")}
              {decision.kind === "not_yet" && t("apply.decision.notyet.title")}
            </h1>
          </div>
          <SimulatedBadge />
        </div>

        {decision.kind === "approved" && (
          <p className="text-sm text-muted-foreground">{t("apply.decision.approved.body")}</p>
        )}

        {decision.kind === "needs_item" && (
          <div className="flex flex-col gap-3">
            <p className="rounded-lg bg-ufcu-accent-subtle p-3 text-sm text-ufcu-primary">{decision.item}</p>
            <div className="flex flex-col gap-1">
              <h2 className="font-mono text-xs tracking-widest uppercase">{t("apply.decision.needs.how")}</h2>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
                {decision.how.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          </div>
        )}

        {decision.kind === "not_yet" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm">{decision.reason}</p>
            {decision.alternatives.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-xs tracking-widest uppercase">{t("apply.decision.alternatives")}</h2>
                <ul className="flex flex-col gap-2">
                  {decision.alternatives.map((alt) => (
                    <li key={alt.id} className="rounded-lg border border-border p-3">
                      <p className="font-medium">{alt.name}</p>
                      <p className="text-sm text-muted-foreground">{alt.tagline}</p>
                      <a
                        href={alt.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-ufcu-secondary-darker underline-offset-2 hover:underline"
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
      </CardContent>
    </Card>
  );
}
