"use client";
// Step 5: read it back, submit, then the decision and the personalized checklist.
import { useState } from "react";
import { StepNav, StepShell } from "@/components/apply/step-shell";
import { ReviewSummary } from "@/components/apply/review-summary";
import { Decision } from "@/components/apply/decision";
import { NextSteps } from "@/components/apply/next-steps";
import { useApplication } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";
import { usePersona } from "@/lib/context";
import { decide } from "@/lib/apply/decision";
import { nextStepsFor } from "@/lib/apply/next-steps";

export function StepReview() {
  const t = useApplyT();
  const { state, personaId, update } = useApplication();
  const { context } = usePersona();
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState<{ m: number; s: string } | null>(null);

  const audience = state.prefill?.context?.audience ?? context.audience;
  const goal = state.prefill?.context?.goal ?? context.goal;

  const submit = async () => {
    setBusy(true);
    // MOCK: 1.2 seconds stands in for the core banking call that would open the accounts.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const { data: decision } = await decide({ path: state.path, personaId, trust: state.trust });
    const steps = await nextStepsFor({ audience, goal, path: state.path, personaId });
    const seconds = Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000));
    setElapsed({ m: Math.floor(seconds / 60), s: String(seconds % 60).padStart(2, "0") });
    update({ decision, nextSteps: steps });
    setBusy(false);
  };

  if (state.decision) {
    return (
      <section className="flex flex-col gap-5 py-6">
        <Decision decision={state.decision} />
        {elapsed && (
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {t("apply.done.elapsed", elapsed)}
          </p>
        )}
        <NextSteps steps={state.nextSteps ?? []} />
      </section>
    );
  }

  return (
    <StepShell step={5} titleKey="apply.step5.title" subKey="apply.accounts.sub">
      <ReviewSummary />
      <StepNav onContinue={submit} continueKey="apply.submit" busy={busy} />
    </StepShell>
  );
}
