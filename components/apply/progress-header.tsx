"use client";
// The Secure Zone chrome under the page band: a thin navy progress bar, the elapsed timer, and a
// way back to the start. The lock line and the clock line live in the page band above this.
import { useEffect, useState } from "react";
import { useApplication, TOTAL_STEPS } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";

// Kept as a no-op so app/apply/page.tsx keeps compiling while the page band replaces this bar.
export function SecureBar() {
  return null;
}

export function useElapsed(startedAt: number, running: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const tick = () => setSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, running]);
  return { m: Math.floor(seconds / 60), s: String(seconds % 60).padStart(2, "0") };
}

export function ProgressHeader() {
  const t = useApplyT();
  const { state, ready, reset } = useApplication();
  const { m, s } = useElapsed(state.startedAt, ready && !state.decision);
  const pct = Math.round((state.step / TOTAL_STEPS) * 100);
  const label = t("apply.step", { n: state.step, total: TOTAL_STEPS });
  return (
    <div className="border-b border-ufcu-gray-line bg-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-sm font-semibold text-ufcu-navy">{label}</span>
          <span className="ml-auto text-sm text-ufcu-muted tabular-nums">
            {ready ? t("apply.elapsed", { m, s }) : ""}
          </span>
          <button
            type="button"
            onClick={reset}
            className="text-sm font-semibold text-ufcu-link underline-offset-2 hover:underline"
          >
            {t("apply.startover")}
          </button>
        </div>
        <div
          role="progressbar"
          aria-label={label}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1 w-full overflow-hidden rounded-full bg-ufcu-gray-line"
        >
          <div className="h-full bg-ufcu-navy transition-[width] duration-200" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
