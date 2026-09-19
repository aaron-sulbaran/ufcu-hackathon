"use client";
// Step 3: simulated capture, then the trust readout. Verified once here and reused for every account
// in the bundle, which is the point we make on the review step.
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { StepNav, StepShell } from "@/components/apply/step-shell";
import { VerifyPanel } from "@/components/apply/verify-panel";
import { TrustReadout } from "@/components/apply/trust-readout";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { useApplication } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";
import { mockVerify } from "@/lib/apply/mock-verify";
import { needsEnrollmentDoc } from "@/lib/apply/rules";
import { fieldErrors, verifySchema, type FieldErrors } from "@/lib/apply/schemas";

export function StepVerify() {
  const t = useApplyT();
  const { state, personaId, setVerify, update, goTo } = useApplication();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [running, setRunning] = useState(false);
  const verify = state.verify;
  const needsEnrollment = needsEnrollmentDoc(state.path);
  const needsSlot = state.trust?.route === "video";

  const run = async () => {
    setRunning(true);
    // MOCK: a 1.5 second pause stands in for the vendor round trip.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const { data } = await mockVerify({ path: state.path, personaId });
    if (data) update({ trust: data });
    setRunning(false);
  };

  const onContinue = () => {
    const parsed = verifySchema(state.path, Boolean(state.trust), needsSlot).safeParse(verify);
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); return; }
    setErrors({});
    goTo(4);
  };

  return (
    <StepShell step={3} titleKey="apply.step3.title" subKey="apply.step3.sub">
      <div className="grid gap-4 sm:grid-cols-2">
        <VerifyPanel
          titleKey="apply.verify.id" loaded={verify.idDoc} error={errors.idDoc}
          onSample={() => setVerify({ idDoc: true })}
        />
        <VerifyPanel
          titleKey="apply.verify.selfie" loaded={verify.selfie}
          onSample={() => setVerify({ selfie: true })}
        />
        {needsEnrollment && (
          <VerifyPanel
            titleKey="apply.verify.enrollment" loaded={verify.enrollment} error={errors.enrollment}
            className="sm:col-span-2" onSample={() => setVerify({ enrollment: true })}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} disabled={running} className="btn btn-cta">
          {running && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {running ? t("apply.verify.running") : t(state.trust ? "apply.verify.again" : "apply.verify.run")}
        </button>
        <SimulatedBadge />
        {errors.readout && <p className="text-sm text-destructive">{t(errors.readout)}</p>}
      </div>

      {state.trust && (
        <TrustReadout
          readout={state.trust}
          slot={verify.slot}
          onSlot={(slot) => setVerify({ slot })}
          slotError={errors.slot}
        />
      )}

      <StepNav onContinue={onContinue} />
    </StepShell>
  );
}
