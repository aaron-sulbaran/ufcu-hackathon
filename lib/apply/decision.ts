// MOCK: the decision. No core banking call, no credit pull. The persona's scripted decision wins only
// while the person keeps the path that persona was written for; otherwise the rules below decide.
import type { Audience, Decision, Goal, IdentityPath, Result, TrustReadout } from "@/lib/types";
import { findPersonaForPath } from "@/lib/apply/personas";
import { productById } from "@/lib/products";

// The item and the steps are i18n keys; the Decision card renders them in the current language.
// The branch name, address, and hours in those strings match BRANCH in lib/apply/rules.ts.
function ruleBased(path: IdentityPath, trust?: TrustReadout): Decision {
  if (path === "foreign_status" && trust?.route === "video") {
    return {
      kind: "needs_item",
      item: "apply.decision.video.item",
      how: ["apply.decision.video.how0", "apply.decision.video.how1"],
    };
  }
  if (trust?.route === "branch") {
    return {
      kind: "needs_item",
      item: "apply.decision.branch.item",
      how: ["apply.decision.branch.how0", "apply.decision.branch.how1"],
    };
  }
  return { kind: "approved" };
}

export async function decide(input: {
  path: IdentityPath;
  personaId?: string;
  trust?: TrustReadout;
}): Promise<Result<Decision>> {
  try {
    const persona = await findPersonaForPath(input.personaId, input.path);
    if (persona?.decision) return { data: persona.decision };
    return { data: ruleBased(input.path, input.trust) };
  } catch {
    return { data: ruleBased(input.path, input.trust) };
  }
}

// Per-product credit outcome, additive to the decision above: the persona's scripted decision still
// wins for the overall headline, and this block only speaks for the UFCU Visa when the person asked
// for one. Rule based, no credit pull. A first account usually has no history behind it yet, so the
// answer is an offer (Credit Builder Loan, secured Visa), never a refusal. The Credit Builder Loan
// is always approved; it exists for exactly this case.
export interface CreditAlternative {
  id: string;
  // When set, the card shows the catalog product's localized name instead of titleKey.
  productId?: string;
  titleKey: string;
  bodyKey: string;
  sourceUrl: string;
}

export type CreditOutcome =
  | { kind: "approved"; step: string }
  | { kind: "not_yet"; reason: string; alternatives: CreditAlternative[]; comeBack: string };

const CREDIT_CARD_PRODUCT = "credit-card";
const CREDIT_BUILDER_PRODUCT = "credit-builder";

export function creditOutcome(input: {
  products: string[];
  audience: Audience;
  goal: Goal;
  path: IdentityPath;
}): CreditOutcome | null {
  if (!input.products.includes(CREDIT_CARD_PRODUCT)) return null;
  const thinFile =
    input.audience === "student" ||
    input.audience === "international_student" ||
    input.goal === "build_credit" ||
    input.path === "foreign_status";
  if (!thinFile) return { kind: "approved", step: "apply.credit.approved.step" };
  return {
    kind: "not_yet",
    reason: "apply.credit.notyet.reason",
    alternatives: [
      {
        id: CREDIT_BUILDER_PRODUCT,
        productId: CREDIT_BUILDER_PRODUCT,
        titleKey: "apply.credit.alt.builder.title",
        bodyKey: "apply.credit.alt.builder.body",
        sourceUrl:
          productById(CREDIT_BUILDER_PRODUCT)?.sourceUrl ?? "https://ufcu.org/personal/loans/credit-builder",
      },
      {
        id: "secured-visa",
        titleKey: "apply.credit.alt.secured.title",
        bodyKey: "apply.credit.alt.secured.body",
        sourceUrl:
          productById(CREDIT_CARD_PRODUCT)?.sourceUrl ?? "https://ufcu.org/personal/credit-cards/compare",
      },
    ],
    comeBack: "apply.credit.comeback",
  };
}
