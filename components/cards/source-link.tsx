// Every card carries a visible link to the ufcu.org page it came from. Judges will click these.
import { useT } from "@/lib/i18n";

export function SourceLink({ href, label }: { href: string; label?: string }) {
  const t = useT();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-ufcu-secondary-darker underline underline-offset-2 hover:no-underline"
    >
      {label ?? t("desk.source")}
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}
