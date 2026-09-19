// The checklist under the decision. Persona next steps win when there are any; otherwise these rules
// build the list from the audience, the goal, and the identity path. Every URL is a real ufcu.org page.
import type { Audience, Goal, IdentityPath, NextStep } from "@/lib/types";
import { findPersonaForPath } from "@/lib/apply/personas";
import { lacksSsn } from "@/lib/apply/rules";

const URL_FORMS = "https://ufcu.org/resources/tools/forms";
const URL_CHECKING = "https://ufcu.org/personal/checking/overview";
const URL_DIGITAL = "https://ufcu.org/resources/member-services/banking/mobile";
const URL_ATMS = "https://ufcu.org/locations/fee-free-atms";
const URL_ZELLE = "https://ufcu.org/resources/member-services/banking/zelle";
const URL_CREDIT = "https://ufcu.org/personal/loans/credit-builder";

const step = (title: string, detail: string, sourceUrl?: string): NextStep => ({ title, detail, sourceUrl });

// The campus ATM list only helps someone who is on campus.
const ON_CAMPUS: Audience[] = ["student", "international_student"];

// The four moves that make a switch survivable. Rendered under their own heading by NextSteps.
export function switchKit(): NextStep[] {
  return [
    step("apply.next.switch.deposit.title", "apply.next.switch.deposit.detail", URL_FORMS),
    step("apply.next.switch.autopay.title", "apply.next.switch.autopay.detail", URL_CHECKING),
    step("apply.next.switch.keep.title", "apply.next.switch.keep.detail", URL_CHECKING),
    step("apply.next.switch.close.title", "apply.next.switch.close.detail", URL_FORMS),
  ];
}

const MOVING_WORDS = /\b(switch|switching|moving|move) (bank|banks|my bank|accounts)\b/i;

export function isSwitching(audience: Audience, notes?: string[]): boolean {
  if (audience === "switching_banks") return true;
  return Boolean(notes?.some((n) => MOVING_WORDS.test(n)));
}

export function buildNextSteps(input: {
  audience: Audience;
  goal: Goal;
  path: IdentityPath;
  notes?: string[];
}): NextStep[] {
  const { audience, goal, path, notes } = input;
  const steps: NextStep[] = [];
  const switching = isSwitching(audience, notes);

  if (!switching) steps.push(step("apply.next.deposit.title", "apply.next.deposit.detail", URL_FORMS));
  steps.push(step("apply.next.digital.title", "apply.next.digital.detail", URL_DIGITAL));

  steps.push(
    ON_CAMPUS.includes(audience)
      ? step("apply.next.atm.title", "apply.next.atm.detail", URL_ATMS)
      : step("apply.next.atm.any.title", "apply.next.atm.any.detail", URL_ATMS),
  );

  if (lacksSsn(path)) steps.push(step("apply.next.zelle.title", "apply.next.zelle.detail", URL_ZELLE));
  if (goal === "build_credit") steps.push(step("apply.next.credit.title", "apply.next.credit.detail", URL_CREDIT));

  if (switching) steps.push(...switchKit());
  return steps;
}

export async function nextStepsFor(input: {
  audience: Audience;
  goal: Goal;
  path: IdentityPath;
  personaId?: string;
  notes?: string[];
}): Promise<NextStep[]> {
  try {
    const persona = await findPersonaForPath(input.personaId, input.path);
    if (persona?.nextSteps?.length) {
      // A persona who is moving banks still gets the kit, appended under its own heading.
      return isSwitching(input.audience, input.notes)
        ? [...persona.nextSteps, ...switchKit()]
        : persona.nextSteps;
    }
  } catch {
    // fall through to the rules
  }
  return buildNextSteps(input);
}
