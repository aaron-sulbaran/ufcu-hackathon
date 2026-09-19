"use client";
// Three short follow-ups, chosen for the audience, in the person's language.
// Kept here rather than in messages/ so lane C owns that file alone.
import type { Audience, Lang } from "@/lib/types";

type Set3 = [string, string, string];

const EN: Record<Audience, Set3> = {
  student: ["How do I build credit?", "How do I set up direct deposit?", "Where are the campus ATMs?"],
  international_student: ["Can I open without an SSN?", "Can I use Zelle?", "How do I receive money from home?"],
  new_to_austin: ["Which checking account fits me?", "Where is the nearest branch?", "How do I move my direct deposit?"],
  switching_banks: ["What changes if I switch?", "How do I move my direct deposit?", "Is my money insured?"],
  business: ["What documents does an LLC need?", "Do I need a personal account first?", "What does business checking cost?"],
  retiree: ["What earns the most interest?", "Can I talk to a person?", "Where is the nearest branch?"],
  other: ["Who can join UFCU?", "Checking or savings?", "What does it cost to open?"],
};

const ES: Record<Audience, Set3> = {
  student: ["Como construyo credito?", "Como configuro el deposito directo?", "Donde estan los cajeros del campus?"],
  international_student: ["Puedo abrir sin SSN?", "Puedo usar Zelle?", "Como recibo dinero del extranjero?"],
  new_to_austin: ["Que cuenta corriente me conviene?", "Donde esta la sucursal mas cercana?", "Como muevo mi deposito directo?"],
  switching_banks: ["Que cambia si me cambio?", "Como muevo mi deposito directo?", "Mi dinero esta asegurado?"],
  business: ["Que documentos necesita una LLC?", "Necesito una cuenta personal primero?", "Cuanto cuesta la cuenta de negocio?"],
  retiree: ["Que cuenta da mas intereses?", "Puedo hablar con una persona?", "Donde esta la sucursal mas cercana?"],
  other: ["Quien puede ser miembro?", "Cuenta corriente o de ahorros?", "Cuanto cuesta abrir una cuenta?"],
};

const KO: Record<Audience, Set3> = {
  student: ["신용은 어떻게 쌓나요?", "급여 자동이체는 어떻게 설정하나요?", "캠퍼스 ATM은 어디 있나요?"],
  international_student: ["SSN 없이 열 수 있나요?", "Zelle을 쓸 수 있나요?", "한국에서 송금받으려면 어떻게 하나요?"],
  new_to_austin: ["어떤 체킹 계좌가 맞을까요?", "가장 가까운 지점은 어디인가요?", "급여 이체를 옮기려면?"],
  switching_banks: ["은행을 옮기면 뭐가 달라지나요?", "급여 이체를 옮기려면?", "예금은 보호되나요?"],
  business: ["LLC에 필요한 서류는?", "개인 계좌가 먼저 필요한가요?", "비즈니스 체킹 비용은?"],
  retiree: ["이자가 가장 높은 계좌는?", "직원과 통화할 수 있나요?", "가장 가까운 지점은 어디인가요?"],
  other: ["누가 회원이 될 수 있나요?", "체킹과 세이빙스의 차이는?", "계좌 개설 비용은?"],
};

function setFor(lang: Lang, audience: Audience): Set3 {
  if (lang === "es") return ES[audience];
  if (lang === "ko") return KO[audience];
  return EN[audience];
}

export function QuickReplies({
  lang,
  audience,
  onPick,
  disabled, lead }: {
  lang: Lang;
  audience: Audience;
  onPick: (text: string) => void;
  disabled?: boolean; lead?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(lead ? [lead, ...setFor(lang, audience).slice(0, 2)] : setFor(lang, audience)).map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onPick(q)}
          className="btn btn-outline text-left"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
