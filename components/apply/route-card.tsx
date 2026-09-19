"use client";
// The routing outcome under the trust readout: instant, a video call with a banker, or a branch visit.
// MOCK: the scheduler books nothing; the slots are fixed so the demo runs the same way every time.
import { CalendarClock, CheckCircle2, MapPin, Phone } from "lucide-react";
import { useApplyT } from "@/lib/apply/strings";
import { BRANCH, VIDEO_SLOTS } from "@/lib/apply/rules";
import type { TrustReadout } from "@/lib/types";

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

export function RouteCard({
  route,
  slot,
  onSlot,
  error,
}: {
  route: TrustReadout["route"];
  slot: string;
  onSlot: (slot: string) => void;
  error?: string;
}) {
  const t = useApplyT();

  if (route === "instant") {
    return (
      <div className="panel-gray flex flex-col gap-1">
        <p className="flex items-center gap-2 font-heading text-lg font-semibold text-ufcu-navy">
          <CheckCircle2 className="size-5" aria-hidden />
          {t("apply.route.instant.title")}
        </p>
        <p className="text-sm text-ufcu-ink">{t("apply.route.instant.body")}</p>
      </div>
    );
  }

  if (route === "video") {
    return (
      <div className="panel-gray flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-heading text-lg font-semibold text-ufcu-navy">{t("apply.route.video.title")}</p>
          <p className="text-sm text-ufcu-ink">{t("apply.route.video.body")}</p>
        </div>
        <BranchLines />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-ufcu-navy">{t("apply.route.video.pick")}</p>
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
            <p className="text-sm font-semibold text-ufcu-navy">
              {t("apply.route.video.picked", { time: slot })}
            </p>
          )}
          {error && <p className="text-sm text-destructive">{t(error)}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="panel-gray flex flex-col gap-2">
      <p className="font-heading text-lg font-semibold text-ufcu-navy">{t("apply.route.branch.title")}</p>
      <p className="text-sm text-ufcu-ink">{t("apply.route.branch.body")}</p>
      <BranchLines />
    </div>
  );
}
