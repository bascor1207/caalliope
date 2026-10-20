import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "KODA · Admin", template: "%s · KODA Admin" },
  description: "Tableau de bord KODA Clothing : audience, entonnoir d'achat, frictions.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
