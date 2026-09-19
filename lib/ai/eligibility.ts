// Identity-path rules. Inputs come from the conversation, never from a sensitive field:
// the assistant asks "do you have a Social Security Number yet?", never for the number itself.
import rules from "@/data/eligibility.json";
import type { EligibilityResult, IdentityPath } from "@/lib/types";

export interface EligibilityInput {
  hasSsn?: boolean;
  hasItin?: boolean;
  isUsPerson?: boolean;
  age?: number;
  affiliation?: string;
  isBusiness?: boolean;
}

const PATHS = rules.paths as Record<IdentityPath, { label: string; documents: string[]; notes: string[]; sourceUrls: string[] }>;

export function pathLabel(path: IdentityPath): string {
  return PATHS[path].label;
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

export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const path = choosePath(input);
  const base = PATHS[path];
  const documents = [...base.documents];
  const notes = [...base.notes, affiliationNote(input.affiliation)];
  const sourceUrls = [...base.sourceUrls];

  if (input.isBusiness) {
    documents.push(...rules.business.documents);
    notes.push(...rules.business.notes);
    for (const url of rules.business.sourceUrls) if (!sourceUrls.includes(url)) sourceUrls.push(url);
  }

  return { path, documents, notes, sourceUrls };
}
