"use client";
// Shared frame for the five steps: a Montserrat navy title, one "why we ask" line, and the nav
// buttons. The step count lives in the progress bar above, so it is not repeated here.
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useApplication } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";

export function StepShell({
  titleKey,
  subKey,
  children,
}: {
  step?: number;
  titleKey: string;
  subKey?: string;
  children: ReactNode;
}) {
  const t = useApplyT();
  return (
    <section className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-3">
        <h2>{t(titleKey)}</h2>
        {subKey && <p className="max-w-prose text-ufcu-ink">{t(subKey)}</p>}
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
  const hero = continueKey === "apply.submit";
  return (
    <div className="flex flex-col gap-3 border-t border-ufcu-gray-line pt-5">
      {formError && <p className="text-sm text-destructive">{t(formError)}</p>}
      <div className="flex flex-wrap items-center gap-3">
        {state.step > 1 && (
          <button type="button" className="btn btn-outline" onClick={() => goTo(state.step - 1)}>
            <ChevronLeft className="size-4" aria-hidden />
            {t("apply.back")}
          </button>
        )}
        <button
          type="button"
          onClick={onContinue}
          disabled={busy}
          className={`btn btn-cta${hero ? " btn-hero" : ""}`}
        >
          {t(busy ? "apply.submitting" : continueKey)}
        </button>
        {saved && <span className="text-xs text-ufcu-muted">{t("apply.saved")}</span>}
      </div>
    </div>
  );
}
