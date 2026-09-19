"use client";
// "Larger text" toggles a document-level class and remembers the choice per browser.
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

const KEY = "frontdesk.largeText";

export function AccessibilityToggle() {
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
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-pressed={large}
      className="text-white hover:bg-white/15 hover:text-white"
    >
      {t("a11y.largerText")}
    </Button>
  );
}
