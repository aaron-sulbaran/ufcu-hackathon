"use client";
// Plain-language summaries with a link to the real document. Consent is a checkbox, never a default.
import { ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useApplyT } from "@/lib/apply/strings";
import { DISCLOSURES_URL, needsW8Ben } from "@/lib/apply/rules";
import type { AccountsValues, FieldErrors } from "@/lib/apply/schemas";
import type { IdentityPath } from "@/lib/types";

function Item({
  titleKey,
  subKey,
  checked,
  onChange,
  error,
}: {
  titleKey: string;
  subKey: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}) {
  const t = useApplyT();
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <Label className="items-start gap-3 text-sm font-medium">
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} aria-invalid={Boolean(error)} className="mt-0.5" />
        <span>{t(titleKey)}</span>
      </Label>
      <p className="pl-7 text-sm text-muted-foreground">{t(subKey)}</p>
      <a
        href={DISCLOSURES_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit items-center gap-1 pl-7 text-sm font-medium text-ufcu-secondary-darker underline-offset-2 hover:underline"
      >
        {t("apply.disclosure.read")}
        <ExternalLink className="size-3.5" aria-hidden />
      </a>
      {error && <p className="pl-7 text-xs text-destructive">{t(error)}</p>}
    </div>
  );
}

export function Disclosures({
  path,
  values,
  errors,
  onChange,
}: {
  path: IdentityPath;
  values: AccountsValues;
  errors: FieldErrors;
  onChange: (patch: Partial<AccountsValues>) => void;
}) {
  const t = useApplyT();
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-mono text-xs tracking-widest uppercase">{t("apply.disclosures.title")}</h2>
      <Item
        titleKey="apply.disclosure.esign" subKey="apply.disclosure.esign.sub"
        checked={values.esign} error={errors.esign} onChange={(esign) => onChange({ esign })}
      />
      <Item
        titleKey="apply.disclosure.agreement" subKey="apply.disclosure.agreement.sub"
        checked={values.agreement} error={errors.agreement} onChange={(agreement) => onChange({ agreement })}
      />
      {needsW8Ben(path) && (
        <Item
          titleKey="apply.disclosure.w8ben" subKey="apply.disclosure.w8ben.sub"
          checked={values.w8benAck} error={errors.w8benAck} onChange={(w8benAck) => onChange({ w8benAck })}
        />
      )}
    </div>
  );
}
