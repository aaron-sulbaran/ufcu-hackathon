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
  student: ["¿Cómo construyo crédito?", "¿Cómo configuro el depósito directo?", "¿Dónde están los cajeros del campus?"],
  international_student: ["¿Puedo abrir sin SSN?", "¿Puedo usar Zelle?", "¿Cómo recibo dinero del extranjero?"],
  new_to_austin: ["¿Qué cuenta corriente me conviene?", "¿Dónde está la sucursal más cercana?", "¿Cómo muevo mi depósito directo?"],
  switching_banks: ["¿Qué cambia si me cambio?", "¿Cómo muevo mi depósito directo?", "¿Mi dinero está asegurado?"],
  business: ["¿Qué documentos necesita una LLC?", "¿Necesito una cuenta personal primero?", "¿Cuánto cuesta la cuenta de negocio?"],
  retiree: ["¿Qué cuenta da más intereses?", "¿Puedo hablar con una persona?", "¿Dónde está la sucursal más cercana?"],
  other: ["¿Quién puede ser miembro?", "¿Cuenta corriente o de ahorros?", "¿Cuánto cuesta abrir una cuenta?"],
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

const PT: Record<Audience, Set3> = {
  student: ["Como construo crédito?", "Como configuro o depósito direto?", "Onde ficam os caixas eletrônicos do campus?"],
  international_student: ["Posso abrir conta sem SSN?", "Posso usar o Zelle?", "Como recebo dinheiro do meu país?"],
  new_to_austin: ["Qual conta corrente combina comigo?", "Onde fica a agência mais próxima?", "Como transfiro meu depósito direto?"],
  switching_banks: ["O que muda se eu trocar de banco?", "Como transfiro meu depósito direto?", "Meu dinheiro tem seguro?"],
  business: ["Quais documentos uma LLC precisa?", "Preciso de uma conta pessoal primeiro?", "Quanto custa a conta empresarial?"],
  retiree: ["Qual conta rende mais?", "Posso falar com uma pessoa?", "Onde fica a agência mais próxima?"],
  other: ["Quem pode se associar?", "Conta corrente ou poupança?", "Quanto custa abrir uma conta?"],
};

const FR: Record<Audience, Set3> = {
  student: ["Comment bâtir mon crédit ?", "Comment configurer le dépôt direct ?", "Où sont les distributeurs du campus ?"],
  international_student: ["Puis-je ouvrir un compte sans SSN ?", "Puis-je utiliser Zelle ?", "Comment recevoir de l'argent de mon pays ?"],
  new_to_austin: ["Quel compte courant me convient ?", "Où est l'agence la plus proche ?", "Comment transférer mon dépôt direct ?"],
  switching_banks: ["Qu'est-ce qui change si je change de banque ?", "Comment transférer mon dépôt direct ?", "Mon argent est-il assuré ?"],
  business: ["Quels documents pour une LLC ?", "Faut-il d'abord un compte personnel ?", "Combien coûte le compte professionnel ?"],
  retiree: ["Quel compte rapporte le plus ?", "Puis-je parler à quelqu'un ?", "Où est l'agence la plus proche ?"],
  other: ["Qui peut devenir membre ?", "Compte courant ou épargne ?", "Combien coûte l'ouverture d'un compte ?"],
};

const SETS: Record<Lang, Record<Audience, Set3>> = { en: EN, es: ES, ko: KO, pt: PT, fr: FR };

function setFor(lang: Lang, audience: Audience): Set3 {
  return (SETS[lang] ?? EN)[audience];
}

export function QuickReplies({
  lang,
  audience,
  onPick,
  disabled, lead, openLabel, onOpen }: {
  lang: Lang;
  audience: Audience;
  onPick: (text: string) => void;
  disabled?: boolean; lead?: string;
  // "I want to open an account" leads the row once the desk has said something. It is an
  // action, not a question: it goes straight to the application without a model call.
  openLabel?: string;
  onOpen?: () => void }) {
  const questions = lead ? [lead, ...setFor(lang, audience).slice(0, 2)] : setFor(lang, audience);
  return (
    <div className="flex flex-wrap gap-2">
      {openLabel && onOpen && (
        <button type="button" onClick={onOpen} className="btn btn-cta text-left">
          {openLabel}
        </button>
      )}
      {questions.map((q) => (
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
