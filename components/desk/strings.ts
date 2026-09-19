"use client";
// Lane A owns these strings until the captain merges them into messages/en.json.
// useDeskT() asks the shared dictionary first and falls back to the table below, so the
// Front Desk keeps working before and after the merge (same pattern as lib/apply/strings.ts).
import { useT } from "@/lib/i18n";

export const DESK_STRINGS: Record<string, string> = {
  "desk.label": "Front Desk",
  "desk.placeholder2": "Ask the desk anything",

  "desk.visit": "Your visit so far",
  "desk.visit.title": "Your Visit So Far",
  "desk.visit.empty": "This fills in as we talk.",
  "desk.visit.show": "Show",
  "desk.visit.hide": "Hide",
  "desk.visit.who": "Who you are",
  "desk.visit.bundle": "What we put together",
  "desk.visit.bring": "What to bring",
  "desk.visit.ready": "Ready to continue",

  "desk.sentence": "I'm {audience} and I want {goal}.",
  "desk.sentence.unsure": "I'm {audience} and I'm not sure what I need yet.",

  "desk.secure.note": "Nothing sensitive was typed here; the rest happens on the secure page.",
  "desk.receipt.name": "Name",
  "desk.receipt.path": "Path",
  "desk.receipt.products": "Accounts",

  "desk.promo.title": "Ready to open your accounts?",
  "desk.ready": "Ready to become a member?",
  "desk.become": "Become a member",
  "desk.quick.open": "I want to open an account",

  // One source card is shown up front; the rest of the turn's pages sit behind this.
  "desk.more": "More information ({n})",
  "desk.less": "Less information",

  "desk.error": "That did not go through.",
  "desk.retry": "Try again",

  "card.opensWith": "Opens with",
  "card.monthlyFee": "Monthly fee",
  "card.path": "Your path",
  "card.bring": "What to bring",
  "card.open": "Open this account",
  // Every account card names the account on its own button, so a screen of cards reads as a
  // row of distinct choices rather than the same sentence three times.
  "card.open.named": "Open a {name} account",
  "card.open.business.named": "Open a {name}",
  "card.start.named": "Start the {name}",
  "card.apply.named": "Apply for the {name}",
  "card.learn": "Learn more about {name}",
  "card.open.checking": "Open a checking account",
  "card.open.savings": "Open a savings account",
  "card.open.credit_card": "Apply for this card",
  "card.open.loan": "Start this loan",
  "card.open.business": "Open a business account",
  "card.open.money_market": "Open a money market account",
  "card.open.certificate": "Open a certificate",
  "card.included": "Included with membership",
};

function fill(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  let out = text;
  for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

export function useDeskT() {
  const t = useT();
  return (key: string, vars?: Record<string, string | number>) => {
    const shared = t(key, vars);
    if (shared !== key) return shared;
    const local = DESK_STRINGS[key];
    return local ? fill(local, vars) : fill(key, vars);
  };
}

// The first sentence of a desk note leads in Montserrat; the rest is Inter body copy.
// Handles the Korean full stop as well as the Latin terminators.
export function splitFirstSentence(text: string): [string, string] {
  const match = /[.!?。！？](\s|$)/.exec(text);
  if (!match) return [text, ""];
  const cut = match.index + 1;
  return [text.slice(0, cut).trim(), text.slice(cut).trim()];
}
