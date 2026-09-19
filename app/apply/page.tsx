"use client";
// The Secure Zone. Deliberately different chrome from the conversation: darkest navy header, lock
// line, off-white background, monospace step labels. Nothing on this page talks to a model.
import { Header } from "@/components/shared/header";
import { SecureBar } from "@/components/apply/progress-header";
import { Wizard } from "@/components/apply/wizard";
import { ApplicationProvider } from "@/lib/apply/state";

export default function ApplyPage() {
  return (
    <div className="secure-zone min-h-screen bg-background">
      <ApplicationProvider>
        <Header secure />
        <SecureBar />
        <Wizard />
      </ApplicationProvider>
    </div>
  );
}
