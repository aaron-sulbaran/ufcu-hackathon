import { Suspense } from "react";
import { Header } from "@/components/shared/header";
import { Conversation } from "@/components/desk/conversation";
import { DeskTitle } from "@/components/desk/desk-title";
import { SiteFooter } from "@/components/home/site-footer";

export const metadata = {
  title: "Front Desk | UFCU",
  description: "Tell us what you need. We'll tell you what fits, with the ufcu.org page behind it.",
};

export default function DeskPage() {
  return (
    <>
      <Header secure={false} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4">
        <DeskTitle />
        <Suspense fallback={<p className="py-8 text-muted-foreground">...</p>}>
          <Conversation />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
