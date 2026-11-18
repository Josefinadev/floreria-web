import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Icon } from "@/components/brand";
import { CheckoutForm } from "@/components/checkout-form";
import { detectProvider } from "@/lib/payments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carrito y pago online",
  description:
    "Revisa tu pedido floral, elige la fecha de entrega y paga online con tarjeta, Yape, Plin o transferencia.",
};

export default function CarritoPage() {
  const provider = detectProvider();

  return (
    <>
      <section className="border-b border-cocoa/10 bg-cream/60">
        <div className="shell py-10 lg:py-12">
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cocoa/60"
          >
            <Link href="/" className="hover:text-forest">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-forest">Catálogo</Link>
            <span>/</span>
            <span className="text-forest">Pago</span>
          </nav>

          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <Eyebrow>Pedido, entrega y pago</Eyebrow>
              <h1 className="display mt-3 text-[clamp(2.1rem,4.4vw,3.2rem)]">
                Finaliza tu pedido
              </h1>
              <p className="mt-2.5 max-w-[38rem] text-[13.5px] leading-relaxed text-cocoa">
                Elige la fecha y el horario de entrega, escribe tu dedicatoria y paga
                de forma segura. Confirmamos todo contigo por WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest">
                <Icon name="lock" className="h-3.5 w-3.5 text-sage-deep" />
                {provider.live ? "Pago seguro" : "Pago de prueba"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest">
                <Icon name="calendar" className="h-3.5 w-3.5 text-sage-deep" /> Tú eliges la fecha
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-14">
        <CheckoutForm gatewayLive={provider.live} />
      </section>
    </>
  );
}
