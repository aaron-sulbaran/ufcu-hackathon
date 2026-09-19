"use client";
// Shared header, replicating ufcu.org's own bar (DESIGN.md "Header (replicate)"):
// logo cell with a divider, primary nav with the orange active dot, utilities, then the navy and
// purple action blocks at full height. The Secure Zone keeps this same white header; the change of
// context is carried by the page band, not by the chrome up here.
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Copy, Check, Globe, Lock, Menu, Search, UserPlus, X } from "lucide-react";
import { usePersona } from "@/lib/context";
import { LANGS, useT } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { AccessibilityToggle } from "@/components/home/accessibility-toggle";

const ROUTING = "314977405";

// The real site sections. Labels stay in English because they name ufcu.org's own nav.
const NAV: { label: string; href: string; active?: boolean }[] = [
  { label: "Personal", href: "https://ufcu.org/personal", active: true },
  { label: "Business", href: "https://ufcu.org/business" },
  { label: "Locations", href: "https://ufcu.org/locations" },
  { label: "About", href: "https://ufcu.org/about" },
  { label: "Resources", href: "https://ufcu.org/resources" },
];

function LangSelect({ className = "" }: { className?: string }) {
  const { context, setLang } = usePersona();
  const t = useT();
  return (
    <label className={`relative flex items-center gap-1.5 text-ufcu-navy ${className}`}>
      <Globe className="size-4 shrink-0" aria-hidden />
      <span className="sr-only">{t("nav.lang")}</span>
      <select
        className="appearance-none border-0 bg-transparent py-1 pr-5 pl-0 font-sans text-sm font-semibold text-ufcu-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ufcu-navy"
        value={context.lang}
        onChange={(e) => setLang(e.target.value as Lang)}
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 size-4" aria-hidden />
    </label>
  );
}

function RoutingNumber({ className = "" }: { className?: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ROUTING);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <span className={`flex items-center gap-1.5 text-sm text-ufcu-navy ${className}`}>
      <span className="font-semibold whitespace-nowrap">{t("nav.routing")}</span>
      <span className="text-ufcu-muted">{ROUTING}</span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t("nav.copied") : t("nav.copy")}
        className="rounded p-1 text-ufcu-navy hover:text-ufcu-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ufcu-navy"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      </button>
    </span>
  );
}

export function Header({ secure = false }: { secure?: boolean }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-ufcu-gray-line bg-white">
      <div className="flex h-16 items-stretch md:h-[84px]">
        <Link
          href="/"
          className="flex shrink-0 items-center border-r border-ufcu-gray-line px-4 md:px-6"
          aria-label={t("app.name")}
        >
          <Image src="/brand/ufcu-logo.svg" alt="UFCU" width={96} height={49} priority className="h-9 w-24 md:h-11 md:w-[96px]" />
        </Link>

        <nav aria-label="UFCU" className="hidden items-stretch lg:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 px-3 font-sans text-[15px] font-semibold text-ufcu-navy hover:no-underline xl:px-5 xl:text-base ${
                item.active ? "bg-ufcu-gray-panel" : ""
              }`}
            >
              {item.active && <span className="size-2 rounded-full bg-ufcu-cta" aria-hidden />}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 px-3 lg:flex xl:gap-5 xl:px-4">
          <LangSelect />
          <RoutingNumber className="hidden xl:flex" />
          <a
            href="https://ufcu.org/search"
            target="_blank"
            rel="noreferrer"
            aria-label={t("nav.search")}
            className="hidden text-ufcu-navy hover:text-ufcu-cta xl:block"
          >
            <Search className="size-5" aria-hidden />
          </a>
          <AccessibilityToggle className="hidden xl:inline-flex" />
        </div>

        {/* The .hdr-block recipe is unlayered CSS, so it outranks a `hidden` utility on the same
            element. The wrapper is what hides the blocks on phones. */}
        <div className="hidden items-stretch lg:flex">
          <Link
            href="/apply"
            aria-current={secure ? "page" : undefined}
            className="hdr-block hdr-block-navy whitespace-nowrap"
          >
            <UserPlus className="size-5" aria-hidden />
            {t("nav.apply")}
          </Link>
          <a href="https://ufcu.org/login" target="_blank" rel="noreferrer" className="hdr-block hdr-block-purple whitespace-nowrap">
            <Lock className="size-4" aria-hidden />
            {t("nav.login")}
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2 pr-3 lg:hidden">
          <LangSelect />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t("nav.menu")}
            className="rounded p-2 text-ufcu-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ufcu-navy"
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ufcu-gray-line lg:hidden">
          <nav aria-label="UFCU" className="flex flex-col">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border-b border-ufcu-gray-line px-4 py-3 font-sans text-base font-semibold text-ufcu-navy"
              >
                {item.active && <span className="size-2 rounded-full bg-ufcu-cta" aria-hidden />}
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <RoutingNumber />
            <AccessibilityToggle />
          </div>
          <div className="flex">
            <Link href="/apply" onClick={() => setOpen(false)} className="hdr-block hdr-block-navy flex-1 py-3">
              <UserPlus className="size-5" aria-hidden />
              {t("nav.apply")}
            </Link>
            <a href="https://ufcu.org/login" target="_blank" rel="noreferrer" className="hdr-block hdr-block-purple flex-1 py-3">
              <Lock className="size-4" aria-hidden />
              {t("nav.login")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
