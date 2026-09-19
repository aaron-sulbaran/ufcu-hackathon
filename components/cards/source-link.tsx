// Every card carries a visible link to the ufcu.org page it came from. Judges will click these.
// Teal like the site's body links, underlined only on hover.
import { useT } from "@/lib/i18n";

export function SourceLink({ href, label }: { href: string; label?: string }) {
  const t = useT();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ufcu-link no-underline hover:underline"
    >
      {label ?? t("desk.source")}
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0 fill-current">
        <path d="M9 2h5v5h-1.5V4.56L7.06 10 6 8.94 11.44 3.5H9V2Z" />
        <path d="M3 4h3.5v1.5H4.5v6h6V9.5H12V13H3V4Z" />
      </svg>
    </a>
  );
}
