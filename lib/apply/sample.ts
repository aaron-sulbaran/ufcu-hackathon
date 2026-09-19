// MOCK: fictional sample data for step 2, so a demo does not need ten typed fields. Nothing here
// belongs to a real person; the names and numbers are invented and the button that fills them says so.
import type { ApplicationPrefill, IdentityPath } from "@/lib/types";
import type { AboutValues } from "@/lib/apply/schemas";

const SAMPLE_ID: Record<IdentityPath, Partial<AboutValues>> = {
  ssn: { ssn: "123-45-6789" },
  minor: { ssn: "123-45-6789" },
  itin: { itin: "912-70-1234" },
  foreign_status: { passportNumber: "M12345678", passportCountry: "Korea, Republic of", w8ben: true },
  branch_assist: {},
};

// The prefill wins where the conversation already learned something; the rest is invented.
export function sampleAbout(path: IdentityPath, prefill?: ApplicationPrefill | null): Partial<AboutValues> {
  const firstName = prefill?.preferredName || prefill?.firstName || "Sample";
  return {
    firstName,
    lastName: "Member",
    dob: "03/14/2005",
    email: prefill?.email || "sample.member@example.com",
    phone: "(512) 555-0134",
    street: "2200 Guadalupe St Apt 4",
    city: "Austin",
    state: "TX",
    zip: "78705",
    occupation: "Student",
    affiliation: prefill?.schoolAffiliation || "UT Austin",
    ...SAMPLE_ID[path],
  };
}
