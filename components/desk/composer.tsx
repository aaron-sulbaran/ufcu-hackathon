"use client";
// The composer. Deliberately plain: this is a front desk, not a chat product.
import { useState, type FormEvent } from "react";
import { useDeskT } from "@/components/desk/strings";

export function Composer({
  onSend,
  busy,
}: {
  onSend: (text: string) => void;
  busy?: boolean;
}) {
  const t = useDeskT();
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
        {t("desk.placeholder2")}
      </label>
      <input
        id="desk-composer"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("desk.placeholder2")}
        autoComplete="off"
        className="min-w-0 flex-1 rounded-lg border border-ufcu-primary-subtle bg-white px-4 py-3 text-ufcu-primary outline-none focus:border-ufcu-secondary-darker"
      />
      <button
        type="submit"
        disabled={busy || value.trim().length === 0}
        className="shrink-0 rounded-lg bg-ufcu-secondary-darker px-5 py-3 font-semibold text-white disabled:opacity-40"
      >
        {t("desk.send")}
      </button>
    </form>
  );
}
