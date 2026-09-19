"use client";
// Read-back of steps 1 to 4 with an Edit link per section. The ID number is masked here on purpose.
import { useApplication } from "@/lib/apply/state";
import { useApplyT } from "@/lib/apply/strings";
import { pathRule } from "@/lib/apply/rules";
import { productById } from "@/lib/products";

// An SSN or ITIN keeps its familiar shape. Anything else (a passport number) shows its last three
// characters behind a generic prefix, so the mask never implies a format the value does not have.
function mask(value: string, ssnShape: boolean): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (ssnShape) {
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length >= 4) return `••• •• ${digits.slice(-4)}`;
  }
  return `${"•".repeat(Math.max(trimmed.length - 3, 3))}${trimmed.slice(-3)}`;
}

function Section({ titleKey, step, children }: { titleKey: string; step: number; children: React.ReactNode }) {
  const t = useApplyT();
  const { goTo } = useApplication();
  return (
    <div className="card-ufcu flex flex-col gap-3 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold text-ufcu-navy">{t(titleKey)}</h3>
        <button
          type="button"
          onClick={() => goTo(step)}
          className="text-sm font-semibold text-ufcu-link underline-offset-2 hover:underline"
        >
          {t("apply.review.edit")}
        </button>
      </div>
      {children}
    </div>
  );
}

export function ReviewSummary() {
  const t = useApplyT();
  const { state } = useApplication();
  const { about, accounts, verify, trust, path } = state;
  const rule = pathRule(path);
  const idValue =
    path === "itin" ? about.itin : path === "foreign_status" ? about.passportNumber : about.ssn;
  const names = accounts.products.map((id) => productById(id)?.name ?? id);
  const productNames =
    names.length > 1 ? `${names.slice(0, -1).join(", ")} ${t("apply.and")} ${names[names.length - 1]}` : names[0] ?? "";

  return (
    <div className="flex flex-col gap-3">
      <Section titleKey="apply.review.path" step={1}>
        <p className="text-sm font-semibold text-ufcu-navy">{t(rule.labelKey)}</p>
        <p className="text-sm text-ufcu-muted">{rule.documents.map((d) => t(d)).join(", ")}</p>
      </Section>

      <Section titleKey="apply.review.about" step={2}>
        <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          <div><dt className="inline text-ufcu-muted">{t("apply.review.name")}: </dt><dd className="inline">{about.firstName} {about.lastName}</dd></div>
          <div><dt className="inline text-ufcu-muted">{t("apply.f.dob")}: </dt><dd className="inline">{about.dob}</dd></div>
          <div><dt className="inline text-ufcu-muted">{t("apply.f.email")}: </dt><dd className="inline">{about.email}</dd></div>
          <div><dt className="inline text-ufcu-muted">{t("apply.f.phone")}: </dt><dd className="inline">{about.phone}</dd></div>
          <div className="sm:col-span-2"><dt className="inline text-ufcu-muted">{t("apply.f.street")}: </dt><dd className="inline">{about.street}, {about.city}, {about.state} {about.zip}</dd></div>
          <div><dt className="inline text-ufcu-muted">{t("apply.f.occupation")}: </dt><dd className="inline">{about.occupation}</dd></div>
          <div>
            <dt className="inline text-ufcu-muted">
              {t(path === "itin" ? "apply.f.itin" : path === "foreign_status" ? "apply.f.passport" : "apply.f.ssn")}:{" "}
            </dt>
            <dd className="inline">{mask(idValue, path !== "foreign_status")}</dd>
          </div>
        </dl>
        <p className="disclaimer text-ufcu-muted">{t("apply.review.memory")}</p>
      </Section>

      <Section titleKey="apply.review.verify" step={3}>
        {trust ? (
          <>
            <p className="text-sm font-semibold text-ufcu-navy">
              {t(
                state.verification?.stage === "stepup"
                  ? "apply.review.identity.stepup"
                  : "apply.review.identity.instant",
              )}
            </p>
            <p className="text-sm">
              {t("apply.trust.confidence", { n: trust.confidence })}. {t(`apply.route.${trust.route}.title`)}
              {verify.slot ? ` ${t("apply.route.video.picked", { time: verify.slot })}` : ""}
            </p>
          </>
        ) : (
          <p className="text-sm text-destructive">{t("apply.err.verify")}</p>
        )}
      </Section>

      <Section titleKey="apply.review.accounts" step={4}>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
          {accounts.products.map((id) => {
            const product = productById(id);
            if (!product) return <li key={id}>{id}</li>;
            return (
              <li key={id}>
                {product.name}: {t("apply.accounts.money", { min: product.minToOpen, fee: product.monthlyFee })}
              </li>
            );
          })}
        </ul>
        <p className="text-sm font-semibold text-ufcu-navy">{t("apply.accounts.applied", { names: productNames })}</p>
      </Section>
    </div>
  );
}
