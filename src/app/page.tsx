import Link from "next/link";
import { AmbientVideo } from "@/components/ambient-video";
import { Eyebrow, FlowerMark, Icon, Stars } from "@/components/brand";
import { AddToCartButton } from "@/components/cart";
import { Reveal } from "@/components/reveal";
import { BRAND, formatPrice, whatsappLink } from "@/lib/brand";
import type { CatalogProduct } from "@/lib/data";
import { listProducts } from "@/lib/data";
import { ATELIER_GALLERY, INSTAGRAM_STRIP, OCCASIONS, VIDEOS } from "@/lib/media";

export const dynamic = "force-dynamic";

const MOMENT_LAYOUT = [
  "col-span-2 row-span-2 md:col-span-5 md:row-span-2",
  "col-span-1 row-span-2 md:col-span-3 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-4 md:row-span-1",
  "col-span-1 row-span-2 md:col-span-4 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-4 md:row-span-1",
  "col-span-2 row-span-1 md:col-span-4 md:row-span-1",
  "col-span-1 row-span-1 md:col-span-4 md:row-span-1",
];

const TRUST = [
  { icon: "truck", title: "Envío en Lima", copy: "El mismo día" },
  { icon: "leaf", title: "Flores frescas", copy: "Elegidas cada mañana" },
  { icon: "gift", title: "Empaque de autor", copy: "Marfil · cinta rosa" },
  { icon: "lock", title: "Compra segura", copy: "Pago protegido" },
];

