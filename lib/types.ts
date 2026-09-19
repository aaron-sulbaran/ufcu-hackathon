// Shared contract for all lanes. Propose changes in the team chat before editing.
export type Audience =
  | "student" | "international_student" | "new_to_austin" | "switching_banks"
  | "business" | "retiree" | "other";
export type Goal = "checking" | "savings" | "build_credit" | "credit_card" | "loan" | "unsure";
export type Lang = "en" | "es" | "ko" | "pt" | "fr";
export type IdentityPath = "ssn" | "itin" | "foreign_status" | "minor" | "branch_assist";

export interface PersonaContext { audience: Audience; goal: Goal; lang: Lang; personaId?: string }

export interface ProductCard {
  id: string; name: string; tagline: string; minToOpen: string; monthlyFee: string;
  highlights: string[]; reason?: string; sourceUrl: string; audiences?: Audience[]; goals?: Goal[];
  kind: "checking" | "savings" | "money_market" | "certificate" | "loan" | "credit_card" | "business";
}

export interface ResourceCard { title: string; summary: string; sourceUrl: string; tags: string[] }

export interface EligibilityResult { path: IdentityPath; documents: string[]; notes: string[]; sourceUrls: string[] }

export interface ApplicationPrefill {
  context: PersonaContext; path: IdentityPath; products: string[];
  firstName?: string; preferredName?: string; email?: string; schoolAffiliation?: string; notes: string[];
}

export interface TrustCheck {
  id: "document" | "face" | "consistency" | "watchlist"; status: "pass" | "review" | "fail"; detail: string;
}
export interface TrustReadout { checks: TrustCheck[]; confidence: number; route: "instant" | "video" | "branch"; simulated: true }

export type Decision =
  | { kind: "approved" }
  | { kind: "needs_item"; item: string; how: string[] }
  | { kind: "not_yet"; reason: string; alternatives: ProductCard[] };

export interface NextStep { title: string; detail: string; sourceUrl?: string }

// { data, error } result at module boundaries
export type Result<T> = { data: T; error?: undefined } | { data?: undefined; error: string };
