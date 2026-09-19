// Lane C replaces this with the landing page (persona sentence, chips, language switch).
import Link from "next/link";
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8 space-y-4">
      <h1 className="font-heading text-4xl">Front Desk</h1>
      <p>Setup base. Lanes: <Link className="underline" href="/desk">/desk</Link> (A), <Link className="underline" href="/apply">/apply</Link> (B), landing (C).</p>
    </main>
  );
}
