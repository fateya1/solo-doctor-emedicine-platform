import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LangSync } from "@/components/lang-sync";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  title: "SoloDoc | Kenya's E-Medicine Platform",
  description: "Connect with verified Kenyan doctors for online consultations, digital prescriptions, video calls and M-Pesa payments.",
  keywords: ["telemedicine Kenya", "online doctor Kenya", "M-Pesa doctor", "SoloDoc"],
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    title: "SoloDoc | Kenya's E-Medicine Platform",
    description: "Connect with verified Kenyan doctors online. Book, consult and pay via M-Pesa.",
    url: "https://solo-doctor-emedicine-platform.vercel.app",
    siteName: "SoloDoc",
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={${outfit.variable} }>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <LangSync />
          {children}
        </Providers>
      </body>
    </html>
  );
}