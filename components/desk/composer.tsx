"use client";
// The composer. Deliberately plain: this is a front desk, not a chat product.
import { useState, type FormEvent } from "react";
import { useT } from "@/lib/i18n";

export function Composer({
  onSend,
  busy,
}: {
  onSend: (text: string) => void;
  busy?: boolean;
}) {
  const t = useT();
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text || busy) return;
    onSend(text);
    setValue("");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <label className="sr-only" htmlFor="desk-composer">
        {t("desk.placeholder")}
      </label>
      <input
        id="desk-composer"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("desk.placeholder")}
        autoComplete="off"
        className="min-w-0 flex-1 rounded-full border border-ufcu-primary-subtle bg-white px-4 py-3 text-ufcu-primary outline-none focus:border-ufcu-secondary-darker"
      />
      <button
        type="submit"
        disabled={busy || value.trim().length === 0}
        className="shrink-0 rounded-full bg-ufcu-secondary-darker px-5 py-3 font-semibold text-white disabled:opacity-40"
      >
        {t("desk.send")}
      </button>
    </form>
  );
}
