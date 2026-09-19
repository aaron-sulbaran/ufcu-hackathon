// MOCK: the decision. No core banking call, no credit pull. The persona's scripted decision wins only
// while the person keeps the path that persona was written for; otherwise the rules below decide.
import type { Decision, IdentityPath, Result, TrustReadout } from "@/lib/types";
import { findPersonaForPath } from "@/lib/apply/personas";

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