export default async function HomePage() {
  const featured = await listProducts({ featuredOnly: true });
  const hero = featured[0];

  return (
    <>
      {/* PORTADA EDITORIAL */}
      <section className="relative overflow-hidden bg-ivory">
        <div className="pointer-events-none absolute -top-24 -left-24 h-[360px] w-[360px] rounded-full bg-rose/15 blur-[100px]" />
        <div className="shell relative grid items-center gap-7 pt-8 pb-8 sm:pt-12 sm:pb-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:pt-10 lg:pb-10">
          <div className="relative z-10 order-2 flex flex-col justify-center lg:order-1 lg:py-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-gold" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-cocoa">
                Estudio floral · Lima
              </p>
            </div>

            <h1 className="mt-7 max-w-[10ch] font-serif text-[clamp(3.7rem,8.2vw,7.2rem)] leading-[0.82] tracking-[-0.055em] text-forest">
              Flores que
              <br />
              <span className="ml-[0.36em] text-cocoa italic">dicen</span>
              <br />
              <span className="text-rose">lo esencial.</span>
            </h1>

            <p className="mt-7 max-w-[21rem] text-[13px] leading-[1.8] text-cocoa/85 sm:text-[14px]">
              Arreglos nacidos de una historia, hechos a mano en Miraflores y
              entregados con todo el cuidado que merece.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link href="/catalogo" className="btn btn-dark !px-5 !py-3">
                Explorar flores <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link
                href="/personalizar"
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-forest transition hover:bg-sage/20"
              >
                Crear mi arreglo <Icon name="arrow" className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-cocoa/15 pt-5">
              <div className="flex items-center gap-2">
                <Stars />
                <span className="text-[10.5px] text-cocoa/75">4.9 / 5</span>
              </div>
              <span className="h-5 w-px bg-cocoa/20" />
              <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/70">
                Más de 1,200 momentos florecidos
              </p>
            </div>
          </div>

          <div className="relative order-1 min-h-[360px] sm:min-h-[510px] lg:order-2 lg:min-h-[650px]">
            <div className="absolute inset-x-[5%] top-0 bottom-[4%] overflow-hidden rounded-t-[48%] rounded-b-[2px] bg-forest">
              <AmbientVideo
                src={VIDEOS.hero.src}
                poster={VIDEOS.hero.poster}
                label={VIDEOS.hero.label}
                eager
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/55 via-transparent to-forest-deep/10" />
              <span className="absolute top-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-cream/30 bg-forest-deep/25 px-3.5 py-2 text-[8px] font-semibold uppercase tracking-[0.24em] text-cream/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose" />
                En el atelier
              </span>
              <p className="absolute right-5 bottom-5 font-serif text-[12px] tracking-[0.28em] text-cream/75">
                FLORÉA · MMXXVI
              </p>
            </div>

            <div className="absolute top-[17%] -left-1 hidden w-[124px] -rotate-6 overflow-hidden rounded-t-[70px] rounded-b-[8px] border-[5px] border-ivory shadow-[0_18px_34px_-18px_rgba(22,63,51,0.45)] sm:block lg:-left-2 lg:w-[150px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ATELIER_GALLERY[1]}
                alt="Detalle de flores seleccionadas a mano"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>

            {hero ? (
              <Link
                href={`/catalogo/${hero.slug}`}
                className="group absolute right-0 bottom-[7%] flex w-[min(82%,310px)] items-center gap-3 border border-ivory/75 bg-cream/95 p-2.5 shadow-[0_18px_46px_-25px_rgba(22,63,51,0.5)] backdrop-blur-md transition hover:-translate-y-1"
              >
                <div className="h-[64px] w-[56px] shrink-0 overflow-hidden bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.imageUrl}
                    alt={hero.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-cocoa/65">
                    Favorito del taller
                  </p>
                  <p className="mt-0.5 truncate font-serif text-[17px] text-forest">
                    {hero.name}
                  </p>
                  <p className="text-[10.5px] text-cocoa">Desde {formatPrice(hero.priceCents)}</p>
                </div>
                <Icon name="arrow" className="mr-1 h-4 w-4 shrink-0 text-forest transition group-hover:translate-x-1" />
              </Link>
            ) : null}

            <span className="absolute top-[15%] right-0 hidden rotate-90 text-[8px] font-medium uppercase tracking-[0.32em] text-cocoa/55 [transform-origin:right] lg:block">
              Flores escogidas con intención
            </span>

            <div className="absolute bottom-[1%] left-[11%] hidden items-center gap-2 text-cocoa/60 lg:flex">
              <FlowerMark className="h-6 w-6" />
              <span className="font-serif text-[12px] italic">Emociones que florecen</span>
            </div>
          </div>
        </div>

        <div className="shell pb-7 lg:pb-9">
          <div className="grid grid-cols-2 gap-3 border-t border-cocoa/15 pt-4 sm:grid-cols-4 sm:gap-5">
            {TRUST.map((item) => (
              <div key={item.title} className="flex items-center gap-2.5 sm:gap-3">
                <Icon name={item.icon} className="h-[17px] w-[17px] shrink-0 text-sage-deep" />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-forest sm:text-[10px]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-cocoa/65">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OCASIONES: MOSAICO FOTOGRÁFICO */}
      <section className="bg-[#f1e9df] py-14 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Flores para vivirlo</Eyebrow>
              <h2 className="display mt-3 max-w-[15ch] text-[clamp(2.1rem,4.7vw,3.5rem)]">
                Hay momentos que merecen flores.
              </h2>
            </div>
            <p className="max-w-[260px] pb-1 text-[12px] leading-relaxed text-cocoa/75">
              Para celebrar, agradecer, recordar y decir lo que llevas dentro.
            </p>
          </Reveal>

          <div className="grid auto-rows-[122px] grid-cols-2 gap-2.5 sm:auto-rows-[168px] sm:gap-3 md:auto-rows-[185px] md:grid-cols-12 md:gap-3.5">
            {OCCASIONS.map((occasion, index) => (
              <Reveal
                key={occasion.id}
                delay={(index % 4) * 55}
                className={`group relative overflow-hidden bg-sand ${MOMENT_LAYOUT[index] ?? "col-span-1 row-span-1 md:col-span-4"}`}
              >
                <Link
                  href={occasion.href}
                  className="absolute inset-0"
                  aria-label={`Ver flores para ${occasion.label}`}
                >
                  {occasion.video && occasion.poster ? (
                    <AmbientVideo
                      src={occasion.video}
                      poster={occasion.poster}
                      label={`Flores para ${occasion.label}`}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={occasion.image}
                      alt={`Flores Floréa para ${occasion.label.toLowerCase()}`}
                      loading={index < 3 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/5 to-transparent" />
                  <span className="absolute top-3 left-3 font-serif text-[10px] tracking-[0.2em] text-cream/75 sm:top-4 sm:left-4">
                    0{index + 1}
                  </span>
                  {occasion.video ? (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 border border-cream/35 bg-forest-deep/30 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.16em] text-cream backdrop-blur-sm sm:top-4 sm:right-4">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-rose" /> En movimiento
                    </span>
                  ) : null}
                  <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
                    <span>
                      <span className="block font-serif text-[19px] leading-none text-cream sm:text-[23px]">
                        {occasion.label}
                      </span>
                      <span className="mt-1 block text-[9px] text-cream/75 sm:text-[10px]">
                        {occasion.copy}
                      </span>
                    </span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center border border-cream/45 text-cream transition group-hover:bg-cream group-hover:text-forest sm:h-9 sm:w-9">
                      <Icon name="arrow" className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LOS MÁS ELEGIDOS */}
      <section className="shell py-16 sm:py-20 lg:py-24">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Selección del atelier</Eyebrow>
            <h2 className="display mt-3 text-[clamp(2.1rem,4.7vw,3.3rem)]">
              Los más queridos.
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="mb-1 hidden items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-forest transition hover:text-cocoa sm:inline-flex"
          >
            Ver colección completa <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-6">
          {featured.slice(0, 4).map((product, index) => (
            <Reveal key={product.slug} delay={index * 70}>
              <HomeProduct product={product} number={index + 1} />
            </Reveal>
          ))}
        </div>

        <Link href="/catalogo" className="btn btn-outline mt-8 w-full sm:hidden">
          Ver todos los arreglos <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </section>

      {/* PAUSA VISUAL / VIDEO ATELIER */}
      <section className="relative overflow-hidden bg-forest-deep text-cream">
        <div className="grid lg:min-h-[560px] lg:grid-cols-2">
          <div className="relative min-h-[350px] overflow-hidden sm:min-h-[490px] lg:min-h-0">
            <AmbientVideo
              src={VIDEOS.atelier.src}
              poster={VIDEOS.atelier.poster}
              label={VIDEOS.atelier.label}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/55 via-transparent to-transparent" />
            <div className="absolute right-5 bottom-5 left-5 flex items-center justify-between">
              <span className="flex items-center gap-2 border border-cream/35 bg-forest-deep/30 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose" />
                Detrás de cada ramo
              </span>
              <FlowerMark className="h-8 w-8 text-cream/75" />
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-[clamp(3rem,7vw,7rem)] lg:py-16">
            <Eyebrow className="[&_.eyebrow]:text-gold">El arte de regalar</Eyebrow>
            <h2 className="mt-5 max-w-[11ch] font-serif text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.035em]">
              Hecho con las manos.
              <span className="mt-1 block text-rose italic">Entregado con el alma.</span>
            </h2>
            <p className="mt-5 max-w-[24rem] text-[12.5px] leading-[1.8] text-cream/70">
              Flores frescas, papel marfil y una cinta rosa. El ritual es tan
              importante como el regalo.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/personalizar" className="btn btn-rose !px-5 !py-3">
                Diseña tu arreglo <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink("¡Hola Floréa! Quiero crear un arreglo personalizado.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2 py-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-cream/75 transition hover:text-cream"
              >
                <Icon name="whatsapp" className="h-4 w-4 text-gold" />
                Habla con una florista
              </a>
            </div>
            <div className="mt-9 flex items-center gap-3 border-t border-cream/15 pt-5">
              <FlowerMark className="h-7 w-7 shrink-0 text-gold" />
              <p className="font-serif text-[14px] italic text-cream/75">
                “Gracias por permitirnos ser parte de tus momentos especiales.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DETALLES DE MARCA */}
      <section className="shell py-14 sm:py-16">
        <div className="grid gap-8 md:grid-cols-[0.72fr_1.28fr] md:items-center">
          <Reveal className="relative mx-auto w-full max-w-[360px]">
            <div className="grid grid-cols-2 gap-2.5">
              {ATELIER_GALLERY.slice(0, 4).map((image, index) => (
                <div
                  key={image}
                  className={`overflow-hidden bg-sand ${index === 0 ? "rounded-t-[100px]" : ""} ${index === 3 ? "rounded-b-[100px]" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Flores y detalles Floréa"
                    loading="lazy"
                    className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <span className="absolute -right-3 top-1/2 grid h-16 w-16 -translate-y-1/2 place-items-center rounded-full border border-gold/60 bg-ivory font-serif text-[10px] uppercase leading-tight tracking-[0.12em] text-cocoa">
              hecho
              <br />
              con amor
            </span>
          </Reveal>

          <Reveal className="md:pl-5">
            <Eyebrow>Un detalle, mil emociones</Eyebrow>
            <h2 className="display mt-4 max-w-[13ch] text-[clamp(2.2rem,4.8vw,3.5rem)]">
              Cada flor tiene algo que decir.
            </h2>
            <p className="mt-4 max-w-[30rem] text-[13px] leading-[1.85] text-cocoa/80">
              Amor, gratitud, alegría o compañía. Cuéntanos qué quieres expresar y
              una florista lo convertirá en un arreglo hecho solo para esa persona.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "A mano en Miraflores",
                "Flores de temporada",
                "Dedicatoria caligrafiada",
              ].map((text) => (
                <span
                  key={text}
                  className="border border-cocoa/20 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.14em] text-cocoa"
                >
                  {text}
                </span>
              ))}
            </div>
            <Link
              href="/nosotros"
              className="mt-7 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-forest transition hover:gap-3"
            >
              Conoce Floréa <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CUADRÍCULA DE INSPIRACIÓN */}
      <section className="border-y border-cocoa/12 bg-cream/70 py-12 sm:py-14">
        <div className="shell">
          <Reveal className="mb-6 flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Un poco de belleza</Eyebrow>
              <h2 className="display mt-2 text-[clamp(1.8rem,3.6vw,2.6rem)]">
                Desde nuestro jardín.
              </h2>
            </div>
            <a
              href="https://instagram.com/florea.floral"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-forest"
            >
              <Icon name="instagram" className="h-4 w-4" />
              <span className="hidden sm:inline">{BRAND.instagram}</span>
            </a>
          </Reveal>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
            {INSTAGRAM_STRIP.map((image, index) => (
              <Reveal key={image} delay={index * 45}>
                <a
                  href="https://instagram.com/florea.floral"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver inspiración floral Floréa ${index + 1} en Instagram`}
                  className="group relative block overflow-hidden bg-sand"
                >
                  <div className="aspect-[0.82] overflow-hidden sm:aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt="Inspiración floral Floréa"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <span className="absolute inset-0 grid place-items-center bg-forest-deep/35 text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Icon name="instagram" className="h-5 w-5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="shell py-12 sm:py-16">
        <Reveal className="relative overflow-hidden border border-cocoa/15 bg-ivory px-6 py-9 sm:px-10 sm:py-11">
          <div className="pointer-events-none absolute -right-12 -bottom-20 opacity-[0.11]">
            <FlowerMark className="h-56 w-56 text-forest" />
          </div>
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-cocoa">
                {BRAND.city} · {BRAND.hours}
              </p>
              <h2 className="mt-3 max-w-[18ch] font-serif text-[clamp(1.9rem,4vw,2.9rem)] leading-tight text-forest">
                Hay cosas que solo las flores saben decir.
              </h2>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <Link href="/catalogo" className="btn btn-dark !px-5 !py-3">
                Elegir flores
              </Link>
              <a
                href={whatsappLink("¡Hola Floréa! Quiero pedir flores para una ocasión especial.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar Floréa por WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full border border-forest/25 text-forest transition hover:bg-forest hover:text-cream"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function HomeProduct({
  product,
  number,
}: {
  product: CatalogProduct;
  number: number;
}) {
  return (
    <article className="group min-w-0">
      <Link
        href={`/catalogo/${product.slug}`}
        className="relative block overflow-hidden bg-sand"
        aria-label={`Ver ${product.name}`}
      >
        <div className="aspect-[0.78] overflow-hidden sm:aspect-[0.83]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={`${product.name} · ${product.tagline}`}
            loading={number <= 2 ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.055]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/50 via-transparent to-transparent opacity-70" />
        <span className="absolute top-3 left-3 font-serif text-[10px] tracking-[0.18em] text-cream/85 sm:top-4 sm:left-4">
          0{number}
        </span>
        {product.badge ? (
          <span className="absolute top-3 right-3 bg-ivory/95 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.14em] text-forest sm:top-4 sm:right-4 sm:px-2.5">
            {product.badge}
          </span>
        ) : null}
        <span className="absolute right-3 bottom-3 left-3 flex items-center justify-between text-cream sm:right-4 sm:bottom-4 sm:left-4">
          <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-cream/80">
            {product.tagline}
          </span>
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-1.5">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-[17px] leading-tight text-forest sm:text-[20px]">
            <Link href={`/catalogo/${product.slug}`} className="hover:text-cocoa">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-[10.5px] text-cocoa/70">
            {formatPrice(product.priceCents)}
          </p>
        </div>
        <AddToCartButton
          product={{
            slug: product.slug,
            name: product.name,
            imageUrl: product.imageUrl,
            priceCents: product.priceCents,
          }}
          className="!px-2.5 !py-1.5 !text-[8px] sm:!px-3.5 sm:!py-2"
        />
      </div>
    </article>
  );
}
