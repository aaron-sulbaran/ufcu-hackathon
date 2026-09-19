"use client";
// MOCK: document capture. No camera, no upload, no file leaves the page. "Use sample" flips a flag
// and draws a placeholder so the demo is identical on any laptop.
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplyT } from "@/lib/apply/strings";

export function VerifyPanel({
  titleKey,
  loaded,
  onSample,
  tone = "primary",
  error,
  className = "",
}: {
  titleKey: string;
  loaded: boolean;
  onSample: () => void;
  tone?: "primary" | "accent";
  error?: string;
  className?: string;
}) {
  const t = useApplyT();
  const fill = tone === "accent" ? "bg-ufcu-accent-subtle" : "bg-ufcu-primary-subtle";
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h3 className="font-mono text-xs tracking-widest uppercase">{t(titleKey)}</h3>
      <div
        className={`flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center ${
          loaded ? "border-ufcu-primary" : "border-ufcu-primary-lighter/60"
        }`}
      >
        {loaded ? (
          <div className={`flex h-20 w-full items-center justify-center rounded-lg ${fill} font-mono text-xs text-ufcu-primary`}>
            {t(titleKey)} - {t("apply.verify.loaded")}
          </div>
        ) : (
          <>
            <UploadCloud className="size-6 text-ufcu-primary-lighter" aria-hidden />
            <p className="text-xs text-muted-foreground">{t("apply.verify.drop")}</p>
            <Button type="button" variant="outline" onClick={onSample} className="h-8">
              {t("apply.verify.sample")}
            </Button>
          </>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{t(error)}</p>}
    </div>
  );
}
