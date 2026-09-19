"use client";
// Resource card: one real ufcu.org page, one line about it, one link that opens in a new tab.
// The corpus is English; other languages read the title and summary from messages/content, keyed
// by the page URL. No tag pills: the slugs are corpus bookkeeping, not something a member needs.
// One card sits full width under the desk note; the rest live behind "More information".
import type { ResourceCard as Resource } from "@/lib/types";
import { SourceLink } from "@/components/cards/source-link";
import { usePersona } from "@/lib/context";
import { lookup } from "@/lib/i18n-core";

export function ResourceCard({ resource: raw }: { resource: Resource }) {
  const { context } = usePersona();
  const lang = context.lang;
  const resource =
    lang === "en"
      ? raw
      : {
          ...raw,
          title: lookup(lang, `resource.${raw.sourceUrl}.title`) ?? raw.title,
          summary: lookup(lang, `resource.${raw.sourceUrl}.summary`) ?? raw.summary,
        };
  return (
    <article className="card-ufcu flex flex-col gap-2 text-ufcu-ink" style={{ padding: "1.25rem" }}>
      <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700 }}>{resource.title}</h3>
      <p className="max-w-prose text-sm leading-snug text-ufcu-muted">{resource.summary}</p>
      <div className="mt-auto pt-1">
        <SourceLink href={resource.sourceUrl} />
      </div>
    </article>
  );
}
