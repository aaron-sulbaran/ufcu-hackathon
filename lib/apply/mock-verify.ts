// MOCK: identity verification. Nothing is uploaded, scanned, or sent anywhere. The readout is either
// the persona's scripted one (data/personas.json) or the rule-based default below, so the demo is
// deterministic. In production these four checks map to a KYC vendor and the core.
import type { IdentityPath, Result, TrustCheck, TrustReadout } from "@/lib/types";
import { findPersona } from "@/lib/apply/personas";

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

export async function mockVerify(input: {
  path: IdentityPath;
  personaId?: string;
}): Promise<Result<TrustReadout>> {
  try {
    const persona = await findPersona(input.personaId);
    if (persona?.trust) return { data: persona.trust };
    return { data: ruleBased(input.path) };
  } catch {
    return { data: ruleBased(input.path) };
  }
}
