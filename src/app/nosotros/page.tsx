import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, FlowerMark, Icon, Logo } from "@/components/brand";
import { Reveal } from "@/components/reveal";
import { BRAND, IMAGES, whatsappLink } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description:
    "Floréa es una florería boutique en Lima que transforma momentos especiales en experiencias memorables mediante arreglos florales personalizados.",
};

const VALUES = [
  {
    title: "Creatividad",
    copy: "Cada diseño nace de una conversación, no de un catálogo rígido. Escuchamos tu historia y la traducimos en flores.",
    icon: "sparkle",
  },
  {
    title: "Calidad",
    copy: "Seleccionamos proveedores locales y flores de temporada. Si un tallo no está impecable, no llega a tu arreglo.",
    icon: "leaf",
  },
  {
    title: "Responsabilidad",
    copy: "Confirmamos disponibilidad antes de prometer, cuidamos cada detalle y asumimos los ajustes que hagan falta.",
    icon: "shield",
  },
  {
    title: "Puntualidad",
    copy: "Tu fecha y horario son un compromiso. Coordinamos la entrega con quien recibe para que la sorpresa funcione.",
    icon: "clock",
  },
  {
    title: "Atención personalizada",
    copy: "Respondemos por WhatsApp, enviamos la foto del arreglo antes de salir y acompañamos después de la entrega.",
    icon: "heart",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-cocoa/10 bg-cream/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-[340px] w-[340px] rounded-full bg-rose/20 blur-[100px]"
        />
        <div className="shell relative grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cocoa/60">
              <Link href="/" className="hover:text-forest">Inicio</Link>
              <span>/</span>
              <span className="text-forest">Nosotros</span>
            </nav>
            <Eyebrow className="mt-6">Nuestra historia</Eyebrow>
            <h1 className="display mt-4 max-w-[36rem] text-[clamp(2.4rem,5.2vw,3.8rem)]">
              Nacimos para hacer
              <span className="text-cocoa italic"> florecer emociones.</span>
            </h1>
            <p className="mt-5 max-w-[34rem] text-[14px] leading-relaxed text-cocoa">
              Floréa es una florería boutique en Lima que transforma momentos
              especiales en experiencias memorables mediante arreglos florales
              personalizados. Creemos que un ramo no es un objeto: es un mensaje
              con perfume, color y textura.
            </p>
            <p className="mt-3 max-w-[34rem] text-[14px] leading-relaxed text-cocoa">
              Trabajamos desde nuestro atelier en Miraflores, rodeadas de papel
              marfil, cintas de satín y flores que llegan cada madrugada. Cada
              pedido se arma a mano, pensando en quien lo recibe.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn btn-primary">
                Conoce nuestros arreglos <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink("¡Hola Floréa! Quisiera conocer más sobre ustedes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Icon name="whatsapp" className="h-4 w-4" /> Salúdanos
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div
              aria-hidden="true"
              className="absolute inset-x-[7%] -top-4 bottom-8 rounded-t-[220px] rounded-b-[36px] border border-gold/40"
            />
            <div className="relative overflow-hidden rounded-t-[220px] rounded-b-[32px] bg-sand shadow-[0_30px_70px_-40px_rgba(22,63,51,0.55)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMAGES.story}
                alt="Florista de Floréa preparando un ramo"
                className="h-[420px] w-full object-cover sm:h-[500px]"
              />
            </div>
            <div className="absolute -bottom-4 -left-2 rounded-2xl border border-gold/40 bg-forest px-5 py-3 text-cream shadow-lg">
              <p className="text-[8.5px] uppercase tracking-[0.22em] text-gold">
                Desde 2021
              </p>
              <p className="font-serif text-[15px]">Atelier Miraflores</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              label: "Misión",
              icon: "heart",
              copy: "Crear arreglos florales únicos que transmitan sentimientos y acompañen los momentos más importantes de nuestros clientes.",
            },
            {
              label: "Visión",
              icon: "sparkle",
              copy: "Convertirnos en una florería reconocida por la creatividad, calidad y personalización de nuestros arreglos florales.",
            },
          ].map((item, index) => (
            <Reveal
              key={item.label}
              delay={index * 90}
              className="relative overflow-hidden rounded-[26px] border border-cocoa/12 bg-white/65 p-7"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-sage/20 text-forest">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <p className="eyebrow mt-5">{item.label}</p>
              <p className="mt-2.5 font-serif text-[20px] leading-snug text-forest">
                {item.copy}
              </p>
              <FlowerMark className="absolute -right-3 -bottom-3 h-24 w-24 text-sage/25" />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <Eyebrow>Lo que nos mueve</Eyebrow>
          <h2 className="display mt-3 text-[clamp(1.9rem,3.6vw,2.6rem)]">
            Cinco valores en cada tallo
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value, index) => (
            <Reveal
              key={value.title}
              delay={(index % 3) * 80}
              className="rounded-[22px] border border-cocoa/12 bg-cream/70 p-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-rose/20 text-cocoa">
                <Icon name={value.icon} className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 font-serif text-[20px] text-forest">{value.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-cocoa">{value.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pb-16">
        <Reveal className="grid items-center gap-0 overflow-hidden rounded-[30px] bg-forest text-cream lg:grid-cols-2">
          <div className="relative min-h-[300px] lg:min-h-[440px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMAGES.atelier}
              alt="Atelier de Floréa en Miraflores"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="px-7 py-11 sm:px-11">
            <Eyebrow className="[&_.eyebrow]:text-gold">La identidad Floréa</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.5rem)] leading-tight">
              Marfil, salvia y rosa empolvado
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-cream/70">
              Nuestra paleta viene del jardín: marfil para la calma, verde salvia
              para la naturaleza, rosa empolvado para el romance y marrón floral
              para la tierra. Nuestro empaque es papel marfil con cinta rosa y una
              tarjeta escrita a mano.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { name: "Marfil", hex: "#F7F1E9" },
                { name: "Salvia", hex: "#A8B5A0" },
                { name: "Rosa", hex: "#D9A6A9" },
                { name: "Marrón floral", hex: "#795B50" },
                { name: "Bosque", hex: "#163F33" },
              ].map((color) => (
                <span
                  key={color.hex}
                  className="flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 py-1.5 pr-3 pl-1.5 text-[10px] uppercase tracking-[0.12em] text-cream/80"
                >
                  <span
                    className="h-5 w-5 rounded-full border border-cream/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </span>
              ))}
            </div>
            <p className="mt-6 rounded-2xl border border-cream/15 bg-cream/5 px-4 py-3 font-serif text-[15px] text-cream/85 italic">
              «Gracias por permitirnos ser parte de tus momentos especiales.»
            </p>
            <div className="mt-6 flex items-center gap-3 text-cream/60">
              <Logo tone="light" compact />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell pb-16">
        <Reveal className="flex flex-col items-center justify-between gap-5 rounded-[26px] border border-cocoa/12 bg-cream/80 px-7 py-9 text-center sm:flex-row sm:text-left">
          <div>
            <p className="eyebrow">Síguenos</p>
            <h2 className="mt-2 font-serif text-[24px] text-forest">
              Historias frescas en {BRAND.instagram}
            </h2>
            <p className="mt-1 text-[12.5px] text-cocoa">
              Flores del día, detrás de cámara y fechas especiales en nuestras redes.
            </p>
          </div>
          <div className="flex gap-2.5">
            {[
              { name: "instagram", href: "https://instagram.com/florea.floral" },
              { name: "facebook", href: "https://facebook.com" },
              { name: "tiktok", href: "https://tiktok.com/@florea.flores" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="grid h-10 w-10 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-cream"
              >
                <Icon name={social.name} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
