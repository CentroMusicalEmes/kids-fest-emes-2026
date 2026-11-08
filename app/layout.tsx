import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { event } from "@/config/event";
import { siteUrl } from "@/config/integrations";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const title = "Kids Fest Emes 2026 — Pequenos artistas. Grandes conquistas.";
const description =
  "30 de novembro de 2026, às 19h, no Teatro Marília, em Belo Horizonte. Uma noite para celebrar o desenvolvimento musical dos alunos da Emes. Ingresso único: R$ 20,00 via PIX.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: event.name,
  keywords: [
    "Kids Fest Emes 2026",
    "Emes",
    "musicalização infantil",
    "Teatro Marília",
    "Belo Horizonte",
    "apresentação musical infantil",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: event.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0420",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: event.name,
  description,
  startDate: event.startsAtISO,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: event.venue.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: event.venue.address.street,
      addressLocality: event.venue.city,
      addressRegion: event.venue.state,
      postalCode: event.venue.address.postalCode,
      addressCountry: "BR",
    },
  },
  organizer: { "@type": "Organization", name: event.organizer },
  offers: {
    "@type": "Offer",
    name: event.ticket.label,
    price: (event.ticket.priceCents / 100).toFixed(2),
    priceCurrency: "BRL",
    url: `${siteUrl}/#ingressos`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
