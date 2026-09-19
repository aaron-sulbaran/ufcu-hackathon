"use client";
// A desk turn is a short note with a label, then cards. No bubbles: this is a front desk,
// not a chat app. The first sentence is set in the serif face, the rest is body copy.
import type { ReactNode } from "react";
import type { ApplicationPrefill, EligibilityResult, ProductCard as Product, ResourceCard as Resource } from "@/lib/types";
import { ProductCard } from "@/components/cards/product-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { EligibilityCard } from "@/components/cards/eligibility-card";
import { ContinueCard } from "@/components/desk/continue-card";
import { isScriptedMarker, partText, toolOutput } from "@/components/desk/tool-output";
import { splitFirstSentence, useDeskT } from "@/components/desk/strings";

export function DeskNote({ text, children }: { text?: string; children?: ReactNode }) {
  const t = useDeskT();
  const [lead, rest] = text ? splitFirstSentence(text) : ["", ""];
  return (
    <div className="border-l-2 border-ufcu-accent pl-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ufcu-accent-darker">{t("desk.label")}</p>
      {lead && (
        <p className="max-w-prose font-heading text-xl leading-snug text-ufcu-primary">{lead}</p>
      )}
      {rest && <p className="mt-1 max-w-prose leading-relaxed text-ufcu-primary">{rest}</p>}
      {children}
    </div>
  );
}

export function AssistantTurn({ parts }: { parts: { type: string }[] }) {
  const t = useDeskT();
  const scripted = parts.some(isScriptedMarker);
  const text = parts.map(partText).filter(Boolean).join(" ").trim();

  return (
    <div className="space-y-4">
      {scripted && (
        <span className="inline-block rounded-full bg-ufcu-accent-subtle px-2.5 py-0.5 text-xs font-semibold text-ufcu-accent-darkest">
          {t("desk.offline")}
        </span>
      )}

      {text.length > 0 && <DeskNote text={text} />}

      {parts.map((part, i) => {
        const products = toolOutput<Product[]>(part, "recommendProducts");
        if (products) {
          return (
            <div key={`products-${i}`} className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible">
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
