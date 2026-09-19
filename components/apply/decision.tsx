"use client";
// MOCK: the decision comes from lib/apply/decision.ts, not from a core banking system.
// Its item, steps, and reason are i18n keys (or plain text from an older saved session); t() handles both.
import { AlertCircle, CheckCircle2, ExternalLink, Info } from "lucide-react";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { useApplyT } from "@/lib/apply/strings";
import type { Decision as DecisionValue } from "@/lib/types";
import { usePersona } from "@/lib/context";
import { localizeProduct, productById } from "@/lib/products";
import type { CreditOutcome } from "@/lib/apply/decision";

// The credit card answers for itself, under the main decision. Never "denied": either the card is
// approved with its one next step, or it is "not yet" with the two products that fix that.
function CreditBlock({ credit }: { credit: CreditOutcome }) {
  const t = useApplyT();
  const { context } = usePersona();

  if (credit.kind === "approved") {
    return (
      <div className="card-ufcu flex flex-col gap-2 p-5">
        <h3 className="flex items-start gap-2 font-heading text-xl font-semibold text-ufcu-navy">
          <CheckCircle2 className="mt-1 size-5 shrink-0" aria-hidden />
          {t("apply.credit.approved.title")}
        </h3>
        <p className="max-w-prose text-ufcu-ink">{t(credit.step)}</p>
      </div>
    );
  }

  return (
    <div className="card-ufcu flex flex-col gap-4 p-5">
      <h3 className="font-heading text-xl font-semibold text-ufcu-navy">{t("apply.credit.notyet.title")}</h3>
      <p className="max-w-prose text-ufcu-ink">{t(credit.reason)}</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {credit.alternatives.map((alt) => {
          const product = alt.productId ? productById(alt.productId) : undefined;
          const name = product ? localizeProduct(product, context.lang).name : t(alt.titleKey);
          return (
            <li key={alt.id} className="panel-gray flex flex-col gap-2">
              <p className="font-heading text-base font-semibold text-ufcu-navy">{name}</p>
              <p className="text-sm text-ufcu-ink">{t(alt.bodyKey)}</p>
              <a href={alt.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-cta mt-auto w-fit">
                {t("apply.credit.add")}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>
      <p className="text-sm font-semibold text-ufcu-navy">{t(credit.comeBack)}</p>
    </div>
  );
}

export function Decision({ decision, credit }: { decision: DecisionValue; credit?: CreditOutcome | null }) {
  const t = useApplyT();
  const { context } = usePersona();

  return (
    <>
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
          <p className="panel-gray text-sm text-ufcu-ink">{t(decision.item)}</p>
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-lg font-semibold text-ufcu-navy">{t("apply.decision.needs.how")}</h3>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-ufcu-ink">
              {decision.how.map((h) => <li key={h}>{t(h)}</li>)}
            </ul>
          </div>
        </div>
      )}

      {decision.kind === "not_yet" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ufcu-ink">{t(decision.reason)}</p>
          {decision.alternatives.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-heading text-lg font-semibold text-ufcu-navy">{t("apply.decision.alternatives")}</h3>
              <ul className="flex flex-col gap-2">
                {decision.alternatives.map((alt) => (
                  <li key={alt.id} className="card-ufcu flex flex-col gap-1 p-4">
                    <p className="font-heading text-base font-semibold text-ufcu-navy">{localizeProduct(alt, context.lang).name}</p>
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

      {credit && <CreditBlock credit={credit} />}
    </>
  );
}
