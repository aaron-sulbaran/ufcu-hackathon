"use client";
// The site's page header: navy band with a white Montserrat h1, then the breadcrumb row, then the
// optional clock line (orange, dotted rule under it) and the optional lock line. See the band on
// docs/research/site/open-account-step1.webp.
//
// Every text prop is run through the dictionary first: pass a key ("app.name") and it resolves,
// pass a literal ("Open an Account") and it comes back unchanged, because t() falls back to the key.
import Link from "next/link";
import { Clock, Lock } from "lucide-react";
import { useT } from "@/lib/i18n";

export function PageHeader({
  title,
  breadcrumb,
  clockLine,
  lockLine,
  children,
}: {
  title: string;
  breadcrumb: string;
  clockLine?: string;
  lockLine?: string;
  children?: React.ReactNode;
}) {
  const t = useT();
  return (
    <>
      <div className="page-band">
        <div className="mx-auto w-full max-w-6xl px-4">
          <h1>{t(title)}</h1>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4">
        <nav aria-label="Breadcrumb" className="breadcrumb flex items-center gap-2">
          <Link href="/">{t("nav.home")}</Link>
          <span aria-hidden>&middot;</span>
          <span className="current" aria-current="page">{t(breadcrumb)}</span>
        </nav>
        {clockLine && (
          <p className="flex items-center gap-3 border-b border-dotted border-ufcu-gray-line pb-4 text-sm">
            <Clock className="size-6 shrink-0 text-ufcu-navy" aria-hidden />
            <span className="text-ufcu-cta">{t(clockLine)}</span>
          </p>
        )}
        {lockLine && (
          <p className="flex items-center gap-2 pt-3 text-sm text-ufcu-navy">
            <Lock className="size-4 shrink-0" aria-hidden />
            <span>{t(lockLine)}</span>
          </p>
        )}
        {children}
      </div>
    </>
  );
}
