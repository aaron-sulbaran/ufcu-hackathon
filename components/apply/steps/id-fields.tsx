"use client";
// The identification number block of step 2. Which field appears depends on the path picked in step 1.
import { ShieldOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
    <div className="flex flex-col gap-4 rounded-xl border border-ufcu-primary-subtle bg-ufcu-primary-subtle/25 p-4">
      <p className="flex items-center gap-2 font-mono text-xs tracking-tight text-ufcu-primary uppercase">
        <ShieldOff className="size-4" aria-hidden />
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
            <Label className="items-start gap-3 text-sm font-normal">
              <Checkbox
                checked={about.w8ben}
                onCheckedChange={(checked) => setAbout({ w8ben: checked === true })}
                aria-invalid={Boolean(errors.w8ben)}
                className="mt-0.5"
              />
              <span>{t("apply.f.w8ben")}</span>
            </Label>
            <WhyToggle field="w8ben" />
            {errors.w8ben && <p className="text-xs text-destructive">{t(errors.w8ben)}</p>}
          </div>
        </>
      )}

      {path === "branch_assist" && (
        <p className="text-sm text-muted-foreground">{t("apply.path.branch_assist.sub")}</p>
      )}
    </div>
  );
}
