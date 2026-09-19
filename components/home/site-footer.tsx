"use client";
// Footer modeled on ufcu.org: an orange "Get in Touch" band, then a navy footer with four columns,
// a dotted rule, the legal row with social icons, and the partners line. Copy stays English on
// purpose: it names ufcu.org's own sections, hours, and legal identifiers.

const COLUMNS = [
  {
    title: "Phone Support Hours",
    lines: ["Mon - Fri: 8 AM to 5:30 PM", "Sat: 10 AM to 2 PM"],
    links: [
      { label: "(512) 467-8080", href: "tel:+15124678080" },
      { label: "(800) 252-8311", href: "tel:+18002528311" },
    ],
    inline: true,
  },
  {
    title: "Work With Us",
    links: [
      { label: "UFCU Careers", href: "https://ufcu.org/about/careers" },
      { label: "Learn More About Us", href: "https://ufcu.org/about" },
    ],
  },
  {
    title: "Security",
    links: [
      { label: "Security & Fraud Resources", href: "https://ufcu.org/resources/security-fraud" },
      { label: "Security FAQs", href: "https://ufcu.org/resources/faqs/security" },
    ],
  },
  {
    title: "Did You Know",
    lines: ["APY = Annual Percentage Yield", "APR = Annual Percentage Rate", "Rates are variable and subject to change."],
    links: [
      { label: "Federally Insured by NCUA", href: "https://ncua.gov" },
      { label: "Equal Housing Lender", href: "https://ufcu.org/policies-legal/disclosures" },
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


type IconProps = { className?: string };
function Facebook({ className }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3z" /></svg>;
}
function Linkedin({ className }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M6.9 8.5H3.6V21h3.3V8.5zM5.3 3a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM21 13.3c0-3.6-1.9-5.2-4.5-5.2-2 0-2.9 1.1-3.4 1.9V8.5H9.8V21h3.3v-6.9c0-1.8.3-3.6 2.6-3.6 2.2 0 2.2 2.1 2.2 3.7V21H21v-7.7z" /></svg>;
}
function Youtube({ className }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M23 7.2a2.9 2.9 0 00-2-2C19.2 4.7 12 4.7 12 4.7s-7.2 0-9 .5a2.9 2.9 0 00-2 2C.5 9 .5 12 .5 12s0 3 .5 4.8a2.9 2.9 0 002 2c1.8.5 9 .5 9 .5s7.2 0 9-.5a2.9 2.9 0 002-2c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8zM9.7 15.1V8.9l6 3.1-6 3.1z" /></svg>;
}
function Instagram({ className }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}

const link = "text-white underline underline-offset-4 decoration-white/70 hover:decoration-white";

function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L1.5 3h6.4l4.4 5.9L17.5 3zm-1.1 16.2h1.7L6.7 4.7H4.9l11.5 14.5z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 text-white">
      <section className="bg-ufcu-cta">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-white">Get in Touch</h2>
            <p className="mt-2 text-white">Contact Member Services for personalized assistance and guidance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="btn btn-outline-white" href="https://ufcu.org/about/contact-us" target="_blank" rel="noreferrer">Make an Appointment</a>
            <a className="btn btn-outline-white" href="https://ufcu.org/about/contact-us" target="_blank" rel="noreferrer">Contact Us</a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ufcu-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[28%] -top-[25%] h-[170%] w-[62%] rounded-full border-[90px] border-white/[0.06]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title} className="space-y-3">
                <h3 className="text-white">{col.title}</h3>
                {col.lines?.map((l) => <p key={l} className="text-white">{l}</p>)}
                <div className={col.inline ? "flex flex-wrap items-center gap-x-3" : "flex flex-col gap-2"}>
                  {col.links.map((l, i) => (
                    <span key={l.href + l.label} className="flex items-center gap-3">
                      {col.inline && i > 0 && <span className="text-white/60" aria-hidden>|</span>}
                      <a className={link} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{l.label}</a>
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
              <span>Routing Number: 314977405</span>
              <span className="text-white/60" aria-hidden>|</span>
              <a className={link} href="https://ufcu.org/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
              <span className="text-white/60" aria-hidden>|</span>
              <a className={link} href="https://ufcu.org/policies-legal/disclosures" target="_blank" rel="noreferrer">Disclosures</a>
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
            <span>UFCU proudly partners with:</span>
            {PARTNERS.map((p, i) => (
              <span key={p.label} className="flex items-center gap-3">
                {i > 0 && <span className="text-white/60" aria-hidden>|</span>}
                <a className={link} href={p.href} target="_blank" rel="noreferrer">{p.label}</a>
              </span>
            ))}
          </p>
          <p className="disclaimer mt-4 text-white/70">Prototype for the Develop U hackathon. Links open ufcu.org.</p>
        </div>
      </section>
    </footer>
  );
}
