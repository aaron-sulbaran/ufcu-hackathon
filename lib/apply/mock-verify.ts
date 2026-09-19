// MOCK: identity verification, run in two stages the way a large bank runs a step-up. Nothing is
// uploaded, scanned, or sent anywhere.
// Stage 1 checks the details the person already typed against the records a credit union has to
// check. Most people finish there. Stage 2 only runs when stage 1 cannot confirm everything, and
// asks for a document and a selfie instead of sending the person to a branch.
// The readout is either the persona's scripted one (data/personas.json) or the rule-based default
// below, so the demo is deterministic. In production these checks map to a KYC vendor and the core.
import type { IdentityPath, Result, TrustCheck, TrustReadout } from "@/lib/types";
import { findPersonaForPath } from "@/lib/apply/personas";

export type VerificationStage = "instant" | "stepup";

// The three rows stage 1 shows. They are not the four TrustCheck rows; stage 1 only looks at the
// details on file, so document authenticity and face match cannot appear here.
export interface StageOneRow {
  id: "consistency" | "watchlist" | "idNumber";
  labelKey: string;
  status: "pass" | "review";
}

export interface StageOneResult {
  stage: VerificationStage;
  // Present on the instant path only: stage 1 is the whole check, so the readout is ready now.
  trust?: TrustReadout;
}

const pass = (id: TrustCheck["id"], detail: string): TrustCheck => ({ id, status: "pass", detail });

function ruleBased(path: IdentityPath): TrustReadout {
  const checks: TrustCheck[] = [
    pass("document", "apply.detail.doc.ok"),
    pass("face", "apply.detail.face.ok"),
    pass("consistency", "apply.detail.consistency.ok"),
    pass("watchlist", "apply.detail.watchlist.ok"),
  ];
  if (path === "foreign_status") {
    checks[2] = { id: "consistency", status: "review", detail: "apply.detail.consistency.new" };
    return { checks, confidence: 82, route: "video", simulated: true };
  }
  if (path === "minor") {
    checks[2] = { id: "consistency", status: "review", detail: "apply.detail.minor" };
    return { checks, confidence: 88, route: "branch", simulated: true };
  }
  if (path === "branch_assist") {
    return { checks, confidence: 85, route: "branch", simulated: true };
  }
  return { checks, confidence: 90, route: "instant", simulated: true };
}

// A scripted persona decides its own stage: an instant route means stage 1 confirmed everything.
// Without a persona, only a foreign status or a minor needs the step-up.
export function stageFor(path: IdentityPath, personaRoute?: TrustReadout["route"]): VerificationStage {
  if (personaRoute) return personaRoute === "instant" ? "instant" : "stepup";
  if (path === "foreign_status" || path === "minor") return "stepup";
  return "instant";
}

// Pure, so the panel can redraw the same rows after a refresh without running stage 1 again.
export function stageOneRows(path: IdentityPath, stage: VerificationStage): StageOneRow[] {
  const confirmed = stage === "instant";
  const noTaxId = path === "foreign_status";
  return [
    {
      id: "consistency",
      labelKey: "apply.stage1.consistency",
      status: confirmed ? "pass" : "review",
    },
    { id: "watchlist", labelKey: "apply.stage1.watchlist", status: "pass" },
    {
      id: "idNumber",
      labelKey: noTaxId ? "apply.stage1.noTaxId" : "apply.stage1.idNumber",
      status: noTaxId ? "review" : "pass",
    },
  ];
}

export async function stageOne(input: {
  path: IdentityPath;
  personaId?: string;
}): Promise<Result<StageOneResult>> {
  try {
    const persona = await findPersonaForPath(input.personaId, input.path);
    const stage = stageFor(input.path, persona?.trust?.route);
    if (stage === "stepup") return { data: { stage } };
    return { data: { stage, trust: persona?.trust ?? ruleBased(input.path) } };
  } catch {
    const stage = stageFor(input.path);
    if (stage === "stepup") return { data: { stage } };
    return { data: { stage, trust: ruleBased(input.path) } };
  }
}

export async function mockVerify(input: {
  path: IdentityPath;
  personaId?: string;
}): Promise<Result<TrustReadout>> {
  try {
    const persona = await findPersonaForPath(input.personaId, input.path);
    if (persona?.trust) return { data: persona.trust };
    return { data: ruleBased(input.path) };
  } catch {
    return { data: ruleBased(input.path) };
  }
}
