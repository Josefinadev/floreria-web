import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart";
import { SiteFooter, SiteHeader, WhatsAppFab } from "@/components/chrome";
import { IMAGES } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://florea.pe"),
  title: {
    default: "FLORÉA · Flores que hablan por ti",
    template: "%s · FLORÉA",
  },
  description:
    "Florería boutique en Lima. Arreglos florales únicos, cajas florales y diseños personalizados con entrega el mismo día. Emociones que florecen.",
  keywords: [
    "florería Lima",
    "arreglos florales",
    "cajas florales",
    "ramos de rosas",
    "entrega de flores Lima",
    "Floréa",
  ],
  openGraph: {
    title: "FLORÉA · Emociones que florecen",
    description:
      "Arreglos florales únicos en Lima. Personaliza tu ramo, elige la fecha de entrega y paga online.",
    locale: "es_PE",
    type: "website",
    images: [{ url: IMAGES.hero, width: 1000, height: 1300, alt: "Arreglo floral Floréa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FLORÉA · Flores que hablan por ti",
    description: "Arreglos florales únicos en Lima. Emociones que florecen.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2B22",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
