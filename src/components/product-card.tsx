import Link from "next/link";
import { Icon } from "@/components/brand";
import { AddToCartButton } from "@/components/cart";
import { formatPrice } from "@/lib/brand";
import type { CatalogProduct } from "@/lib/data";

export function ProductCard({
  product,
  priority = false,
}: {
  product: CatalogProduct;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/catalogo/${product.slug}`}
        className="relative block overflow-hidden rounded-[24px] bg-sand"
        aria-label={`Ver ${product.name}`}
      >
        <div className="aspect-[4/5] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={`${product.name} · ${product.tagline}`}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/45 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
        {product.badge ? (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-cream/95 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-forest shadow-sm">
            {product.badge}
          </span>
        ) : null}
        <span className="absolute right-3.5 bottom-3.5 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-cream/95 px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-forest opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Ver detalle <Icon name="arrow" className="h-3.5 w-3.5" />
        </span>
        <span className="absolute bottom-4 left-4 font-serif text-[13px] text-cream/90 italic drop-shadow">
          {product.tagline}
        </span>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-[20px] leading-tight text-forest">
            <Link href={`/catalogo/${product.slug}`} className="link-quiet">
              {product.name}
            </Link>
          </h3>
          <p className="shrink-0 pt-1 font-serif text-[18px] text-cocoa">
            {formatPrice(product.priceCents)}
          </p>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-cocoa/80">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-cocoa/10 pt-3">
          <AddToCartButton
            product={{
              slug: product.slug,
              name: product.name,
              imageUrl: product.imageUrl,
              priceCents: product.priceCents,
            }}
          />
          <span className="text-[10px] uppercase tracking-[0.14em] text-cocoa/55">
            {product.stems.split("·")[0]?.trim()}
          </span>
        </div>
      </div>
    </article>
  );
}
