import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, FlowerMark, Icon, Stars } from "@/components/brand";
import { AddToCartButton } from "@/components/cart";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import {
  BRAND,
  categoryName,
  formatPrice,
  whatsappLink,
} from "@/lib/brand";
import { getProductBySlug, listProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Arreglo no encontrado" };
  return {
    title: `${product.name} · ${product.tagline}`,
    description: product.description,
    openGraph: {
      title: `${product.name} · FLORÉA`,
      description: product.description,
      images: [{ url: product.imageUrl, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: RouteParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await listProducts({});
  const related = all.filter((entry) => entry.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="shell pt-8 pb-16 lg:pb-20">
        <nav
          aria-label="Ruta de navegación"
          className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-cocoa/60"
        >
          <Link href="/" className="hover:text-forest">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-forest">Catálogo</Link>
          <span>/</span>
          <Link
            href={`/catalogo?categoria=${product.category}`}
            className="hover:text-forest"
          >
            {categoryName(product.category)}
          </Link>
          <span>/</span>
          <span className="text-forest">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-x-[6%] -top-3 bottom-10 rounded-t-[240px] rounded-b-[36px] border border-gold/35"
            />
            <div className="relative overflow-hidden rounded-t-[240px] rounded-b-[32px] bg-sand shadow-[0_30px_70px_-40px_rgba(22,63,51,0.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={`${product.name} · ${product.tagline}`}
                className="h-[430px] w-full object-cover sm:h-[560px] lg:h-[640px]"
              />
              {product.badge ? (
                <span className="absolute top-6 left-6 rounded-full bg-cream/95 px-4 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-forest">
                  {product.badge}
                </span>
              ) : null}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-cocoa/12 bg-white/70 px-5 py-4">
              <div className="flex items-center gap-3">
                <FlowerMark className="h-8 w-8 text-sage-deep" />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cocoa/65">
                    Incluido en tu pedido
                  </p>
                  <p className="mt-0.5 text-[12px] text-forest">
                    Dedicatoria caligrafiada + empaque marfil con cinta de satín
                  </p>
                </div>
              </div>
              <Icon name="gift" className="hidden h-6 w-6 shrink-0 text-gold sm:block" />
            </div>
          </div>

          <div>
            <Eyebrow>{categoryName(product.category)}</Eyebrow>
            <h1 className="display mt-4 text-[clamp(2.2rem,4.6vw,3.3rem)]">
              {product.name}
            </h1>
            <p className="mt-2 font-serif text-[17px] text-cocoa italic">
              {product.tagline}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <p className="font-serif text-[30px] text-forest">
                {formatPrice(product.priceCents)}
              </p>
              <span className="rounded-full bg-sage/20 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-forest">
                Precio base · Clásico
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2.5">
              <Stars />
              <span className="text-[11px] text-cocoa/70">
                4.9 · Valorado por clientas de Lima
              </span>
            </div>

            <p className="mt-6 max-w-[34rem] text-[14px] leading-relaxed text-cocoa">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.stems
                .split("·")
                .map((stem) => stem.trim())
                .filter(Boolean)
                .map((stem) => (
                  <span
                    key={stem}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cocoa/20 bg-white/60 px-3 py-1.5 text-[10.5px] tracking-[0.04em] text-cocoa"
                  >
                    <Icon name="leaf" className="h-3 w-3 text-sage-deep" /> {stem}
                  </span>
                ))}
            </div>

            <AddToCartButton
              product={{
                slug: product.slug,
                name: product.name,
                imageUrl: product.imageUrl,
                priceCents: product.priceCents,
              }}
              variant="full"
              withSizes
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cocoa/12 bg-white/60 p-4">
                <p className="flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-forest">
                  <Icon name="calendar" className="h-4 w-4 text-sage-deep" /> Fecha de entrega
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-cocoa">
                  Elige día y horario en el checkout. Pide antes de las 2 p.m. para
                  entrega el mismo día en Lima.
                </p>
              </div>
              <div className="rounded-2xl border border-cocoa/12 bg-white/60 p-4">
                <p className="flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-forest">
                  <Icon name="lock" className="h-4 w-4 text-sage-deep" /> Pago online
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-cocoa">
                  Tarjeta, Yape, Plin o transferencia. Confirmamos cada pago de forma
                  segura y por WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-sage/40 bg-sage/10 p-4">
              <p className="text-[12px] leading-relaxed text-cocoa">
                <strong className="text-forest">¿Es un regalo sorpresa?</strong>{" "}
                Coordinamos la entrega con quien recibe sin revelar el obsequio.
                Cuéntanos por{" "}
                <a
                  href={whatsappLink(
                    `¡Hola Floréa! Quiero coordinar la entrega sorpresa de "${product.name}".`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-forest underline decoration-sage decoration-2 underline-offset-2"
                >
                  WhatsApp
                </a>{" "}
                al {BRAND.whatsappDisplay}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-cocoa/12 bg-cream/70 py-14">
        <div className="shell grid gap-8 md:grid-cols-3">
          {[
            {
              icon: "scissors",
              title: "Cortadas esta mañana",
              copy: "Seleccionamos tallos frescos de temporada el mismo día de tu entrega.",
            },
            {
              icon: "truck",
              title: "Delivery cuidadoso",
              copy: "Viajan hidratadas y protegidas. Entregamos a la hora que elegiste.",
            },
            {
              icon: "heart",
              title: "Detalle que emociona",
              copy: "Empaque marfil, cinta rosa y tarjeta con tu dedicatoria escrita a mano.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage/25 text-forest">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-serif text-[19px] text-forest">{item.title}</h2>
                <p className="mt-1 text-[12.5px] leading-relaxed text-cocoa">{item.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="shell py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>También te puede enamorar</Eyebrow>
              <h2 className="display mt-3 text-[clamp(1.8rem,3.4vw,2.5rem)]">
                Combina tu regalo
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-forest hover:text-cocoa"
            >
              Ver catálogo <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry, index) => (
              <Reveal key={entry.slug} delay={index * 70}>
                <ProductCard product={entry} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
