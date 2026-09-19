// The checklist under the decision. Persona next steps win when there are any; otherwise these rules
// build the list from the audience, the goal, and the identity path. Every URL is a real ufcu.org page.
import type { Audience, Goal, IdentityPath, NextStep } from "@/lib/types";
import { findPersona } from "@/lib/apply/personas";
import { lacksSsn } from "@/lib/apply/rules";

// TODO(lane A): supply the real direct deposit page; this is the open-account page for now.
const URL_DEPOSIT = "https://ufcu.org/open-account";
const URL_DIGITAL = "https://ufcu.org/resources/member-services/banking/mobile";
const URL_ATMS = "https://ufcu.org/locations/fee-free-atms";
const URL_ZELLE = "https://ufcu.org/resources/member-services/banking/zelle";
const URL_CREDIT = "https://ufcu.org/personal/loans/credit-builder";

const step = (title: string, detail: string, sourceUrl?: string): NextStep => ({ title, detail, sourceUrl });

export function buildNextSteps(input: {
  audience: Audience;
  goal: Goal;
  path: IdentityPath;
}): NextStep[] {
  const { audience, goal, path } = input;
  const steps: NextStep[] = [];

  if (audience === "switching_banks") {
    steps.push(step("apply.next.switch.deposit.title", "apply.next.switch.deposit.detail", URL_DEPOSIT));
    steps.push(step("apply.next.digital.title", "apply.next.digital.detail", URL_DIGITAL));
    steps.push(step("apply.next.switch.autopay.title", "apply.next.switch.autopay.detail"));
    steps.push(step("apply.next.switch.keep.title", "apply.next.switch.keep.detail"));
    steps.push(step("apply.next.switch.close.title", "apply.next.switch.close.detail"));
  } else {
    steps.push(step("apply.next.deposit.title", "apply.next.deposit.detail", URL_DEPOSIT));
    steps.push(step("apply.next.digital.title", "apply.next.digital.detail", URL_DIGITAL));
  }

  steps.push(step("apply.next.atm.title", "apply.next.atm.detail", URL_ATMS));

  if (lacksSsn(path)) steps.push(step("apply.next.zelle.title", "apply.next.zelle.detail", URL_ZELLE));
  if (goal === "build_credit") steps.push(step("apply.next.credit.title", "apply.next.credit.detail", URL_CREDIT));

  return steps;
}

export async function nextStepsFor(input: {
  audience: Audience;
  goal: Goal;
  path: IdentityPath;
  personaId?: string;
}): Promise<NextStep[]> {
  try {
    const persona = await findPersona(input.personaId);
    if (persona?.nextSteps?.length) return persona.nextSteps;
  } catch {
    // fall through to the rules
  }
  return buildNextSteps(input);
}
