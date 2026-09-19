// Document checklists per identity path. Sourced from docs/07-personas.md, docs/10-competitor-switch.md
// (CIP: name, date of birth, address, identification number before an account opens) and the branch
// packet transcription (W-8BEN, government ID list, University Branch details).
import type { IdentityPath } from "@/lib/types";

// One source for the branch schedule: the branch packet transcription. Every screen reads BRANCH.hours.
export const BRANCH = {
  name: "University Branch",
  address: "2244 Guadalupe St, Austin, TX 78705",
  phone: "(512) 467-8080",
  hours: "Monday to Friday, 10 AM to 4 PM",
};

export const DISCLOSURES_URL = "https://ufcu.org/policies-legal/disclosures";

export interface PathRule {
  path: IdentityPath;
  labelKey: string;
  subKey: string;
  // Translation keys (resolved through useApplyT()), not literal English. Keep entries in this
  // documented order; it drives the checklist rendering in step 1 and the review summary.
  documents: string[];
  notes: string[];
}

// The four paths a person picks between in step 1. branch_assist is reachable from prefill only.
export const PATH_RULES: Record<IdentityPath, PathRule> = {
  ssn: {
    path: "ssn",
    labelKey: "apply.path.ssn",
    subKey: "apply.path.ssn.sub",
    documents: [
      "apply.doc.gov_id",
      "apply.doc.ssn",
      "apply.doc.address",
    ],
    notes: [
      "apply.note.savings_member",
      "apply.note.anyone_can_join",
    ],
  },
  itin: {
    path: "itin",
    labelKey: "apply.path.itin",
    subKey: "apply.path.itin.sub",
    documents: [
      "apply.doc.gov_id_itin",
      "apply.doc.itin",
      "apply.doc.address_proof",
    ],
    notes: [
      "apply.note.no_ssn_needed",
      "apply.note.zelle_ssn",
    ],
  },
  foreign_status: {
    path: "foreign_status",
    labelKey: "apply.path.foreign_status",
    subKey: "apply.path.foreign_status.sub",
    documents: [
      "apply.doc.passport",
      "apply.doc.i20",
      "apply.doc.w8ben",
      "apply.doc.address_proof",
    ],
    notes: [
      "apply.note.no_ssn_needed_later",
      "apply.note.zelle_ssn_intl",
      "apply.note.new_address_video",
    ],
  },
  minor: {
    path: "minor",
    labelKey: "apply.path.minor",
    subKey: "apply.path.minor.sub",
    documents: [
      "apply.doc.school_id",
      "apply.doc.guardian",
      "apply.doc.ssn",
    ],
    notes: [
      "apply.note.teen_checking",
      "apply.note.guardian_signs",
    ],
  },
  branch_assist: {
    path: "branch_assist",
    labelKey: "apply.path.branch_assist",
    subKey: "apply.path.branch_assist.sub",
    documents: [
      "apply.doc.any_id",
      "apply.doc.any_address",
    ],
    notes: [
      "apply.note.banker_sorts",
    ],
  },
};

export const SELECTABLE_PATHS: IdentityPath[] = ["ssn", "itin", "foreign_status"];

export function pathRule(path: IdentityPath): PathRule {
  return PATH_RULES[path] ?? PATH_RULES.ssn;
}

export function needsW8Ben(path: IdentityPath): boolean {
  return path === "foreign_status";
}

export function needsEnrollmentDoc(path: IdentityPath): boolean {
  return path === "foreign_status";
}

// No SSN on file means no Zelle, per the corpus and the branch packet.
export function lacksSsn(path: IdentityPath): boolean {
  return path === "foreign_status" || path === "itin";
}

// MOCK: a fixed set of banker slots so the demo is identical every run.
export const VIDEO_SLOTS = ["10:30 AM", "1:15 PM", "3:45 PM"];

// Courtesy Pay is not offered on Simply U, so the disclosure only shows for the other checking accounts.
export const COURTESY_PAY_PRODUCTS = ["free-checking", "plus-checking"];

export function offersCourtesyPay(products: string[]): boolean {
  return products.some((id) => COURTESY_PAY_PRODUCTS.includes(id));
}

export const DEFAULT_PRODUCTS = ["savings", "simply-u"];
export const MEMBERSHIP_PRODUCT = "savings";
