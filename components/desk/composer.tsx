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
        className="input-ufcu min-w-0 flex-1"
        style={{ width: "auto" }}
      />
      <button
        type="submit"
        disabled={busy || value.trim().length === 0}
        className="btn btn-cta shrink-0"
      >
        {t("desk.send")}
      </button>
    </form>
  );
}
