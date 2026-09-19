// Document checklists per identity path. Sourced from docs/07-personas.md, docs/10-competitor-switch.md
// (CIP: name, date of birth, address, identification number before an account opens) and the branch
// packet transcription (W-8BEN, government ID list, University Branch details).
import type { IdentityPath } from "@/lib/types";

export const BRANCH = {
  name: "University Branch",
  address: "2244 Guadalupe St, Austin, TX 78705",
  phone: "(512) 467-8080",
  hoursKey: "apply.branch.hours",
};

export const DISCLOSURES_URL = "https://ufcu.org/policies-legal/disclosures";

export interface PathRule {
  path: IdentityPath;
  labelKey: string;
  subKey: string;
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
      "A government photo ID: driver license, state ID, military ID, U.S. passport, or permanent resident card",
      "Your Social Security number",
      "Your Austin address (no P.O. boxes)",
    ],
    notes: [
      "Savings opens with $1 and is what makes you a member.",
      "Anyone can join UFCU. You do not have to be a UT student.",
    ],
  },
  itin: {
    path: "itin",
    labelKey: "apply.path.itin",
    subKey: "apply.path.itin.sub",
    documents: [
      "A government photo ID: passport, consular ID, or state ID",
      "Your ITIN letter or card",
      "Proof of your Austin address: lease, utility bill, or UT housing letter",
    ],
    notes: [
      "No SSN needed to open; you can add one later if you get one.",
      "Zelle requires an SSN. Wires and transfer services work in the meantime.",
    ],
  },
  foreign_status: {
    path: "foreign_status",
    labelKey: "apply.path.foreign_status",
    subKey: "apply.path.foreign_status.sub",
    documents: [
      "Your passport",
      "Your I-20 or DS-2019",
      "W-8BEN acknowledgment, which you check in step 2",
      "Proof of your Austin address: lease, utility bill, or UT housing letter",
    ],
    notes: [
      "No SSN needed to open; you can add an SSN or ITIN later.",
      "Zelle requires an SSN. Use a wire or an international transfer service for now.",
      "A new address often means a five-minute video call with a banker before the account opens.",
    ],
  },
  minor: {
    path: "minor",
    labelKey: "apply.path.minor",
    subKey: "apply.path.minor.sub",
    documents: [
      "Your school ID or state ID",
      "A parent or guardian, with their own government photo ID",
      "Your Social Security number",
    ],
    notes: [
      "Teen Checking covers ages 13 to 17.",
      "A parent or guardian signs with you at the University Branch, so this path finishes in person.",
    ],
  },
  branch_assist: {
    path: "branch_assist",
    labelKey: "apply.path.branch_assist",
    subKey: "apply.path.branch_assist.sub",
    documents: [
      "Whatever ID you have, even if it is expired or incomplete",
      "Anything with your Austin address on it",
    ],
    notes: [
      "A banker sorts the rest with you in person. Nothing here is a dead end.",
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

export const DEFAULT_PRODUCTS = ["savings", "simply-u"];
export const MEMBERSHIP_PRODUCT = "savings";
