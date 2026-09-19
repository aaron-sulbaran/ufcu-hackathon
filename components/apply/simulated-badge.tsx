"use client";
// Every mocked surface in the Secure Zone carries this badge so judges never mistake it for real.
import { useApplyT } from "@/lib/apply/strings";

export function SimulatedBadge({ className = "" }: { className?: string }) {
  const t = useApplyT();
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border border-ufcu-navy px-2.5 py-0.5 text-xs font-semibold text-ufcu-navy ${className}`}
    >
      {t("apply.simulated")}
    </span>
  );
}
