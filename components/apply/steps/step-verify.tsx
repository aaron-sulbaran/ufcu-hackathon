"use client";
// Step 3: identity in two stages. Stage 1 runs by itself and checks the details already on file;
// most people finish there and are never asked for a photo. Stage 2, the step-up, only appears when
// stage 1 could not confirm everything, and replaces a branch trip with a document and a selfie.
// Verified once here and reused for every account in the bundle, which is the point we make on the
// review step. The member sees one outcome card per stage; the four-check readout is demo material
// and sits collapsed at the bottom of the step.
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { StepNav, StepShell } from "@/components/apply/step-shell";
import { StageOnePanel } from "@/components/apply/stage-one-panel";
import { OutcomeCard, IdentityOutcome } from "@/components/apply/outcome-card";
import { VerifyPanel } from "@/components/apply/verify-panel";
import { TrustReadout } from "@/components/apply/trust-readout";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { useApplication } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";
import { stageOne, mockVerify } from "@/lib/apply/mock-verify";
import { needsEnrollmentDoc } from "@/lib/apply/rules";
import { fieldErrors, verifySchema, type FieldErrors } from "@/lib/apply/schemas";

// MOCK: the stage 1 pause stands in for the vendor round trip.
const SETTLE_MS = 1800;

export function StepVerify() {
  const t = useApplyT();
  const { state, personaId, setVerify, update, goTo } = useApplication();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [running, setRunning] = useState(false);
  const verify = state.verify;
  const verification = state.verification;
  const path = state.path;
  const needsEnrollment = needsEnrollmentDoc(path);
  const needsSlot = state.trust?.route === "video";

  // Stage 1: automatic, once. A refresh mid-step finds the stored verification and skips it.
  useEffect(() => {
    if (verification) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    void (async () => {
      const { data } = await stageOne({ path, personaId });
      if (cancelled || !data) return;
      timers.push(
        setTimeout(() => {
          update({
            verification: { stage: data.stage, stageOneDone: true },
            ...(data.trust ? { trust: data.trust } : {}),
          });
        }, SETTLE_MS),
      );
    })();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [verification, path, personaId, update]);

  const stage = verification?.stage;
  const checking = !verification;
  const stepUp = verification?.stage === "stepup";

  const run = async () => {
    setRunning(true);
    // MOCK: a 1.5 second pause stands in for the vendor round trip.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const { data } = await mockVerify({ path, personaId });
    if (data) update({ trust: data });
    setRunning(false);
  };

  const onContinue = () => {
    const parsed = verifySchema(path, {
      stepUp,
      hasReadout: Boolean(state.trust),
      needsSlot,
    }).safeParse(verify);
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); return; }
    setErrors({});
    goTo(4);
  };

  return (
    <StepShell step={3} titleKey="apply.step3.title" subKey="apply.step3.lead">
      {checking && <StageOnePanel />}

      {stepUp && (
        <div className="flex flex-col gap-4">
          <OutcomeCard titleKey="apply.outcome.stepup.title" bodyKey="apply.outcome.stepup.body" />

          <div className="panel-gray flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ufcu-navy">{t("apply.stepup.vendorLabel")}</p>
              <SimulatedBadge />
            </div>
            <p className="max-w-prose text-sm text-ufcu-ink">{t("apply.stepup.vendor")}</p>
          </div>

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
            {errors.readout && <p className="text-sm text-destructive">{t(errors.readout)}</p>}
          </div>
        </div>
      )}

      {state.trust && (
        <IdentityOutcome
          route={state.trust.route}
          slot={verify.slot}
          onSlot={(slot) => setVerify({ slot })}
          slotError={errors.slot}
        />
      )}

      <StepNav onContinue={onContinue} disabled={!state.trust} />

      {state.trust && (
        <details className="border-t border-ufcu-gray-line pt-4">
          <summary className="w-fit cursor-pointer list-none text-xs font-semibold text-ufcu-muted underline-offset-2 hover:underline [&::-webkit-details-marker]:hidden">
            {t("apply.demo.how")}
          </summary>
          <div className="pt-3">
            <TrustReadout
              readout={state.trust}
              stage={stage}
              slot={verify.slot}
              onSlot={(slot) => setVerify({ slot })}
            />
          </div>
        </details>
      )}
    </StepShell>
  );
}
