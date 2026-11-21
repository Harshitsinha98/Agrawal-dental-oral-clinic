import type { ReactNode } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", style: ["normal", "italic"], axes: ["opsz", "SOFT"] });

/** Bare root. The website styles live in (site)/layout.tsx, so they never leak into the Studio. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
