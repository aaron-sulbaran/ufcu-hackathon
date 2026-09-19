// The four Front Desk tools. Cards are the answer; prose is the introduction.
import { tool, type ToolSet } from "ai";
import { z } from "zod";
import { PRODUCTS, productById } from "@/lib/products";
import { retrieve, firstSentence } from "@/lib/ai/retrieve";
import { savingsReason } from "@/lib/ai/copy";
import { checkEligibility as runEligibility } from "@/lib/ai/eligibility";
import type { ApplicationPrefill, EligibilityResult, PersonaContext, ProductCard, ResourceCard } from "@/lib/types";

const identityPath = z.enum(["ssn", "itin", "foreign_status", "minor", "branch_assist"]);

export function recommendedProducts(
  picks: { id: string; reason: string }[],
  context: PersonaContext,
): ProductCard[] {
  const cards: ProductCard[] = [];
  const seen = new Set<string>();
  for (const pick of picks) {
    const product = productById(pick.id);
    if (!product || seen.has(product.id)) continue;
    seen.add(product.id);
    cards.push({ ...product, reason: pick.reason });
    if (cards.length === 3) break;
  }
  if (!seen.has("savings")) {
    const savings = productById("savings");
    if (savings) {
      if (cards.length === 3) cards.pop();
      cards.unshift({ ...savings, reason: savingsReason(context.lang) });
    }
  }
  if (cards.length === 0) {
    const fallback = PRODUCTS.filter((p) => p.audiences?.includes(context.audience)).slice(0, 2);
    return fallback.map((p) => ({ ...p, reason: p.tagline }));
  }
  return cards.slice(0, 3);
}

// The scripted opening for someone who arrived through the landing sentence rather than a
// persona chip: the catalog rows that match what they said, savings added by the helper.
export function suggestedFor(context: PersonaContext): ProductCard[] {
  const picks = PRODUCTS.filter((p) => p.audiences?.includes(context.audience) && p.goals?.includes(context.goal))
    .slice(0, 3)
    .map((p) => ({ id: p.id, reason: p.id === "savings" ? savingsReason(context.lang) : p.tagline }));
  return recommendedProducts(picks, context);
}

export function resourcesFor(query: string, context: PersonaContext): ResourceCard[] {
  return retrieve(query, context.audience, 3).map(({ doc }) => ({
    title: doc.title,
    summary: firstSentence(doc.body),
    sourceUrl: doc.url,
    tags: doc.tags.slice(0, 3),
  }));
}

export function buildTools(context: PersonaContext): ToolSet {
  return {
    recommendProducts: tool({
      description:
        "Show 1 to 3 UFCU product cards. Use this instead of describing products in prose. Give each pick a reason written for this person, drawn from what they told you. Savings is always included as the membership account.",
      inputSchema: z.object({
        picks: z
          .array(
            z.object({
              id: z.string().describe("Product id from the catalog, for example simply-u or credit-builder"),
              reason: z.string().describe("One sentence on why this fits this person"),
            }),
          )
          .min(1)
          .max(3),
      }),
      execute: async ({ picks }): Promise<ProductCard[]> => recommendedProducts(picks, context),
    }),

    showResources: tool({
      description:
        "Show up to 3 resource cards that link to real ufcu.org pages. Use this whenever the person asks how something works.",
      inputSchema: z.object({
        query: z
          .string()
          .describe("English keywords matching the page tags, for example: zelle ssn wire, even when you are replying in another language"),
      }),
      execute: async ({ query }): Promise<ResourceCard[]> => resourcesFor(query, context),
    }),

    checkEligibility: tool({
      description:
        "Work out which identity path this person is on and what documents it needs. Ask yes or no questions first, such as whether they have a Social Security Number yet. Never ask for the number itself.",
      inputSchema: z.object({
        hasSsn: z.boolean().optional().describe("True if the person says they have a Social Security Number"),
        hasItin: z.boolean().optional(),
        isUsPerson: z.boolean().optional().describe("False for someone on a student or work visa"),
        age: z.number().int().min(0).max(120).optional().describe("Only if the person volunteered it"),
        affiliation: z.string().optional().describe("School or employer, for example University of Texas at Austin"),
        isBusiness: z.boolean().optional().describe("True if they are opening a business account"),
      }),
      execute: async (input): Promise<EligibilityResult> => runEligibility(input, context),
    }),

    startApplication: tool({
      description:
        "Offer the secure application, prefilled with what you learned. Call this once, when the person has enough to decide. Do not repeat the offer; keep answering questions if they keep asking.",
      inputSchema: z.object({
        path: identityPath,
        products: z.array(z.string()).min(1).describe("Product ids, savings first"),
        firstName: z.string().optional(),
        preferredName: z.string().optional(),
        schoolAffiliation: z.string().optional(),
        notes: z.array(z.string()).default([]).describe("Short lines the application should carry over"),
        reasons: z
          .array(z.object({ id: z.string(), reason: z.string() }))
          .default([])
          .describe("The same one-line reason you gave for each recommended product, so the application can show it"),
      }),
      execute: async (input): Promise<ApplicationPrefill> => {
        const products = input.products.filter((id) => productById(id) !== undefined);
        const productReasons: Record<string, string> = {};
        for (const { id, reason } of input.reasons) if (products.includes(id)) productReasons[id] = reason;
        return {
          context,
          path: input.path,
          products,
          firstName: input.firstName,
          preferredName: input.preferredName,
          schoolAffiliation: input.schoolAffiliation,
          notes: input.notes,
          productReasons,
        };
      },
    }),
  };
}
