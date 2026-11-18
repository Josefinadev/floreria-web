"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AmbientVideo } from "@/components/ambient-video";
import { Icon } from "@/components/brand";
import type { Occasion } from "@/lib/media";

export function OccasionGallery({ occasions }: { occasions: Occasion[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 16 : 1;
    setActive(Math.round(track.scrollLeft / width));
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Momentos</p>
          <h2 className="display mt-2 text-[clamp(2rem,4.4vw,3.1rem)]">
            Cada ocasión tiene su flor.
          </h2>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Ver momentos anteriores"
            className="grid h-10 w-10 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-cream"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Ver más momentos"
            className="grid h-10 w-10 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-cream"
          >
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {occasions.map((occasion, index) => (
          <Link
            key={occasion.id}
            href={occasion.href}
            data-card
            className={`group relative w-[74vw] shrink-0 snap-start overflow-hidden rounded-[26px] bg-forest sm:w-[300px] lg:w-[336px] ${
              index === 0 ? "" : ""
            }`}
          >
            <div className="relative aspect-[3/4.2] w-full overflow-hidden">
              {occasion.video && occasion.poster ? (
                <AmbientVideo
                  src={occasion.video}
                  poster={occasion.poster}
                  label={`Flores para ${occasion.label}`}
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={occasion.image}
                  alt={occasion.label}
                  loading={index < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/15 to-transparent" />

            <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-forest-deep/55 px-3 py-1.5 text-[8.5px] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur">
              {occasion.video ? (
                <>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose" /> Video
                </>
              ) : (
                <>
                  <span className="h-1 w-1 rounded-full bg-rose" /> {index === 0 ? "Más pedido" : "Floréa"}
                </>
              )}
            </span>

            <div className="absolute inset-x-5 bottom-5 text-cream">
              <span className="font-serif text-[11px] tracking-[0.24em] text-cream/50">
                0{index + 1}
              </span>
              <p className="mt-1 font-serif text-[26px] leading-none">{occasion.label}</p>
              <p className="mt-1.5 text-[11px] tracking-[0.02em] text-cream/70">
                {occasion.copy}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-rose opacity-0 transition-all duration-500 group-hover:opacity-100">
                Ver flores <Icon name="arrow" className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between sm:hidden">
        <div className="flex items-center gap-1.5">
          {occasions.map((occasion, index) => (
            <span
              key={occasion.id}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? "w-6 bg-forest" : "w-1.5 bg-cocoa/25"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest"
        >
          Siguiente <Icon name="arrow" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
