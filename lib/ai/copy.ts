// Server-side copy that reaches the person directly: the forced savings reason and the
// scripted lines. Keyed by language so a Korean or Spanish turn never carries English.
import type { Lang } from "@/lib/types";

type ByLang = Record<Lang, string>;

function pick(table: ByLang, lang: Lang): string {
  return table[lang] ?? table.en;
}

const SAVINGS_REASON: ByLang = {
  en: "Your membership account. Every UFCU relationship opens with it, for $1.",
  es: "Su cuenta de membresia. Toda relacion con UFCU empieza aqui, con $1.",
  ko: "회원 자격을 만드는 계좌입니다. 모든 UFCU 계좌가 여기에서 시작하고, $1로 열립니다.",
  pt: "A sua conta de associacao. Toda relacao com a UFCU comeca aqui, com $1.",
  fr: "Votre compte de membre. Toute relation avec UFCU commence ici, avec $1.",
};

const SCRIPTED_INTRO: ByLang = {
  en: "I am working from what I already know about UFCU right now. Here is what usually fits.",
  es: "Ahora mismo trabajo con lo que ya se de UFCU. Esto es lo que suele encajar.",
  ko: "지금은 이미 알고 있는 UFCU 정보로 안내드립니다. 보통 이 조합이 잘 맞습니다.",
  pt: "Agora estou usando o que ja sei sobre a UFCU. Normalmente isto encaixa.",
  fr: "Je travaille avec ce que je sais deja sur UFCU. Voici ce qui convient en general.",
};

const SCRIPTED_HELP: ByLang = {
  en: "Here are the ufcu.org pages that answer that.",
  es: "Estas son las paginas de ufcu.org que responden eso.",
  ko: "해당 내용을 다루는 ufcu.org 페이지입니다.",
  pt: "Estas sao as paginas de ufcu.org que respondem isso.",
  fr: "Voici les pages ufcu.org qui repondent a cela.",
};

export const savingsReason = (lang: Lang) => pick(SAVINGS_REASON, lang);
export const scriptedIntro = (lang: Lang) => pick(SCRIPTED_INTRO, lang);
export const scriptedHelp = (lang: Lang) => pick(SCRIPTED_HELP, lang);
