// MOCK: the decision. No core banking call, no credit pull. The persona's scripted decision wins only
// while the person keeps the path that persona was written for; otherwise the rules below decide.
import type { Decision, IdentityPath, Result, TrustReadout } from "@/lib/types";
import { findPersonaForPath } from "@/lib/apply/personas";
import { BRANCH } from "@/lib/apply/rules";

function ruleBased(path: IdentityPath, trust?: TrustReadout): Decision {
  if (path === "foreign_status" && trust?.route === "video") {
    return {
      kind: "needs_item",
      item: "a five-minute video call with a banker to confirm your passport",
      how: [
        "Pick one of the times on the verification step and stay on this page.",
        `Or walk into the ${BRANCH.name} at ${BRANCH.address}, ${BRANCH.hours}.`,
      ],
    };
  }
  if (trust?.route === "branch") {
    return {
      kind: "needs_item",
      item: "a signature in person",
      how: [
        `Bring your documents to the ${BRANCH.name} at ${BRANCH.address}, ${BRANCH.hours}.`,
        `Call ${BRANCH.phone} first if you want to know what to bring.`,
      ],
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
