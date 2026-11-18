import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Icon } from "@/components/brand";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { CATEGORIES, whatsappLink } from "@/lib/brand";
import { listProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de arreglos florales",
  description:
    "Explora ramos de rosas, peonías, cajas florales y detalles personalizados con entrega en Lima. Precios desde S/ 119.",
};

const SORT_OPTIONS = [
  { id: "recomendados", label: "Recomendados" },
  { id: "precio-asc", label: "Menor precio" },
  { id: "precio-desc", label: "Mayor precio" },
  { id: "novedades", label: "Novedades" },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function buildQuery(params: Record<string, string>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = pick(params.categoria) || "todos";
  const search = pick(params.buscar).trim();
  const sort = pick(params.orden) || "recomendados";

  const products = await listProducts({ category, search, sort });
  const activeCategory = CATEGORIES.find((entry) => entry.slug === category);

  return (
    <>
      <section className="relative overflow-hidden border-b border-cocoa/10 bg-cream/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-[320px] w-[320px] rounded-full bg-rose/20 blur-[90px]"
        />
        <div className="shell relative py-14 lg:py-16">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cocoa/60">
            <Link href="/" className="hover:text-forest">Inicio</Link>
            <span>/</span>
            <span className="text-forest">Catálogo</span>
            {activeCategory ? (
              <>
                <span>/</span>
                <span className="text-cocoa">{activeCategory.short}</span>
              </>
            ) : null}
          </nav>

          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Eyebrow>Colección Floréa</Eyebrow>
              <h1 className="display mt-4 max-w-[42rem] text-[clamp(2.3rem,5vw,3.6rem)]">
                {activeCategory ? activeCategory.short : "Arreglos que hablan por ti"}
              </h1>
              <p className="mt-3 max-w-[38rem] text-[14px] leading-relaxed text-cocoa">
                {activeCategory
                  ? activeCategory.description
                  : "Flores frescas seleccionadas cada mañana, diseñadas a mano en nuestro taller de Miraflores y entregadas en la fecha que elijas."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest">
                <Icon name="truck" className="h-3.5 w-3.5 text-sage-deep" /> Delivery mismo día
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest">
                <Icon name="shield" className="h-3.5 w-3.5 text-sage-deep" /> Pago seguro
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-10">
        <div className="flex flex-col gap-5 border-b border-cocoa/12 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/catalogo${buildQuery({ buscar: search, orden: sort })}`}
              className={`rounded-full border px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] transition ${
                category === "todos"
                  ? "border-forest bg-forest text-cream"
                  : "border-cocoa/20 bg-white/60 text-charcoal hover:border-forest/40 hover:text-forest"
              }`}
            >
              Todos
            </Link>
            {CATEGORIES.map((entry) => (
              <Link
                key={entry.slug}
                href={`/catalogo${buildQuery({
                  categoria: entry.slug,
                  buscar: search,
                  orden: sort,
                })}`}
                className={`rounded-full border px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] transition ${
                  category === entry.slug
                    ? "border-forest bg-forest text-cream"
                    : "border-cocoa/20 bg-white/60 text-charcoal hover:border-forest/40 hover:text-forest"
                }`}
              >
                {entry.short}
              </Link>
            ))}
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <form action="/catalogo" method="get" className="flex w-full max-w-md items-center gap-2">
              {category !== "todos" ? (
                <input type="hidden" name="categoria" value={category} />
              ) : null}
              {sort !== "recomendados" ? <input type="hidden" name="orden" value={sort} /> : null}
              <div className="relative flex-1">
                <Icon
                  name="leaf"
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cocoa/45"
                />
                <input
                  type="search"
                  name="buscar"
                  defaultValue={search}
                  placeholder="Busca rosas, peonías, cajas…"
                  aria-label="Buscar arreglos"
                  className="field !rounded-full !py-2.5 !pl-10"
                />
              </div>
              <button type="submit" className="btn btn-primary !px-5 !py-2.5">
                Buscar
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-cocoa/55">Ordenar:</span>
              {SORT_OPTIONS.map((option) => (
                <Link
                  key={option.id}
                  href={`/catalogo${buildQuery({
                    categoria: category === "todos" ? "" : category,
                    buscar: search,
                    orden: option.id === "recomendados" ? "" : option.id,
                  })}`}
                  className={`rounded-full px-3 py-1.5 text-[10.5px] font-medium tracking-[0.06em] transition ${
                    sort === option.id
                      ? "bg-sage/30 text-forest"
                      : "text-cocoa/70 hover:bg-white/70 hover:text-forest"
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11.5px] text-cocoa/70">
            <p>
              {products.length} {products.length === 1 ? "arreglo" : "arreglos"}
              {search ? (
                <>
                  {" "}para <span className="font-semibold text-forest">“{search}”</span>
                </>
              ) : null}
            </p>
            {search || category !== "todos" ? (
              <Link href="/catalogo" className="font-semibold text-forest underline decoration-sage decoration-2 underline-offset-4">
                Limpiar filtros
              </Link>
            ) : null}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 rounded-[26px] border border-dashed border-cocoa/25 bg-cream/60 px-6 py-16 text-center">
            <Icon name="sparkle" className="h-8 w-8 text-sage-deep" />
            <h2 className="font-serif text-2xl text-forest">Aún no tenemos ese arreglo…</h2>
            <p className="max-w-md text-[13px] text-cocoa">
              Cuéntanos qué flores imaginas y lo diseñamos especialmente para ti.
              También podemos revisar disponibilidad por WhatsApp.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Link href="/personalizar" className="btn btn-dark">Diseñar a medida</Link>
              <a
                href={whatsappLink("¡Hola Floréa! Busco un arreglo en particular: ")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Icon name="whatsapp" className="h-4 w-4" /> Consultar
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={(index % 3) * 70}>
                <ProductCard product={product} priority={index < 3} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="shell pb-4">
        <Reveal className="flex flex-col items-center justify-between gap-5 rounded-[26px] bg-forest px-7 py-9 text-cream sm:flex-row sm:px-10">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.28em] text-gold">
              ¿Buscas algo único?
            </p>
            <h2 className="mt-2 font-serif text-[26px] leading-tight">
              Diseñamos tu ramo desde cero.
            </h2>
            <p className="mt-1.5 text-[12.5px] text-cream/70">
              Elige flores, colores, tamaño y fecha de entrega en nuestro configurador.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/personalizar" className="btn btn-rose">Personalizar</Link>
            <a
              href={whatsappLink("¡Hola Floréa! Quiero un arreglo personalizado.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
