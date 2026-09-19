"use client";
// The Secure Zone. Same white site header as the rest, but the page band carries "Open an Account",
// the clock line, and the lock line, the way ufcu.org's own application does. Nothing here
// talks to a model.
import { Header } from "@/components/shared/header";
import { PageHeader } from "@/components/shared/page-header";
import { Wizard } from "@/components/apply/wizard";
import { ApplicationProvider } from "@/lib/apply/state";

export default function ApplyPage() {
  return (
    <div className="secure-zone min-h-screen bg-background">
      <ApplicationProvider>
        <Header secure />
        <PageHeader
          title="apply.band.title"
          breadcrumb="apply.band.title"
          clockLine="apply.band.clock"
          lockLine="apply.noai"
        />
        <Wizard />
      </ApplicationProvider>
    </div>
  );
}
