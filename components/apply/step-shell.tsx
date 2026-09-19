"use client";
// Shared frame for the five steps: monospace step label, serif title, one "why we ask" line, nav.
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplication, TOTAL_STEPS } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";

export function StepShell({
  step,
  titleKey,
  subKey,
  children,
}: {
  step: number;
  titleKey: string;
  subKey?: string;
  children: ReactNode;
}) {
  const t = useApplyT();
  return (
    <section className="flex flex-col gap-5 py-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {t("apply.step", { n: step, total: TOTAL_STEPS })}
        </span>
        <h1 className="font-heading text-3xl leading-tight text-ufcu-primary-darkest">{t(titleKey)}</h1>
        {subKey && <p className="max-w-prose text-sm text-muted-foreground">{t(subKey)}</p>}
      </div>
      {children}
    </section>
  );
}

export function StepNav({
  onContinue,
  continueKey = "apply.next",
  busy = false,
  formError,
}: {
  onContinue: () => void;
  continueKey?: string;
  busy?: boolean;
  formError?: string;
}) {
  const t = useApplyT();
  const { state, goTo, saved } = useApplication();
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-4">
      {formError && <p className="text-sm text-destructive">{t(formError)}</p>}
      <div className="flex items-center gap-3">
        {state.step > 1 && (
          <Button type="button" variant="outline" onClick={() => goTo(state.step - 1)}>
            <ChevronLeft aria-hidden />
            {t("apply.back")}
          </Button>
        )}
        <Button
          type="button"
          onClick={onContinue}
          disabled={busy}
          className="bg-ufcu-secondary-darker text-white hover:bg-ufcu-secondary-darkest"
        >
          {t(busy ? "apply.submitting" : continueKey)}
        </Button>
        {saved && <span className="font-mono text-xs text-ufcu-primary-lighter">{t("apply.saved")}</span>}
      </div>
    </div>
  );
}
