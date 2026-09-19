"use client";
// "Larger text" toggles a document-level class and remembers the choice per browser.
// Styled as plain navy text so it reads like the site's other header utilities.
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

const KEY = "frontdesk.largeText";

export function AccessibilityToggle({ className = "" }: { className?: string }) {
  const t = useT();
  const [large, setLarge] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage once; the sync setState is intentional (external store, one-shot).
    try {
      const saved = localStorage.getItem(KEY) === "1";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLarge(saved);
      document.documentElement.classList.toggle("text-lg", saved);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !large;
    setLarge(next);
    try {
      document.documentElement.classList.toggle("text-lg", next);
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={large}
      className={`inline-flex items-center whitespace-nowrap font-sans text-sm font-semibold text-ufcu-navy hover:text-ufcu-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ufcu-navy ${className}`}
    >
      {t("a11y.largerText")}
    </button>
  );
}
