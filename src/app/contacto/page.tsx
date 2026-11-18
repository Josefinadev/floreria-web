import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, FlowerMark, Icon } from "@/components/brand";
import { ContactWhatsAppForm } from "@/components/contact-whatsapp-form";
import { Reveal } from "@/components/reveal";
import {
  BRAND,
  DELIVERY_SLOTS,
  DISTRICTS,
  PAYMENT_METHODS,
  formatPrice,
  whatsappLink,
} from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contacto, envíos y pagos",
  description:
    "Escríbenos por WhatsApp, conoce nuestras zonas de entrega en Lima, horarios y métodos de pago: tarjeta, Yape, Plin y transferencia.",
};

export default function ContactoPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-cocoa/10 bg-cream/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-0 h-[300px] w-[300px] rounded-full bg-sage/25 blur-[90px]"
        />
        <div className="shell relative py-14 lg:py-16">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cocoa/60">
            <Link href="/" className="hover:text-forest">Inicio</Link>
            <span>/</span>
            <span className="text-forest">Contacto</span>
          </nav>
          <Eyebrow className="mt-6">Hablemos de flores</Eyebrow>
          <h1 className="display mt-4 max-w-[40rem] text-[clamp(2.3rem,5vw,3.6rem)]">
            Estamos a un mensaje
            <span className="text-cocoa italic"> de tu próximo detalle.</span>
          </h1>
          <p className="mt-4 max-w-[36rem] text-[14px] leading-relaxed text-cocoa">
            Atendemos por WhatsApp de lunes a sábado de 9:00 a 20:00. Consulta
            disponibilidad, coordina una entrega sorpresa o pide asesoría para tu
            evento.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "whatsapp",
                label: "WhatsApp",
                value: BRAND.whatsappDisplay,
                href: whatsappLink("¡Hola Floréa! Quisiera hacer una consulta."),
              },
              {
                icon: "mail",
                label: "Correo",
                value: BRAND.email,
                href: `mailto:${BRAND.email}`,
              },
              {
                icon: "pin",
                label: "Atelier",
                value: BRAND.address,
                href: "https://maps.google.com/?q=Av.+La+Mar+1234+Miraflores+Lima",
              },
              {
                icon: "clock",
                label: "Horario",
                value: BRAND.hours,
              },
            ].map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-cocoa/12 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-sage hover:shadow-[0_18px_40px_-30px_rgba(22,63,51,0.5)]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-sage/20 text-forest">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-cocoa/60">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-snug text-forest">{item.value}</p>
                </a>
              ) : (
                <div key={item.label} className="rounded-2xl border border-cocoa/12 bg-white/70 p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-sage/20 text-forest">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-cocoa/60">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-snug text-forest">{item.value}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="shell grid gap-8 py-14 lg:grid-cols-[1fr_1fr] lg:items-start">
        <ContactWhatsAppForm />

        <Reveal className="overflow-hidden rounded-[24px] bg-forest p-6 text-cream sm:p-7">
          <Eyebrow className="[&_.eyebrow]:text-gold">Entrega de tu arreglo</Eyebrow>
          <h2 className="mt-3 font-serif text-[25px]">Fechas y horarios</h2>
          <p className="mt-3 text-[12.5px] leading-relaxed text-cream/70">
            Elige el día y el horario en el checkout. Para entregas el mismo día,
            confirma tu pedido antes de las 2:00 p.m. y valida la disponibilidad
            por WhatsApp.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {DELIVERY_SLOTS.map((slot) => (
              <span
                key={slot}
                className="flex items-center gap-2 rounded-xl border border-cream/20 bg-cream/5 px-3 py-2 text-[11px] text-cream/85"
              >
                <Icon name="clock" className="h-3.5 w-3.5 text-gold" /> {slot}
              </span>
            ))}
          </div>

          <div className="mt-6 border-t border-cream/12 pt-5">
            <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-gold">
              <Icon name="truck" className="h-4 w-4" /> Zonas y tarifas de envío
            </p>
            <ul className="mt-3 grid gap-1.5 text-[11.5px] text-cream/75 sm:grid-cols-2">
              {DISTRICTS.slice(0, 10).map((district) => (
                <li key={district.name} className="flex justify-between gap-3 border-b border-cream/8 pb-1.5">
                  <span>{district.name}</span>
                  <span className="text-cream/55">{formatPrice(district.feeCents)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-cream/55">
              Envío gratis en todo Lima desde {formatPrice(BRAND.freeShippingFromCents)}.
              Otros distritos se cotizan al confirmar.
            </p>
          </div>

          <a
            href={whatsappLink("¡Hola Floréa! Quiero confirmar la entrega en mi distrito.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold mt-6 w-full"
          >
            <Icon name="whatsapp" className="h-4 w-4" /> Consultar mi distrito
          </a>
        </Reveal>
      </section>

      <section id="pagos" className="border-y border-cocoa/12 bg-sage/12 py-14">
        <div className="shell">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Pagos online</Eyebrow>
              <h2 className="display mt-3 text-[clamp(1.9rem,3.6vw,2.6rem)]">
                Paga como prefieras
              </h2>
            </div>
            <p className="max-w-[26rem] text-[12.5px] leading-relaxed text-cocoa">
              Usamos conexión segura y no almacenamos los datos completos de tu
              tarjeta. Solo conservamos los últimos 4 dígitos para tu comprobante.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENT_METHODS.map((method, index) => (
              <Reveal
                key={method.id}
                delay={index * 70}
                className="rounded-2xl border border-cocoa/12 bg-white/75 p-5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-gold">
                  <Icon name={method.id === "tarjeta" ? "card" : "lock"} className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-serif text-[17px] leading-snug text-forest">
                  {method.label}
                </h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-cocoa">{method.hint}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[22px] border border-cocoa/12 bg-cream/80 px-6 py-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-3 text-[11.5px] leading-relaxed text-cocoa">
              <Icon name="shield" className="h-5 w-5 shrink-0 text-sage-deep" />
              ¿Necesitas factura o boleta? Indícalo en las notas del pedido y la
              enviamos junto con tu confirmación.
            </p>
            <a
              href={whatsappLink("¡Hola Floréa! Necesito ayuda con el pago de mi pedido.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark shrink-0"
            >
              <Icon name="whatsapp" className="h-4 w-4" /> Ayuda con mi pago
            </a>
          </div>
        </div>
      </section>

      <section className="shell py-14">
        <Reveal className="grid items-center gap-6 rounded-[26px] border border-cocoa/12 bg-white/65 p-7 sm:p-9 lg:grid-cols-[1fr_auto]">
          <div>
            <FlowerMark className="h-10 w-10 text-sage-deep" />
            <h2 className="mt-4 font-serif text-[24px] text-forest">
              ¿Planeas una boda, un evento corporativo o una fecha especial?
            </h2>
            <p className="mt-2 max-w-[42rem] text-[13px] leading-relaxed text-cocoa">
              Diseñamos instalaciones florales, centros de mesa y regalos
              corporativos con la identidad de tu marca. Escríbenos con al menos
              dos semanas de anticipación para reservar la fecha.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/personalizar" className="btn btn-primary">Diseño a medida</Link>
            <Link href="/catalogo" className="btn btn-outline">Ver catálogo</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
