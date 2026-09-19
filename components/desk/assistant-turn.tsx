"use client";
// A desk turn is a short note with a label, then cards. No bubbles: this is a front desk,
// not a chat app. The first sentence leads in Montserrat, the rest is Inter body copy.
import { useState, type ReactNode } from "react";
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
    <div className="border-l-2 border-ufcu-gray-line pl-4">
      <p className="mb-1.5 text-sm font-semibold text-ufcu-navy">{t("desk.label")}</p>
      {lead && (
        <p className="max-w-prose font-heading text-[1.25rem] font-semibold leading-snug text-ufcu-navy">
          {lead}
        </p>
      )}
      {rest && <p className="mt-1.5 max-w-prose leading-relaxed text-ufcu-ink">{rest}</p>}
      {children}
    </div>
  );
}

// The live model still emits an em dash now and then despite the instruction not to. The rule
// is a house style rule, so it is enforced where the text is drawn rather than in the stream.
function noEmDash(text: string): string {
  return text.replace(/\s*—\s*/g, ", ");
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`size-3.5 shrink-0 fill-current transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M8 11 2.5 5.5 3.56 4.44 8 8.88l4.44-4.44L13.5 5.5 8 11Z" />
    </svg>
  );
}

// One answer at a time. The best page is a full width card under the note; anything else the
// turn carried waits behind a disclosure, so a question never returns a wall of boxes.
function Resources({ resources }: { resources: Resource[] }) {
  const t = useDeskT();
  const [open, setOpen] = useState(false);
  if (resources.length === 0) return null;
  const [primary, ...rest] = resources;
  return (
    <div className="space-y-3">
      <ResourceCard resource={primary} />
      {rest.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ufcu-link no-underline hover:underline"
          >
            {t("desk.more", { n: rest.length })}
            <Chevron open={open} />
          </button>
          {open && (
            <div className="space-y-3">
              {rest.map((resource) => (
                <ResourceCard key={resource.sourceUrl} resource={resource} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AssistantTurn({
  parts,
  selected,
  onToggleProduct,
}: {
  parts: { type: string }[];
  selected?: ReadonlySet<string>;
  onToggleProduct?: (product: Product) => void;
}) {
  const t = useDeskT();
  const scripted = parts.some(isScriptedMarker);
  const text = noEmDash(parts.map(partText).filter(Boolean).join(" ").trim());

  // Resources are drawn after everything else the turn carried, so products keep the lead and
  // the single source card sits closest to the follow-ups. Order inside the list is the tool's
  // order, which is relevance descending, so index 0 is the primary.
  const seen = new Set<string>();
  const resources: Resource[] = [];
  for (const part of parts) {
    for (const resource of toolOutput<Resource[]>(part, "showResources") ?? []) {
      if (seen.has(resource.sourceUrl)) continue;
      seen.add(resource.sourceUrl);
      resources.push(resource);
    }
  }

  return (
    <div className="space-y-4">
      {scripted && (
        <span className="inline-block rounded-full bg-ufcu-gray-panel px-2.5 py-0.5 text-xs font-semibold text-ufcu-navy">
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
                  <ProductCard
                    product={product}
                    selected={selected?.has(product.id) ?? false}
                    onToggle={onToggleProduct}
                  />
                </div>
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

      <Resources resources={resources} />
    </div>
  );
}
