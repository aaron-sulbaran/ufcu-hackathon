"use client";
// Every mocked surface in the Secure Zone carries this badge so judges never mistake it for real.
import { Badge } from "@/components/ui/badge";
import { useApplyT } from "@/lib/apply/strings";

export function SimulatedBadge({ className = "" }: { className?: string }) {
  const t = useApplyT();
  return (
    <Badge variant="outline" className={`border-ufcu-accent bg-ufcu-accent-subtle font-mono text-ufcu-primary ${className}`}>
      {t("apply.simulated")}
    </Badge>
  );
}
