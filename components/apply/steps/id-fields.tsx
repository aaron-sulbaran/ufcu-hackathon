"use client";
// The identification number block of step 2. Which field appears depends on the path picked in step 1.
import { Lock } from "lucide-react";
import { Field, WhyToggle } from "@/components/apply/field";
import { useApplyT } from "@/lib/apply/strings";
import type { AboutValues, FieldErrors } from "@/lib/apply/schemas";
import type { IdentityPath } from "@/lib/types";

export function IdFields({
  path,
  about,
  errors,
  setAbout,
}: {
  path: IdentityPath;
  about: AboutValues;
  errors: FieldErrors;
  setAbout: (patch: Partial<AboutValues>) => void;
}) {
  const t = useApplyT();
  return (
    <div className="card-ufcu flex flex-col gap-4 p-4">
      <p className="flex items-center gap-2 text-sm text-ufcu-muted">
        <Lock className="size-4 shrink-0" aria-hidden />
        {t("apply.noai.field")}
      </p>

      {(path === "ssn" || path === "minor") && (
        <Field
          name="ssn"
          labelKey="apply.f.ssn"
          secret
          inputMode="numeric"
          placeholder="123-45-6789"
          value={about.ssn}
          error={errors.ssn}
          onChange={(v) => setAbout({ ssn: v })}
        />
      )}

      {path === "itin" && (
        <Field
          name="itin"
          labelKey="apply.f.itin"
          secret
          inputMode="numeric"
          placeholder="9XX-XX-XXXX"
          value={about.itin}
          error={errors.itin}
          onChange={(v) => setAbout({ itin: v })}
        />
      )}

      {path === "foreign_status" && (
        <>
          <Field
            name="passportNumber"
            labelKey="apply.f.passport"
            value={about.passportNumber}
            error={errors.passportNumber}
            onChange={(v) => setAbout({ passportNumber: v })}
          />
          <Field
            name="passportCountry"
            labelKey="apply.f.country"
            value={about.passportCountry}
            error={errors.passportCountry}
            onChange={(v) => setAbout({ passportCountry: v })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-ufcu-ink">
              <input
                type="checkbox"
                checked={about.w8ben}
                onChange={(e) => setAbout({ w8ben: e.target.checked })}
                aria-invalid={Boolean(errors.w8ben)}
                className="mt-0.5 shrink-0"
              />
              <span>{t("apply.f.w8ben")}</span>
            </label>
            <WhyToggle field="w8ben" />
            {errors.w8ben && <p className="text-sm text-destructive">{t(errors.w8ben)}</p>}
          </div>
        </>
      )}

      {path === "branch_assist" && (
        <p className="text-sm text-ufcu-ink">{t("apply.path.branch_assist.sub")}</p>
      )}
    </div>
  );
}
