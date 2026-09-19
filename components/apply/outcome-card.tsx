"use client";
// The one card step 3 shows a member: what was decided, in one or two plain sentences, then the
// options. No score, no pass or review table, no internals. The four-check readout this replaces
// still exists in components/apply/trust-readout.tsx, behind the demo disclosure at the bottom of
// the step, for judges who ask how the routing works.
import type { ReactNode } from "react";
import { CalendarClock, CheckCircle2, MapPin, Phone } from "lucide-react";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { useApplyT } from "@/lib/apply/strings";
import { BRANCH, VIDEO_SLOTS } from "@/lib/apply/rules";
import type { TrustReadout } from "@/lib/types";

export function OutcomeCard({
  titleKey,
  bodyKey,
  verified = false,
  children,
}: {
  titleKey: string;
  bodyKey: string;
  verified?: boolean;
  children?: ReactNode;
}) {
  const t = useApplyT();
  return (
    <div className="card-ufcu flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-start gap-2 font-heading text-xl font-semibold text-ufcu-navy">
          {verified && <CheckCircle2 className="mt-1 size-5 shrink-0" aria-hidden />}
          {t(titleKey)}
        </h3>
        <SimulatedBadge />
      </div>
      <p className="max-w-prose text-ufcu-ink">{t(bodyKey)}</p>
      {children}
    </div>
  );
}

function BranchLines() {
  return (
    <ul className="flex flex-col gap-1 text-sm text-ufcu-ink">
      <li className="flex items-center gap-2">
        <MapPin className="size-4 shrink-0 text-ufcu-navy" aria-hidden />
        {BRANCH.name}, {BRANCH.address}
      </li>
      <li className="flex items-center gap-2">
        <CalendarClock className="size-4 shrink-0 text-ufcu-navy" aria-hidden />
        {BRANCH.hours}
      </li>
      <li className="flex items-center gap-2">
        <Phone className="size-4 shrink-0 text-ufcu-navy" aria-hidden />
        {BRANCH.phone}
      </li>
    </ul>
  );
}

// MOCK: the scheduler books nothing; the slots are fixed so the demo runs the same way every time.
function SlotPicker({
  labelKey,
  slot,
  onSlot,
  error,
}: {
  labelKey: string;
  slot: string;
  onSlot: (slot: string) => void;
  error?: string;
}) {
  const t = useApplyT();
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-ufcu-navy">{t(labelKey)}</p>
      <div className="flex flex-wrap gap-2">
        {VIDEO_SLOTS.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={slot === s}
            className={`btn ${slot === s ? "btn-cta" : "btn-outline"}`}
            onClick={() => onSlot(s)}
          >
            {s}
          </button>
        ))}
      </div>
      {slot && (
        <p className="text-sm font-semibold text-ufcu-navy">{t("apply.route.video.picked", { time: slot })}</p>
      )}
      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}

// The same three routes the readout carries, said the way a person would want to hear them.
export function IdentityOutcome({
  route,
  slot,
  onSlot,
  slotError,
}: {
  route: TrustReadout["route"];
  slot: string;
  onSlot: (slot: string) => void;
  slotError?: string;
}) {
  const t = useApplyT();

  if (route === "instant") {
    return <OutcomeCard titleKey="apply.outcome.verified.title" bodyKey="apply.outcome.verified.body" verified />;
  }

  if (route === "video") {
    return (
      <OutcomeCard titleKey="apply.outcome.video.title" bodyKey="apply.outcome.video.body">
        <SlotPicker labelKey="apply.route.video.pick" slot={slot} onSlot={onSlot} error={slotError} />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-ufcu-navy">{t("apply.outcome.video.orBranch")}</p>
          <BranchLines />
        </div>
      </OutcomeCard>
    );
  }

  return (
    <OutcomeCard titleKey="apply.outcome.branch.title" bodyKey="apply.outcome.branch.body">
      <BranchLines />
      <SlotPicker labelKey="apply.outcome.branch.orVideo" slot={slot} onSlot={onSlot} error={slotError} />
    </OutcomeCard>
  );
}
