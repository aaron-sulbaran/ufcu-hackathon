"use client";
// Step 1: which documents you have. Everything below follows from this choice.
import { useState } from "react";
import { Check } from "lucide-react";
import { StepNav, StepShell } from "@/components/apply/step-shell";
import { DisclosureNote } from "@/components/apply/disclosures";
import { useApplication } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";
import { PATH_RULES, SELECTABLE_PATHS, pathRule } from "@/lib/apply/rules";
import { pathSchema } from "@/lib/apply/schemas";
import type { IdentityPath } from "@/lib/types";

function PathOption({
  path,
  selected,
  onSelect,
}: {
  path: IdentityPath;
  selected: boolean;
  onSelect: (p: IdentityPath) => void;
}) {
  const t = useApplyT();
  const rule = PATH_RULES[path];
  return (
    <label
      className={`card-ufcu flex cursor-pointer items-start gap-3 border-2 p-4 transition-colors ${
        selected ? "border-ufcu-navy" : "border-ufcu-gray-line hover:border-ufcu-navy"
      }`}
    >
      <input
        type="radio"
        name="identity-path"
        className="mt-1"
        checked={selected}
        onChange={() => onSelect(path)}
      />
      <span className="flex flex-col gap-1">
        <span className="font-heading text-base font-semibold text-ufcu-navy">{t(rule.labelKey)}</span>
        <span className="text-sm text-ufcu-ink">{t(rule.subKey)}</span>
      </span>
    </label>
  );
}

function CheckList({ items, muted = false }: { items: string[]; muted?: boolean }) {
  const t = useApplyT();
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check className="mt-1 size-4 shrink-0 text-ufcu-navy" aria-hidden />
          <span className={`text-sm ${muted ? "text-ufcu-muted" : "text-ufcu-ink"}`}>{t(item)}</span>
        </li>
      ))}
    </ul>
  );
}

export function StepPath() {
  const { state, update, goTo } = useApplication();
  const t = useApplyT();
  const [formError, setFormError] = useState<string | undefined>();
  const rule = pathRule(state.path);

  const onContinue = () => {
    const parsed = pathSchema.safeParse({ path: state.path });
    if (!parsed.success) { setFormError("apply.err.path"); return; }
    setFormError(undefined);
    goTo(2);
  };
  return (
    <StepShell step={1} titleKey="apply.step1.title" subKey="apply.cip">
      <div className="flex flex-col gap-3">
        {SELECTABLE_PATHS.map((p) => (
          <PathOption key={p} path={p} selected={state.path === p} onSelect={(next) => update({ path: next })} />
        ))}
        <PathOption path="minor" selected={state.path === "minor"} onSelect={(next) => update({ path: next })} />
      </div>

      <div className="panel-gray flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h3>{t("apply.checklist.heading")}</h3>
          <CheckList items={rule.documents} />
        </div>
        <div className="flex flex-col gap-3">
          <h3>{t("apply.notes.title")}</h3>
          <CheckList items={rule.notes} muted />
        </div>
      </div>

      <DisclosureNote id="why_we_ask_cip" titleKey="apply.cip.title" subKey="apply.cip" />

      <StepNav onContinue={onContinue} formError={formError} />
    </StepShell>
  );
}
