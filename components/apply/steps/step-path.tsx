"use client";
// Step 1: which documents you have. Everything below follows from this choice.
import { useState } from "react";
import { FileCheck, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  compact = false,
}: {
  path: IdentityPath;
  selected: boolean;
  onSelect: (p: IdentityPath) => void;
  compact?: boolean;
}) {
  const t = useApplyT();
  const rule = PATH_RULES[path];
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-colors ${
        selected ? "border-ufcu-primary ring-2 ring-ufcu-primary-lighter" : "border-border hover:border-ufcu-primary-lighter"
      } ${compact ? "py-3" : ""}`}
    >
      <input
        type="radio"
        name="identity-path"
        className="mt-1 size-4 accent-[var(--ufcu-primary)]"
        checked={selected}
        onChange={() => onSelect(path)}
      />
      <span className="flex flex-col gap-1">
        <span className={compact ? "text-sm font-medium" : "font-heading text-lg leading-snug"}>{t(rule.labelKey)}</span>
        <span className="text-sm text-muted-foreground">{t(rule.subKey)}</span>
      </span>
    </label>
  );
}

export function StepPath() {
  const t = useApplyT();
  const { state, update, goTo } = useApplication();
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
        <PathOption
          path="minor"
          compact
          selected={state.path === "minor"}
          onSelect={(next) => update({ path: next })}
        />
      </div>

      <Card className="border-ufcu-primary-subtle bg-ufcu-primary-subtle/30">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
              <FileCheck className="size-4" aria-hidden />
              {t("apply.checklist.title")}
            </h2>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
              {rule.documents.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
              <Info className="size-4" aria-hidden />
              {t("apply.notes.title")}
            </h2>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {rule.notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>

      <DisclosureNote id="why_we_ask_cip" titleKey="apply.cip.title" subKey="apply.cip" />

      <StepNav onContinue={onContinue} formError={formError} />
    </StepShell>
  );
}
