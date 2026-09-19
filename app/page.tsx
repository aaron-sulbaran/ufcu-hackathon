// Landing page. Order of operations is the product: this page never asks for identity data,
// only what the person needs. See docs/03-prd.md M1 and docs/10-competitor-switch.md.
import { Header } from "@/components/shared/header";
import { Hero } from "@/components/home/hero";
import { PersonaChips } from "@/components/home/persona-chips";
import { TrustStrip } from "@/components/home/trust-strip";
import { SiteFooter } from "@/components/home/site-footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-12 px-4 py-12 sm:py-16">
        <Hero />
        <TrustStrip />
        {/* The scripted visits sit last and closed: the chat above is the way in. */}
        <PersonaChips />
      </main>
      <SiteFooter />
    </>
  );
}
