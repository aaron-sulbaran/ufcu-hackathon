"use client";
// Plain-language summaries with a link to the real document. Consent is a checkbox, never a default.
// The summaries, bullets, and per-document links come from messages/disclosures.json, by language
// with an English fallback, so the Secure Zone and the research notes never drift apart.
import { ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useApplyT } from "@/lib/apply/strings";
import { usePersona } from "@/lib/context";
import { DISCLOSURES_URL, needsW8Ben, offersCourtesyPay } from "@/lib/apply/rules";
import type { AccountsValues, FieldErrors } from "@/lib/apply/schemas";
import type { IdentityPath } from "@/lib/types";
import docs from "@/messages/disclosures.json";

interface DisclosureDoc {
  title: string;
  summary: string;
  bullets: string[];
  fullUrl: string;
}

const DOCS = docs as unknown as Record<string, Record<string, DisclosureDoc> | undefined>;

export function useDisclosureDoc(id: string): DisclosureDoc | null {
  const { context } = usePersona();
  return DOCS[context.lang]?.[id] ?? DOCS.en?.[id] ?? null;
}

function Body({ doc, summary }: { doc: DisclosureDoc | null; summary: string }) {
  return (
    <>
      <p className="text-sm text-muted-foreground">{doc?.summary ?? summary}</p>
      {doc?.bullets?.length ? (
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
          {doc.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      ) : null}
    </>
  );
}

function ReadLink({ href }: { href: string }) {
  const t = useApplyT();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-fit items-center gap-1 text-sm font-medium text-ufcu-secondary-darker underline-offset-2 hover:underline"
    >
      {t("apply.disclosure.read")}
      <ExternalLink className="size-3.5" aria-hidden />
    </a>
  );
}

// A disclosure with no consent to give: the CIP explanation on steps 1 and 2.
export function DisclosureNote({ id, titleKey, subKey }: { id: string; titleKey: string; subKey: string }) {
  const t = useApplyT();
  const doc = useDisclosureDoc(id);
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-medium">{doc?.title ?? t(titleKey)}</h2>
      <Body doc={doc} summary={t(subKey)} />
      <ReadLink href={doc?.fullUrl ?? DISCLOSURES_URL} />
    </div>
  );
}

function Item({
  id,
  titleKey,
  subKey,
  checked,
  onChange,
  error,
}: {
  id: string;
  titleKey: string;
  subKey: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}) {
  const t = useApplyT();
  const doc = useDisclosureDoc(id);
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <Label className="items-start gap-3 text-sm font-medium">
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} aria-invalid={Boolean(error)} className="mt-0.5" />
        <span>{doc?.title ?? t(titleKey)}</span>
      </Label>
      <div className="flex flex-col gap-2 pl-7">
        <Body doc={doc} summary={t(subKey)} />
        <ReadLink href={doc?.fullUrl ?? DISCLOSURES_URL} />
        {error && <p className="text-xs text-destructive">{t(error)}</p>}
      </div>
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
  const courtesyPay = useDisclosureDoc("courtesy_pay");
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-mono text-xs tracking-widest uppercase">{t("apply.disclosures.title")}</h2>
      <Item
        id="esign"
        titleKey="apply.disclosure.esign" subKey="apply.disclosure.esign.sub"
        checked={values.esign} error={errors.esign} onChange={(esign) => onChange({ esign })}
      />
      <Item
        id="membership_agreement"
        titleKey="apply.disclosure.agreement" subKey="apply.disclosure.agreement.sub"
        checked={values.agreement} error={errors.agreement} onChange={(agreement) => onChange({ agreement })}
      />
      {needsW8Ben(path) && (
        <Item
          id="w8ben"
          titleKey="apply.disclosure.w8ben" subKey="apply.disclosure.w8ben.sub"
          checked={values.w8benAck} error={errors.w8benAck} onChange={(w8benAck) => onChange({ w8benAck })}
        />
      )}
      {offersCourtesyPay(values.products) && courtesyPay && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-medium">{courtesyPay.title}</h3>
          <Body doc={courtesyPay} summary="" />
          <ReadLink href={courtesyPay.fullUrl ?? DISCLOSURES_URL} />
        </div>
      )}
    </div>
  );
}
