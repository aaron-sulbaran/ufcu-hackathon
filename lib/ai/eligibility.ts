// Identity-path rules. Inputs come from the conversation, never from a sensitive field:
// the assistant asks "do you have a Social Security Number yet?", never for the number itself.
import rules from "@/data/eligibility.json";
import type { Audience, EligibilityResult, IdentityPath, Lang, PersonaContext } from "@/lib/types";

export interface EligibilityInput {
  hasSsn?: boolean;
  hasItin?: boolean;
  isUsPerson?: boolean;
  age?: number;
  affiliation?: string;
  isBusiness?: boolean;
}

interface PathRule {
  label: string;
  documents: string[];
  notes: string[];
  sourceUrls: string[];
  i18n?: Partial<Record<Exclude<Lang, "en">, { label: string; documents: string[]; notes: string[] }>>;
}

interface BusinessRule {
  documents: string[];
  notes: string[];
  sourceUrls: string[];
  i18n?: Partial<Record<Exclude<Lang, "en">, { documents: string[]; notes: string[] }>>;
}

const PATHS = rules.paths as Record<IdentityPath, PathRule>;
const BUSINESS = rules.business as BusinessRule;

export function pathLabel(path: IdentityPath): string {
  return PATHS[path].label;
}

// The path to assume before the conversation has established one, so the desk can hand off to
// the application on the first click. An international student is on the foreign-status path;
// everyone else starts on the Social Security Number path and the application can correct it.
export function defaultPathFor(audience: Audience): IdentityPath {
  return audience === "international_student" ? "foreign_status" : "ssn";
}

function localizedDocuments(path: IdentityPath, lang: Lang): string[] {
  const base = PATHS[path];
  if (lang === "en") return base.documents;
  return base.i18n?.[lang]?.documents ?? base.documents;
}

function localizedNotes(path: IdentityPath, lang: Lang): string[] {
  const base = PATHS[path];
  if (lang === "en") return base.notes;
  return base.i18n?.[lang]?.notes ?? base.notes;
}

function localizedBusinessDocuments(lang: Lang): string[] {
  if (lang === "en") return BUSINESS.documents;
  return BUSINESS.i18n?.[lang]?.documents ?? BUSINESS.documents;
}

function localizedBusinessNotes(lang: Lang): string[] {
  if (lang === "en") return BUSINESS.notes;
  return BUSINESS.i18n?.[lang]?.notes ?? BUSINESS.notes;
}

function choosePath(input: EligibilityInput): IdentityPath {
  const { hasSsn, hasItin, isUsPerson, age } = input;
  if (typeof age === "number" && age < 13) return "branch_assist";
  if (typeof age === "number" && age < 18) return hasSsn === false ? "branch_assist" : "minor";
  if (hasSsn) return "ssn";
  if (hasItin) return "itin";
  if (isUsPerson === false) return "foreign_status";
  if (isUsPerson === true) return "ssn";
  return "branch_assist";
}

function affiliationNote(affiliation?: string): string {
  const list = rules.affiliations as string[];
  if (!affiliation) return rules.accRoute.note;
  const match = list.find(
    (a) => a.toLowerCase() === affiliation.toLowerCase() || a.toLowerCase().includes(affiliation.toLowerCase()),
  );
  return match ? `You qualify for membership through ${match}.` : rules.accRoute.note;
}

export function checkEligibility(input: EligibilityInput, context?: PersonaContext): EligibilityResult {
  const path = choosePath(input);
  const base = PATHS[path];
  const lang: Lang = context?.lang ?? "en";
  const documents = [...localizedDocuments(path, lang)];
  const notes = [...localizedNotes(path, lang), affiliationNote(input.affiliation)];
  const sourceUrls = [...base.sourceUrls];

  if (input.isBusiness) {
    documents.push(...localizedBusinessDocuments(lang));
    notes.push(...localizedBusinessNotes(lang));
    for (const url of rules.business.sourceUrls) if (!sourceUrls.includes(url)) sourceUrls.push(url);
  }

  return { path, documents, notes, sourceUrls };
}
