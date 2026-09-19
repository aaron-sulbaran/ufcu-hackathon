"use client";
// The checklist under the decision. Titles and details may be i18n keys (rule-based steps) or plain
// strings (a persona's own next steps); t() passes an unknown key straight through.
import { ExternalLink } from "lucide-react";
import { useApplyT } from "@/lib/apply/strings";
import type { NextStep } from "@/lib/types";

const KIT_PREFIX = "apply.next.switch.";

function StepList({ steps, offset }: { steps: NextStep[]; offset: number }) {
  const t = useApplyT();
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <li key={`${step.title}-${index}`} className="flex gap-3 rounded-xl border border-border bg-card p-4">
          <span className="font-mono text-xs text-ufcu-primary-lighter">
            {String(offset + index + 1).padStart(2, "0")}
          </span>
          <span className="flex flex-col gap-1">
            <span className="font-medium">{t(step.title)}</span>
            <span className="text-sm text-muted-foreground">{t(step.detail)}</span>
            {step.sourceUrl && (
              <a
                href={step.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-1 text-sm font-medium text-ufcu-secondary-darker underline-offset-2 hover:underline"
              >
                {t("apply.next.open")}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function NextSteps({ steps }: { steps: NextStep[] }) {
  const t = useApplyT();
  if (!steps.length) return null;
  // The Switch Kit steps always arrive together at the end, so they get their own heading.
  const kitAt = steps.findIndex((s) => s.title.startsWith(KIT_PREFIX));
  const base = kitAt === -1 ? steps : steps.slice(0, kitAt);
  const kit = kitAt === -1 ? [] : steps.slice(kitAt);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-xl text-ufcu-primary-darkest">{t("apply.next.title")}</h2>
      <StepList steps={base} offset={0} />
      {kit.length > 0 && (
        <>
          <h3 className="font-heading text-xl text-ufcu-primary-darkest">{t("apply.next.switchkit")}</h3>
          <StepList steps={kit} offset={base.length} />
        </>
      )}
    </section>
  );
}
