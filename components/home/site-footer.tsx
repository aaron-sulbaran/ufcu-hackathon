"use client";
// Navy footer with three short link columns into the real site, then the required disclosures.
// Headings and labels are dictionary keys.
import { useT } from "@/lib/i18n";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "nav.personal",
    links: [
      { label: "footer.checking", href: "https://ufcu.org/personal/checking" },
      { label: "footer.savings", href: "https://ufcu.org/personal/savings" },
      { label: "footer.cards", href: "https://ufcu.org/personal/credit-cards" },
      { label: "footer.loans", href: "https://ufcu.org/personal/loans" },
    ],
  },
  {
    heading: "nav.business",
    links: [
      { label: "footer.businessChecking", href: "https://ufcu.org/business/checking" },
      { label: "footer.businessLending", href: "https://ufcu.org/business/lending" },
      { label: "nav.locations", href: "https://ufcu.org/locations" },
    ],
  },
  {
    heading: "nav.resources",
    links: [
      { label: "footer.rates", href: "https://ufcu.org/rates" },
      { label: "footer.contact", href: "https://ufcu.org/about/contact-us" },
      { label: "footer.help", href: "https://ufcu.org/resources" },
    ],
  },
];

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="bg-ufcu-navy text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="font-heading text-sm font-bold tracking-wide text-white">{t(col.heading)}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer" className="text-white/90 hover:text-white">
                      {t(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-1 border-t border-white/20 pt-6 text-xs font-light text-white/80">
          <p>{t("common.ncua")} {t("nav.routing")} 314977405.</p>
          <p>{t("common.call")} | {t("common.branch")}</p>
        </div>
      </div>
    </footer>
  );
}
