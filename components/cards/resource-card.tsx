"use client";
// Resource card: one real ufcu.org page, one line about it, one link that opens in a new tab.
import type { ResourceCard as Resource } from "@/lib/types";
import { SourceLink } from "@/components/cards/source-link";

export function ResourceCard({ resource }: { resource: Resource }) {
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
