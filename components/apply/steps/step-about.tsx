"use client";
// Step 2: the four things federal rules require (name, date of birth, address, ID number) plus the
// contact details the account needs. Formats are checked with zod; nothing is sent anywhere.
import { useState } from "react";
import { StepNav, StepShell } from "@/components/apply/step-shell";
import { Field } from "@/components/apply/field";
import { IdFields } from "@/components/apply/steps/id-fields";
import { DisclosureNote } from "@/components/apply/disclosures";
import { SimulatedBadge } from "@/components/apply/simulated-badge";
import { Button } from "@/components/ui/button";
import { sampleAbout } from "@/lib/apply/sample";
import { useApplication } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";
import { aboutSchema, fieldErrors, type FieldErrors } from "@/lib/apply/schemas";

export function StepAbout() {
  const t = useApplyT();
  const { state, setAbout, goTo } = useApplication();
  const [errors, setErrors] = useState<FieldErrors>({});
  const about = state.about;
  const prefill = state.prefill;

  const onContinue = () => {
    const parsed = aboutSchema(state.path).safeParse(about);
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); return; }
    setErrors({});
    goTo(3);
  };

  return (
    <StepShell step={2} titleKey="apply.step2.title" subKey="apply.cip">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setAbout(sampleAbout(state.path, prefill))}>
          {t("apply.sample.fill")}
        </Button>
        <SimulatedBadge />
        <span className="text-xs text-muted-foreground">{t("apply.sample.note")}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="firstName" labelKey="apply.f.firstName" value={about.firstName} error={errors.firstName}
          prefilled={Boolean(prefill?.firstName)} autoComplete="given-name"
          onChange={(v) => setAbout({ firstName: v })}
        />
        <Field
          name="lastName" labelKey="apply.f.lastName" value={about.lastName} error={errors.lastName}
          autoComplete="family-name" onChange={(v) => setAbout({ lastName: v })}
        />
        <Field
          name="dob" labelKey="apply.f.dob" value={about.dob} error={errors.dob}
          placeholder="MM/DD/YYYY" inputMode="numeric" onChange={(v) => setAbout({ dob: v })}
        />
        <Field
          name="email" labelKey="apply.f.email" value={about.email} error={errors.email}
          prefilled={Boolean(prefill?.email)} type="email" inputMode="email"
          onChange={(v) => setAbout({ email: v })}
        />
        <Field
          name="phone" labelKey="apply.f.phone" value={about.phone} error={errors.phone}
          placeholder="(512) 555-0134" inputMode="tel" onChange={(v) => setAbout({ phone: v })}
        />
        <Field
          name="occupation" labelKey="apply.f.occupation" value={about.occupation} error={errors.occupation}
          onChange={(v) => setAbout({ occupation: v })}
        />
        <Field
          name="street" labelKey="apply.f.street" value={about.street} error={errors.street}
          className="sm:col-span-2" onChange={(v) => setAbout({ street: v })}
        />
        <Field
          name="city" labelKey="apply.f.city" value={about.city} error={errors.city}
          onChange={(v) => setAbout({ city: v })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            name="state" labelKey="apply.f.state" value={about.state} error={errors.state}
            onChange={(v) => setAbout({ state: v.toUpperCase().slice(0, 2) })}
          />
          <Field
            name="zip" labelKey="apply.f.zip" value={about.zip} error={errors.zip}
            inputMode="numeric" placeholder="78705" onChange={(v) => setAbout({ zip: v })}
          />
        </div>
        <Field
          name="affiliation" labelKey="apply.f.affiliation" value={about.affiliation} error={errors.affiliation}
          prefilled={Boolean(prefill?.schoolAffiliation)} className="sm:col-span-2"
          placeholder={t("apply.optional")} onChange={(v) => setAbout({ affiliation: v })}
        />
      </div>

      <IdFields path={state.path} about={about} errors={errors} setAbout={setAbout} />

      <DisclosureNote id="why_we_ask_cip" titleKey="apply.cip.title" subKey="apply.cip" />

      <StepNav onContinue={onContinue} />
    </StepShell>
  );
}
