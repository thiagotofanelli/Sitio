import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sítio Recanto dos Pássaros — Juquitiba SP | Locação para Eventos e Temporada",
  description:
    "Sítio Recanto dos Pássaros em Juquitiba-SP para até 100 hóspedes. Piscina semiolímpica com toboágua, salão de festas para 150 pessoas, campo de futebol, lago para pesca, 9 quartos e Wi-Fi fibra. A 65km de São Paulo, 30 min do Rodoanel. Ideal para casamentos, retiros, aniversários e eventos corporativos.",
  keywords: [
    "Sítio Recanto dos Pássaros",
    "Recanto dos Pássaros Juquitiba",
    "sítio Juquitiba",
    "locação sítio eventos",
    "sítio para casamento",
    "sítio para retiro",
    "chácara Juquitiba",
    "day use sítio SP",
    "sítio 100 pessoas",
    "piscina semiolímpica",
    "salão de festas Juquitiba",
  ],
  openGraph: {
    title: "Sítio Recanto dos Pássaros — Juquitiba SP | Locação para Eventos e Temporada",
    description:
      "Sítio Recanto dos Pássaros em Juquitiba-SP com capacidade para até 100 hóspedes. Piscina semiolímpica, salão de festas, campo de futebol e muito mais.",
    type: "website",
    locale: "pt_BR",
    siteName: "Sítio Recanto dos Pássaros",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sítio Recanto dos Pássaros",
    description: "Sítio Recanto dos Pássaros em Juquitiba-SP para até 100 hóspedes.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" style={{ fontFamily: 'var(--font-sans)' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
