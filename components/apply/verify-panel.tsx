"use client";
// MOCK: document capture. No camera, no upload, no file leaves the page. "Use sample" flips a flag
// and draws a placeholder so the demo is identical on any laptop.
import { UploadCloud } from "lucide-react";
import { useApplyT } from "@/lib/apply/strings";

export function VerifyPanel({
  titleKey,
  loaded,
  onSample,
  error,
  className = "",
}: {
  titleKey: string;
  loaded: boolean;
  onSample: () => void;
  error?: string;
  className?: string;
}) {
  const t = useApplyT();
  return (
    <div className={`card-ufcu flex flex-col gap-3 p-4 ${className}`}>
      <h4 className="font-heading text-base font-semibold text-ufcu-navy">{t(titleKey)}</h4>
      <div
        className={`flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center ${
          loaded ? "border-ufcu-navy" : "border-ufcu-navy/35"
        }`}
      >
        {loaded ? (
          <div className="flex h-20 w-full items-center justify-center rounded-md bg-ufcu-gray-panel text-sm font-semibold text-ufcu-navy">
            {t("apply.verify.loaded")}
          </div>
        ) : (
          <>
            <UploadCloud className="size-6 text-ufcu-navy/50" aria-hidden />
            <p className="text-sm text-ufcu-muted">{t("apply.verify.drop")}</p>
            <button type="button" className="btn btn-outline" onClick={onSample}>
              {t("apply.verify.sample")}
            </button>
          </>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}
