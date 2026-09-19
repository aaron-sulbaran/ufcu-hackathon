// One sentence per sensitive field, shown behind the "Why we ask" toggle.
// The text lives in lib/apply/strings.ts; this map is field name to string key.
export const WHY_KEYS: Record<string, string> = {
  firstName: "apply.why.name",
  lastName: "apply.why.name",
  dob: "apply.why.dob",
  email: "apply.why.email",
  phone: "apply.why.phone",
  street: "apply.why.address",
  city: "apply.why.address",
  state: "apply.why.address",
  zip: "apply.why.address",
  occupation: "apply.why.occupation",
  affiliation: "apply.why.affiliation",
  ssn: "apply.why.ssn",
  itin: "apply.why.itin",
  passportNumber: "apply.why.passport",
  passportCountry: "apply.why.country",
  w8ben: "apply.why.w8ben",
};

export function whyKey(field: string): string | undefined {
  return WHY_KEYS[field];
}
