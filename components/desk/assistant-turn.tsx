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
            className="panel-gray flex w-full items-center justify-between gap-3 text-left font-semibold text-ufcu-navy transition-colors hover:bg-ufcu-gray-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ufcu-navy"
            style={{ minHeight: "48px", padding: "0 1rem", borderRadius: "12px", fontSize: "0.9375rem" }}
            data-testid="more-information"
          >
            <span>{open ? t("desk.less") : t("desk.more", { n: rest.length })}</span>
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

// A resource that points at a page a product card already links to is the same answer twice.
// The card wins: it carries the fee, the minimum, and its own "Learn more" button.
function withoutProductPages(resources: Resource[], products: Product[]): Resource[] {
  if (products.length === 0) return resources;
  const urls = new Set(products.map((p) => p.sourceUrl));
  const names = products.map((p) => p.name.toLowerCase()).filter((n) => n.length > 0);
  return resources.filter(
    (resource) =>
      !urls.has(resource.sourceUrl) && !names.some((name) => resource.title.toLowerCase().includes(name)),
  );
}

export function AssistantTurn({
  parts,
  shownProducts,
  onOpenProduct,
}: {
  parts: { type: string }[];
  // Every product card this visit has shown, so a page one of them already links to is not
  // repeated as a resource card several turns later.
  shownProducts?: Product[];
  onOpenProduct?: (product: Product) => void;
}) {
  const t = useDeskT();
  const scripted = parts.some(isScriptedMarker);
  const text = noEmDash(parts.map(partText).filter(Boolean).join(" ").trim());

  // Resources are drawn after everything else the turn carried, so products keep the lead and
  // the single source card sits closest to the follow-ups. Order inside the list is the tool's
  // order, which is relevance descending, so index 0 is the primary.
  const seen = new Set<string>();
  const collected: Resource[] = [];
  for (const part of parts) {
    for (const resource of toolOutput<Resource[]>(part, "showResources") ?? []) {
      if (seen.has(resource.sourceUrl)) continue;
      seen.add(resource.sourceUrl);
      collected.push(resource);
    }
  }
  const resources = withoutProductPages(collected, shownProducts ?? []);

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
                  <ProductCard product={product} onOpen={onOpenProduct} />
                </div>
              ))}
            </div>
          );
        }

        const eligibility = toolOutput<EligibilityResult>(part, "checkEligibility");
        if (eligibility) return <EligibilityCard key={`eligibility-${i}`} result={eligibility} />;

        const prefill = toolOutput<ApplicationPrefill>(part, "startApplication");
        if (prefill) return <ContinueCard key={`prefill-${i}`} />;

        return null;
      })}

      <Resources resources={resources} />
    </div>
  );
}
