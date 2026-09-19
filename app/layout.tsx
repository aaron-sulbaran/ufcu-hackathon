import type { Metadata } from "next";
import { Inter, Source_Serif_4, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { PersonaProvider } from "@/lib/context";

const inter = Inter({ variable: "--font-sans", subsets: ["latin", "latin-ext"] });
const serif = Source_Serif_4({ variable: "--font-heading-serif", subsets: ["latin"] });
const notoKr = Noto_Sans_KR({ variable: "--font-kr", subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Front Desk | UFCU",
  description: "The UFCU front desk, online. Tell us what you need; we'll tell you what fits.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${notoKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <PersonaProvider>{children}</PersonaProvider>
      </body>
    </html>
  );
}
