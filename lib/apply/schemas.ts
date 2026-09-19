// zod formats only. No address, name, or document is checked against a real service anywhere here.
// Messages are i18n keys; the field components render them through useApplyT().
import { z } from "zod";
import type { IdentityPath } from "@/lib/types";
import { MEMBERSHIP_PRODUCT, needsEnrollmentDoc, needsW8Ben } from "@/lib/apply/rules";

export const pathSchema = z.object({
  path: z.enum(["ssn", "itin", "foreign_status", "minor", "branch_assist"], { error: "apply.err.path" }),
});

const req = (key: string) => z.string().trim().min(1, key);

export const aboutBase = z.object({
  firstName: req("apply.err.firstName"),
  lastName: req("apply.err.lastName"),
  dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "apply.err.dob"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "apply.err.email"),
  phone: z.string().regex(/^\D*(\d\D*){10}$/, "apply.err.phone"),
  street: req("apply.err.street"),
  city: req("apply.err.city"),
  state: z.string().regex(/^[A-Za-z]{2}$/, "apply.err.state"),
  zip: z.string().regex(/^\d{5}$/, "apply.err.zip"),
  occupation: req("apply.err.occupation"),
  affiliation: z.string(),
  ssn: z.string(),
  itin: z.string(),
  passportNumber: z.string(),
  passportCountry: z.string(),
  w8ben: z.boolean(),
});

export type AboutValues = z.infer<typeof aboutBase>;

export function aboutSchema(path: IdentityPath) {
  return aboutBase.superRefine((v, ctx) => {
    const add = (field: keyof AboutValues, message: string) =>
      ctx.addIssue({ code: "custom", message, path: [field] });
    if (path === "ssn" || path === "minor") {
      if (!/^\d{3}-?\d{2}-?\d{4}$/.test(v.ssn.trim())) add("ssn", "apply.err.ssn");
    }
    if (path === "itin" && !/^9\d{2}-?\d{2}-?\d{4}$/.test(v.itin.trim())) add("itin", "apply.err.itin");
    if (path === "foreign_status") {
      if (v.passportNumber.trim().length < 5) add("passportNumber", "apply.err.passport");
      if (v.passportCountry.trim().length < 2) add("passportCountry", "apply.err.country");
      if (!v.w8ben) add("w8ben", "apply.err.w8ben");
    }
  });
}

export interface VerifyValues {
  idDoc: boolean;
  selfie: boolean;
  enrollment: boolean;
  slot: string;
}

// Documents are only asked for on the step-up path; when stage 1 confirmed the details there is
// nothing to capture, so the only requirement left is a readout (and a slot when one is offered).
export function verifySchema(
  path: IdentityPath,
  opts: { stepUp: boolean; hasReadout: boolean; needsSlot: boolean },
) {
  return z
    .object({ idDoc: z.boolean(), selfie: z.boolean(), enrollment: z.boolean(), slot: z.string() })
    .superRefine((v, ctx) => {
      if (opts.stepUp) {
        if (!v.idDoc || !v.selfie) ctx.addIssue({ code: "custom", message: "apply.err.docs", path: ["idDoc"] });
        if (needsEnrollmentDoc(path) && !v.enrollment)
          ctx.addIssue({ code: "custom", message: "apply.err.enrollment", path: ["enrollment"] });
      }
      if (!opts.hasReadout) ctx.addIssue({ code: "custom", message: "apply.err.verify", path: ["readout"] });
      if (opts.needsSlot && !v.slot) ctx.addIssue({ code: "custom", message: "apply.err.slot", path: ["slot"] });
    });
}

export interface AccountsValues {
  products: string[];
  esign: boolean;
  agreement: boolean;
  w8benAck: boolean;
}

export function accountsSchema(path: IdentityPath) {
  return z
    .object({
      products: z.array(z.string()),
      esign: z.boolean(),
      agreement: z.boolean(),
      w8benAck: z.boolean(),
    })
    .superRefine((v, ctx) => {
      if (!v.products.includes(MEMBERSHIP_PRODUCT))
        ctx.addIssue({ code: "custom", message: "apply.err.products", path: ["products"] });
      if (!v.esign) ctx.addIssue({ code: "custom", message: "apply.err.esign", path: ["esign"] });
      if (!v.agreement) ctx.addIssue({ code: "custom", message: "apply.err.agreement", path: ["agreement"] });
      if (needsW8Ben(path) && !v.w8benAck)
        ctx.addIssue({ code: "custom", message: "apply.err.w8ben", path: ["w8benAck"] });
    });
}

export type FieldErrors = Record<string, string>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
