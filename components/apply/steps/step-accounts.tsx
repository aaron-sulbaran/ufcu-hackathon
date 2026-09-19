"use client";
// Step 4: the bundle the conversation put together, opened in one pass.
import { useState } from "react";
import { StepNav, StepShell } from "@/components/apply/step-shell";
import { BundleCard } from "@/components/apply/bundle-card";
import { Disclosures } from "@/components/apply/disclosures";
import { useApplication } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";
import { MEMBERSHIP_PRODUCT } from "@/lib/apply/rules";
import { accountsSchema, fieldErrors, type FieldErrors } from "@/lib/apply/schemas";
import { productById } from "@/lib/products";

export function StepAccounts() {
  const t = useApplyT();
  const { state, setAccounts, goTo } = useApplication();
  const [errors, setErrors] = useState<FieldErrors>({});
  const accounts = state.accounts;

  const offered = Array.from(
    new Set([MEMBERSHIP_PRODUCT, ...(state.prefill?.products ?? []), ...accounts.products]),
  );

  const toggle = (id: string) => {
    if (id === MEMBERSHIP_PRODUCT) return;
    const next = accounts.products.includes(id)
      ? accounts.products.filter((p) => p !== id)
      : [...accounts.products, id];
    setAccounts({ products: next });
  };

  const onContinue = () => {
    const parsed = accountsSchema(state.path).safeParse(accounts);
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); return; }
    setErrors({});
    goTo(5);
  };

  return (
    <StepShell step={4} titleKey="apply.step4.title" subKey="apply.accounts.sub">
      <div className="flex flex-col gap-3">
        {offered.map((id) => {
          const product = productById(id);
          if (!product) return null;
          return (
            <BundleCard
              key={id}
              product={product}
              reason={state.prefill?.productReasons?.[id] ?? product.reason}
              locked={id === MEMBERSHIP_PRODUCT}
              included={accounts.products.includes(id)}
              onToggle={() => toggle(id)}
            />
          );
        })}
        {errors.products && <p className="text-xs text-destructive">{t(errors.products)}</p>}
      </div>

      <Disclosures path={state.path} values={accounts} errors={errors} onChange={setAccounts} />

      <StepNav onContinue={onContinue} />
    </StepShell>
  );
}
