import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, FlowerMark, Icon } from "@/components/brand";
import { CustomOrderForm } from "@/components/custom-order-form";
import { Reveal } from "@/components/reveal";
import { whatsappLink } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Diseña tu arreglo floral",
  description:
    "Personaliza tu arreglo floral en Lima: elige flores, paleta de colores, tamaño y fecha de entrega. Una florista de Floréa te asesora por WhatsApp.",
};

const FAQS = [
  {
    question: "¿Con cuánta anticipación debo pedir un diseño a medida?",
    answer:
      "Recomendamos 48 horas para diseños personalizados y 24 horas para arreglos del catálogo. Si es urgente, escríbenos por WhatsApp: hacemos lo posible por atenderte el mismo día.",
  },
  {
    question: "¿Puedo elegir flores específicas?",
    answer:
      "Sí. Selecciona tus favoritas en el configurador. Si alguna no está en temporada, tu florista te propondrá una alternativa de valor y paleta similar antes de confirmar.",
  },
  {
    question: "¿Cómo se coordina el pago?",
    answer:
      "Puedes pagar online con tarjeta (pasarela segura), Yape, Plin o transferencia. En diseños a medida te enviamos el link de pago luego de confirmar flores y fecha.",
  },
  {
    question: "¿Puedo enviar el arreglo como sorpresa?",
    answer:
      "Claro. Coordinamos con la persona que recibe sin revelar el regalo, pedimos referencia de la dirección y te enviamos una fotografía del arreglo antes de salir.",
  },
  {
    question: "¿Realizan entregas fuera de Lima?",
    answer:
      "Por ahora entregamos en Lima Metropolitana. Para provincias cotizamos un operador floral aliado; escríbenos con 4 días de anticipación.",
  },
];

export default function PersonalizarPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-cocoa/10 bg-cream/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 h-[320px] w-[320px] rounded-full bg-sage/25 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-0 h-[260px] w-[260px] rounded-full bg-rose/25 blur-[90px]"
        />
        <div className="shell relative py-14 lg:py-16">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cocoa/60">
            <Link href="/" className="hover:text-forest">Inicio</Link>
            <span>/</span>
            <span className="text-forest">Personalizar</span>
          </nav>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <Eyebrow>Pedidos personalizados</Eyebrow>
              <h1 className="display mt-4 max-w-[38rem] text-[clamp(2.4rem,5.2vw,3.8rem)]">
                Un detalle, <span className="text-cocoa italic">mil emociones.</span>
              </h1>
              <p className="mt-4 max-w-[34rem] text-[14px] leading-relaxed text-cocoa">
                Personaliza tu arreglo y nosotros hacemos florecer tu idea. Elige
                flores, paleta, tamaño y fecha de entrega; una florista te acompaña
                para que el resultado sea exactamente lo que imaginas.
              </p>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
                {[
                  { icon: "leaf", text: "Flores de temporada" },
                  { icon: "calendar", text: "Entrega programada" },
                  { icon: "whatsapp", text: "Asesoría real por WhatsApp" },
                ].map((item) => (
                  <span key={item.text} className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-forest">
                    <Icon name={item.icon} className="h-4 w-4 text-sage-deep" /> {item.text}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="relative rounded-[28px] border border-gold/40 bg-white/60 p-6">
                <FlowerMark className="h-12 w-12 text-gold" />
                <p className="mt-4 max-w-[190px] font-serif text-[19px] leading-snug text-forest italic">
                  “Cada ramo cuenta una historia: la tuya.”
                </p>
                <p className="mt-3 text-[9.5px] uppercase tracking-[0.2em] text-cocoa/60">
                  Atelier Floréa · Miraflores
                </p>
                <a
                  href={whatsappLink("¡Hola Floréa! Quiero asesoría para un arreglo personalizado.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest hover:text-cocoa"
                >
                  <Icon name="whatsapp" className="h-4 w-4" /> Hablar con una florista
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-12 lg:py-16">
        <CustomOrderForm />
      </section>

      <section className="shell pb-16 lg:pb-20">
        <Reveal className="rounded-[28px] border border-cocoa/12 bg-white/60 p-6 sm:p-9">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Antes de pedir</Eyebrow>
              <h2 className="display mt-3 text-[clamp(1.9rem,3.6vw,2.6rem)]">
                Preguntas frecuentes
              </h2>
            </div>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-forest hover:text-cocoa"
            >
              Ver envíos y pagos <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-7 divide-y divide-cocoa/12">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-forest">
                  {faq.question}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-cocoa/20 text-cocoa transition group-open:rotate-45 group-open:border-forest group-open:text-forest">
                    <Icon name="plus" className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <p className="mt-2.5 max-w-[46rem] pr-10 text-[12.5px] leading-relaxed text-cocoa">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
