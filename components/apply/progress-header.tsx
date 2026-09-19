"use client";
// The Secure Zone chrome under the shared header: lock line, step progress, elapsed time (rubric B).
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { useApplication, TOTAL_STEPS } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";

export function SecureBar() {
  const t = useApplyT();
  return (
    <div className="bg-ufcu-primary-darker text-white/90">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2 text-sm">
        <Lock className="size-4 shrink-0" aria-hidden />
        <span>{t("apply.noai")}</span>
      </div>
    </div>
  );
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
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <Progress
          value={pct}
          className="gap-2 [&_[data-slot=progress-indicator]]:bg-ufcu-accent"
        >
          <ProgressLabel className="font-mono text-xs tracking-widest text-ufcu-primary uppercase">
            {t("apply.step", { n: state.step, total: TOTAL_STEPS })}
          </ProgressLabel>
          <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
            {ready ? t("apply.elapsed", { m, s }) : ""}
          </span>
          <button
            type="button"
            onClick={reset}
            className="font-mono text-xs text-ufcu-secondary-darker underline-offset-2 uppercase hover:underline"
          >
            {t("apply.startover")}
          </button>
        </Progress>
      </div>
    </div>
  );
}
