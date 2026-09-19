"use client";
// An assistant turn is mostly cards. Text is the one or two sentences that introduce them.
import type { ApplicationPrefill, EligibilityResult, ProductCard as Product, ResourceCard as Resource } from "@/lib/types";
import { ProductCard } from "@/components/cards/product-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { EligibilityCard } from "@/components/cards/eligibility-card";
import { ContinueCard } from "@/components/desk/continue-card";
import { isScriptedMarker, partText, toolOutput } from "@/components/desk/tool-output";
import { useT } from "@/lib/i18n";

export function AssistantTurn({ parts }: { parts: { type: string }[] }) {
  const t = useT();
  const scripted = parts.some(isScriptedMarker);

  return (
    <div className="space-y-3">
      {scripted && (
        <span className="inline-block rounded-full bg-ufcu-accent-subtle px-2.5 py-0.5 text-xs font-semibold text-ufcu-accent-darkest">
          {t("desk.offline")}
        </span>
      )}

      {parts.map((part, i) => {
        const text = partText(part);
        if (text && text.trim().length > 0) {
          return (
            <p
              key={`text-${i}`}
              className="max-w-prose rounded-2xl rounded-tl-sm bg-ufcu-secondary-subtle px-4 py-3 leading-relaxed text-ufcu-primary"
            >
              {text}
            </p>
          );
        }

        const products = toolOutput<Product[]>(part, "recommendProducts");
        if (products) {
          return (
            <div key={`products-${i}`} className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="w-64 shrink-0 snap-start sm:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          );
        }

        const resources = toolOutput<Resource[]>(part, "showResources");
        if (resources) {
          return (
            <div key={`resources-${i}`} className="grid gap-3 sm:grid-cols-2">
              {resources.map((resource) => (
                <ResourceCard key={resource.sourceUrl} resource={resource} />
              ))}
            </div>
          );
        }

        const eligibility = toolOutput<EligibilityResult>(part, "checkEligibility");
        if (eligibility) return <EligibilityCard key={`eligibility-${i}`} result={eligibility} />;

        const prefill = toolOutput<ApplicationPrefill>(part, "startApplication");
        if (prefill) return <ContinueCard key={`prefill-${i}`} prefill={prefill} />;

        return null;
      })}
    </div>
  );
}
