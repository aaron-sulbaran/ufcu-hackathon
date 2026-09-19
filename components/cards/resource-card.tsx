"use client";
// Resource card: one real ufcu.org page, one line about it, one link that opens in a new tab.
// The corpus is English; other languages read the title and summary from messages/content, keyed
// by the page URL. The tags are the corpus's own English slugs, so they show in English only.
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
          tags: [],
        };
  return (
    <article className="card-ufcu flex flex-col gap-2 text-ufcu-ink" style={{ padding: "1.25rem" }}>
      <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700 }}>{resource.title}</h3>
      <p className="text-sm leading-snug text-ufcu-muted">{resource.summary}</p>
      {resource.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {resource.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-ufcu-gray-panel px-2.5 py-0.5 text-xs font-semibold text-ufcu-navy"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-1">
        <SourceLink href={resource.sourceUrl} />
      </div>
    </article>
  );
}
