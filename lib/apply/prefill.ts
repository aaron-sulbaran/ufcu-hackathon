// Handoff from the Front Desk conversation (lane A writes) to the Secure Zone (lane B reads).
import type { ApplicationPrefill, Result } from "@/lib/types";

const KEY = "frontdesk.prefill";

export function savePrefill(prefill: ApplicationPrefill): Result<true> {
  try { localStorage.setItem(KEY, JSON.stringify(prefill)); return { data: true }; }
  catch (e) { return { error: e instanceof Error ? e.message : "storage unavailable" }; }
}

export function loadPrefill(): Result<ApplicationPrefill | null> {
  try { const raw = localStorage.getItem(KEY); return { data: raw ? (JSON.parse(raw) as ApplicationPrefill) : null }; }
  catch (e) { return { error: e instanceof Error ? e.message : "storage unavailable" }; }
}

export function clearPrefill() { try { localStorage.removeItem(KEY); } catch {} }
