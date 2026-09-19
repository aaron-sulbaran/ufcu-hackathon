"use client";
// One labelled input with a "Why we ask" disclosure and a friendly inline error.
import { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { useApplyT } from "@/lib/apply/strings";
import { whyKey } from "@/lib/apply/why";

export function WhyToggle({ field }: { field: string }) {
  const t = useApplyT();
  const [open, setOpen] = useState(false);
  const key = whyKey(field);
  if (!key) return null;
  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-sm font-semibold text-ufcu-link underline-offset-2 hover:underline"
      >
        <Info className="size-3.5" aria-hidden />
        {t("apply.why")}
      </button>
      {open && <span className="mt-1 block max-w-prose text-sm text-ufcu-muted">{t(key)}</span>}
    </span>
  );
}

interface FieldProps {
  name: string;
  labelKey: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  placeholder?: string;
  autoComplete?: string;
  secret?: boolean;
  prefilled?: boolean;
  className?: string;
}

export function Field(props: FieldProps) {
  const t = useApplyT();
  const [revealed, setRevealed] = useState(false);
  const { name, labelKey, value, onChange, error, secret, prefilled } = props;
  const hidden = Boolean(secret) && !revealed;
  return (
    <div className={`flex flex-col gap-1.5 ${props.className ?? ""}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={name} className="text-sm font-semibold text-ufcu-navy">
          {t(labelKey)}
          {prefilled && (
            <span className="ml-2 rounded-full border border-ufcu-navy px-2 py-0.5 text-xs font-semibold text-ufcu-navy">
              {t("apply.prefilled")}
            </span>
          )}
        </label>
        <WhyToggle field={name} />
      </div>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={hidden ? "password" : (props.type ?? "text")}
          inputMode={props.inputMode}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete ?? "off"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={`input-ufcu ${secret ? "pr-20" : ""} ${error ? "border-destructive" : ""}`}
        />
        {secret && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute inset-y-0 right-3 inline-flex items-center gap-1 text-sm font-semibold text-ufcu-link"
          >
            {revealed ? <EyeOff className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}
            {revealed ? t("apply.hide") : t("apply.show")}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}
