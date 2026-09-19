"use client";
// Resource card: one real ufcu.org page, one line about it, one link that opens in a new tab.
import type { ResourceCard as Resource } from "@/lib/types";
import { SourceLink } from "@/components/cards/source-link";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-ufcu-primary-subtle bg-white p-4 text-ufcu-primary shadow-sm">
      <h3 className="font-heading text-base leading-tight">{resource.title}</h3>
      <p className="text-sm leading-snug text-muted-foreground">{resource.summary}</p>
      {resource.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {resource.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-ufcu-primary-subtle px-2 py-0.5 text-xs font-medium text-ufcu-primary"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      <SourceLink href={resource.sourceUrl} />
    </article>
  );
}
