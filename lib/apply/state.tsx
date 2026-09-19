"use client";
// Secure Zone state: one React context, one localStorage key, no server calls.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { ApplicationPrefill, Decision, IdentityPath, NextStep, TrustReadout } from "@/lib/types";
import { clearPrefill, loadPrefill } from "@/lib/apply/prefill";
import { DEFAULT_PRODUCTS, MEMBERSHIP_PRODUCT } from "@/lib/apply/rules";
import type { AboutValues, AccountsValues, VerifyValues } from "@/lib/apply/schemas";

const KEY = "frontdesk.application";
export const TOTAL_STEPS = 5;

export interface ApplicationState {
  prefill: ApplicationPrefill | null;
  step: number;
  path: IdentityPath;
  about: AboutValues;
  verify: VerifyValues;
  accounts: AccountsValues;
  trust?: TrustReadout;
  decision?: Decision;
  nextSteps?: NextStep[];
  startedAt: number;
  finishedAt?: number;
}

function emptyAbout(): AboutValues {
  return {
    firstName: "", lastName: "", dob: "", email: "", phone: "",
    street: "", city: "Austin", state: "TX", zip: "",
    occupation: "", affiliation: "",
    ssn: "", itin: "", passportNumber: "", passportCountry: "", w8ben: false,
  };
}

function emptyState(): ApplicationState {
  return {
    prefill: null,
    step: 1,
    path: "ssn",
    about: emptyAbout(),
    verify: { idDoc: false, selfie: false, enrollment: false, slot: "" },
    accounts: { products: [...DEFAULT_PRODUCTS], esign: false, agreement: false, w8benAck: false },
    startedAt: Date.now(),
  };
}

function withPrefill(base: ApplicationState, prefill: ApplicationPrefill | null): ApplicationState {
  if (!prefill) return base;
  const products = prefill.products?.length ? [...prefill.products] : [...DEFAULT_PRODUCTS];
  if (!products.includes(MEMBERSHIP_PRODUCT)) products.unshift(MEMBERSHIP_PRODUCT);
  return {
    ...base,
    prefill,
    path: prefill.path ?? base.path,
    about: {
      ...base.about,
      firstName: prefill.firstName ?? base.about.firstName,
      email: prefill.email ?? base.about.email,
      affiliation: prefill.schoolAffiliation ?? base.about.affiliation,
    },
    accounts: { ...base.accounts, products },
  };
}

// The three identity numbers never reach localStorage; they live in React state for this tab only.
function withoutIdNumbers(state: ApplicationState): ApplicationState {
  return { ...state, about: { ...state.about, ssn: "", itin: "", passportNumber: "" } };
}

// A stored application is stale when a newer handoff belongs to someone else, or when it already
// finished. Either way the person is starting a different run and should not land mid-flow.
function isStale(stored: Partial<ApplicationState>, prefill: ApplicationPrefill | null): boolean {
  if (!prefill) return false;
  if (stored.decision) return true;
  return stored.prefill?.context?.personaId !== prefill.context?.personaId;
}

interface Ctx {
  state: ApplicationState;
  ready: boolean;
  saved: boolean;
  personaId?: string;
  reset: () => void;
  update: (patch: Partial<ApplicationState>) => void;
  setAbout: (patch: Partial<AboutValues>) => void;
  setVerify: (patch: Partial<VerifyValues>) => void;
  setAccounts: (patch: Partial<AccountsValues>) => void;
  goTo: (step: number) => void;
}

const ApplicationCtx = createContext<Ctx | null>(null);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ApplicationState>(emptyState);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Hydrate once from localStorage, then from the handoff the conversation left behind.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => {
      const { data: prefill } = loadPrefill();
      let stored: Partial<ApplicationState> | null = null;
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) stored = JSON.parse(raw) as Partial<ApplicationState>;
      } catch {
        // storage unavailable; fall through to the prefill
      }
      if (stored && !isStale(stored, prefill ?? null)) {
        return { ...prev, ...stored, about: { ...prev.about, ...stored.about } };
      }
      return withPrefill(prev, prefill ?? null);
    });
    setReady(true);
  }, []);

  const persist = useCallback((next: ApplicationState) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(withoutIdNumbers(next)));
      setSaved(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setSaved(false), 1600);
    } catch {
      // nothing to do; the flow still works in memory
    }
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const update = useCallback((patch: Partial<ApplicationState>) => {
    setState((prev) => { const next = { ...prev, ...patch }; persist(next); return next; });
  }, [persist]);

  const setAbout = useCallback((patch: Partial<AboutValues>) => {
    setState((prev) => { const next = { ...prev, about: { ...prev.about, ...patch } }; persist(next); return next; });
  }, [persist]);

  const setVerify = useCallback((patch: Partial<VerifyValues>) => {
    setState((prev) => { const next = { ...prev, verify: { ...prev.verify, ...patch } }; persist(next); return next; });
  }, [persist]);

  const setAccounts = useCallback((patch: Partial<AccountsValues>) => {
    setState((prev) => { const next = { ...prev, accounts: { ...prev.accounts, ...patch } }; persist(next); return next; });
  }, [persist]);

  // Start over: drop the stored application and the handoff, then begin at step 1.
  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {
      // storage unavailable; the in-memory reset below is still enough
    }
    clearPrefill();
    setState(emptyState());
    setSaved(false);
  }, []);

  const goTo = useCallback((step: number) => {
    update({ step: Math.min(Math.max(step, 1), TOTAL_STEPS) });
  }, [update]);

  return (
    <ApplicationCtx.Provider
      value={{ state, ready, saved, personaId: state.prefill?.context?.personaId, reset, update, setAbout, setVerify, setAccounts, goTo }}
    >
      {children}
    </ApplicationCtx.Provider>
  );
}

export function useApplication(): Ctx {
  const ctx = useContext(ApplicationCtx);
  if (!ctx) throw new Error("useApplication must be used inside ApplicationProvider");
  return ctx;
}
