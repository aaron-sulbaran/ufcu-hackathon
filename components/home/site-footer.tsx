"use client";
// Footer modeled on ufcu.org: an orange "Get in Touch" band, then a navy footer with four columns,
// a dotted rule, the legal row with social icons, and the partners line. Text is dictionary keys, so
// it follows the selected language; phone numbers, legal identifiers, and partner names stay literal.
import { useT } from "@/lib/i18n";
import { Facebook, Instagram, Linkedin, Youtube } from "@/components/home/social-icons";

const COLUMNS = [
  {
    title: "footer.hours.title",
    lines: ["footer.hours.weekdays", "footer.hours.sat"],
    links: [
      { label: "(512) 467-8080", href: "tel:+15124678080" },
      { label: "(800) 252-8311", href: "tel:+18002528311" },
    ],
    inline: true,
  },
  {
    title: "footer.work.title",
    links: [
      { label: "footer.careers", href: "https://ufcu.org/about/careers" },
      { label: "footer.aboutUs", href: "https://ufcu.org/about" },
    ],
  },
  {
    title: "footer.security.title",
    links: [
      { label: "footer.security.resources", href: "https://ufcu.org/resources/security-fraud" },
      { label: "footer.security.faqs", href: "https://ufcu.org/resources/faqs/security" },
    ],
  },
  {
    title: "footer.know.title",
    lines: ["footer.know.apy", "footer.know.apr", "footer.know.variable"],
    links: [
      { label: "footer.ncua", href: "https://ncua.gov" },
      { label: "footer.ehl", href: "https://ufcu.org/policies-legal/disclosures" },
    ],
    after: "NMLS ID #441215",
  },
];

const PARTNERS = [
  { label: "Credit Coach", href: "https://ufcu.org/resources" },
  { label: "GreenPath", href: "https://ufcu.org/resources" },
  { label: "Silvur", href: "https://ufcu.org/resources" },
  { label: "Zelle", href: "https://ufcu.org/resources/member-services/banking/zelle" },
];

const SOCIAL = [
  { label: "Facebook", href: "https://www.facebook.com/MyUFCU", Icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ufcu", Icon: Linkedin },
  { label: "YouTube", href: "https://www.youtube.com/user/universityfcu", Icon: Youtube },
  { label: "Instagram", href: "https://www.instagram.com/ufcu_tx/", Icon: Instagram },
];

const link = "text-white underline underline-offset-4 decoration-white/70 hover:decoration-white";

function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L1.5 3h6.4l4.4 5.9L17.5 3zm-1.1 16.2h1.7L6.7 4.7H4.9l11.5 14.5z" />
    </svg>
  );
}

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-16 text-white">
      <section className="bg-ufcu-cta">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-white">{t("footer.touch.title")}</h2>
            <p className="mt-2 text-white">{t("footer.touch.body")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="btn btn-outline-white" href="https://ufcu.org/about/contact-us" target="_blank" rel="noreferrer">{t("footer.appointment")}</a>
            <a className="btn btn-outline-white" href="https://ufcu.org/about/contact-us" target="_blank" rel="noreferrer">{t("footer.contact")}</a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ufcu-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[18%] -top-[10%] h-[140%] w-[70%] rounded-full border-[70px] border-white/5"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title} className="space-y-3">
                <h3 className="text-white">{t(col.title)}</h3>
                {col.lines?.map((l) => <p key={l} className="text-white">{t(l)}</p>)}
                <div className={col.inline ? "flex flex-wrap items-center gap-x-3" : "flex flex-col gap-2"}>
                  {col.links.map((l, i) => (
                    <span key={l.href + l.label} className="flex items-center gap-3">
                      {col.inline && i > 0 && <span className="text-white/60" aria-hidden>|</span>}
                      <a className={link} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{t(l.label)}</a>
                    </span>
                  ))}
                </div>
                {col.after && <p className="text-white">{col.after}</p>}
              </div>
            ))}
          </div>

          <div className="my-8 border-t border-dotted border-white/40" />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white">
              <span>&copy; 2026 UFCU PO Box 9350 Austin, TX 78766-9350</span>
              <span className="text-white/60" aria-hidden>|</span>
              <span>{t("footer.routing")} 314977405</span>
              <span className="text-white/60" aria-hidden>|</span>
              <a className={link} href="https://ufcu.org/privacy" target="_blank" rel="noreferrer">{t("footer.privacy")}</a>
              <span className="text-white/60" aria-hidden>|</span>
              <a className={link} href="https://ufcu.org/policies-legal/disclosures" target="_blank" rel="noreferrer">{t("footer.disclosures")}</a>
            </p>
            <div className="flex items-center gap-5">
              <a className="text-white hover:text-ufcu-secondary-lighter" href="https://www.facebook.com/MyUFCU" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook className="size-5" /></a>
              <a className="text-white hover:text-ufcu-secondary-lighter" href="https://x.com/ufcu" target="_blank" rel="noreferrer" aria-label="X"><XMark /></a>
              {SOCIAL.slice(1).map(({ label, href, Icon }) => (
                <a key={label} className="text-white hover:text-ufcu-secondary-lighter" href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon className="size-5" /></a>
              ))}
            </div>
          </div>

          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-white">
            <span>{t("footer.partners")}</span>
            {PARTNERS.map((p, i) => (
              <span key={p.label} className="flex items-center gap-3">
                {i > 0 && <span className="text-white/60" aria-hidden>|</span>}
                <a className={link} href={p.href} target="_blank" rel="noreferrer">{p.label}</a>
              </span>
            ))}
          </p>
          <p className="disclaimer mt-4 text-white/70">{t("footer.prototype")}</p>
        </div>
      </section>
    </footer>
  );
}
