"use client";
// Picks the step component. State lives in lib/apply/state.tsx and survives a refresh.
import { ProgressHeader } from "@/components/apply/progress-header";
import { StepPath } from "@/components/apply/steps/step-path";
import { StepAbout } from "@/components/apply/steps/step-about";
import { StepVerify } from "@/components/apply/steps/step-verify";
import { StepAccounts } from "@/components/apply/steps/step-accounts";
import { StepReview } from "@/components/apply/steps/step-review";
import { useApplication } from "@/lib/apply/state";

function CurrentStep() {
  const { state, ready } = useApplication();
  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  switch (state.step) {
    case 2: return <StepAbout />;
    case 3: return <StepVerify />;
    case 4: return <StepAccounts />;
    case 5: return <StepReview />;
    default: return <StepPath />;
  }
}

export function Wizard() {
  return (
    <>
      <ProgressHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-20">
        <CurrentStep />
      </main>
    </>
  );
}
