"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FlowerMark, Icon, Logo } from "@/components/brand";
import { CartButton } from "@/components/cart";
import { BRAND, whatsappLink } from "@/lib/brand";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/personalizar", label: "Personalizar" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60] print:hidden">
      <div className="bg-forest-deep text-cream">
        <div className="shell flex items-center justify-center gap-3 py-2 text-[9.5px] font-medium uppercase tracking-[0.22em] sm:justify-between">
          <p className="flex items-center gap-2">
            <Icon name="truck" className="h-3.5 w-3.5 text-gold" />
            <span className="hidden sm:inline">Delivery el mismo día en Lima</span>
            <span className="sm:hidden">Delivery mismo día en Lima</span>
          </p>
          <p className="hidden items-center gap-2 sm:flex">
            <Icon name="leaf" className="h-3.5 w-3.5 text-gold" />
            Envío gratis desde S/ 249
          </p>
          <p className="hidden items-center gap-2 md:flex">
            <Icon name="lock" className="h-3.5 w-3.5 text-gold" />
            Pago online seguro
          </p>
        </div>
      </div>

      <div className="border-b border-cocoa/12 bg-ivory/92 backdrop-blur-md">
        <div className="shell flex items-center justify-between gap-4 py-3.5">
          <Link href="/" aria-label="Floréa, ir al inicio" className="shrink-0">
            <Logo compact />
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={active}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={whatsappLink(
                "¡Hola Floréa! Quisiera información sobre sus arreglos florales.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-forest/20 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-forest transition hover:bg-forest hover:text-cream xl:inline-flex"
            >
              <Icon name="whatsapp" className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <Link href="/personalizar" className="btn btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
              Diseña tu ramo
            </Link>
            <CartButton />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest transition hover:bg-forest hover:text-cream lg:hidden"
            >
              <Icon name={menuOpen ? "close" : "menu"} className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="animate-fade border-t border-cocoa/12 bg-cream lg:hidden">
            <nav aria-label="Navegación móvil" className="shell flex flex-col py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-cocoa/8 py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] text-charcoal last:border-b-0"
                >
                  {link.label}
                  <Icon name="arrow" className="h-4 w-4 text-sage-deep" />
                </Link>
              ))}
              <a
                href={whatsappLink(
                  "¡Hola Floréa! Quisiera información sobre sus arreglos florales.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="btn btn-dark mt-4"
              >
                <Icon name="whatsapp" className="h-4 w-4" /> Escríbenos por WhatsApp
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Error");
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-2xl border border-gold/40 bg-white/5 px-4 py-3 text-[12.5px] text-cream/90">
        ✿ Gracias, ya eres parte del club Floréa. Te escribiremos con cada nueva
        colección.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@correo.com"
          aria-label="Correo para el club Floréa"
          className="min-w-0 flex-1 rounded-full border border-cream/25 bg-white/10 px-5 py-3 text-[13px] text-cream placeholder:text-cream/45 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn btn-gold !px-6 !py-3"
        >
          {state === "loading" ? "Enviando…" : "Suscribirme"}
        </button>
      </div>
      {state === "error" ? (
        <p className="mt-2 text-[11px] text-rose">
          No pudimos registrar tu correo. Intenta nuevamente.
        </p>
      ) : null}
      <p className="mt-2 text-[10.5px] leading-relaxed text-cream/50">
        Ideas florales, fechas especiales y beneficios. Sin spam, prometido.
      </p>
    </form>
  );
}

export function SiteFooter() {
  return (
    <footer className="print:hidden mt-24 bg-forest-deep text-cream">
      <div className="shell grid gap-12 py-16 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr] lg:gap-10">
        <div>
          <Logo tone="light" withSlogan />
          <p className="mt-5 max-w-[280px] text-[13px] leading-relaxed text-cream/65">
            Florería boutique en Lima. Diseñamos arreglos únicos que transmiten
            sentimientos y acompañan tus momentos más importantes.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[
              { name: "instagram", href: "https://instagram.com/florea.floral", label: "Instagram" },
              { name: "facebook", href: "https://facebook.com", label: "Facebook" },
              { name: "tiktok", href: "https://tiktok.com/@florea.flores", label: "TikTok" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-cream/20 text-cream/80 transition hover:border-gold hover:text-gold"
              >
                <Icon name={social.name} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
            Tienda
          </p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-cream/70">
            <li><Link href="/catalogo" className="link-quiet hover:text-cream">Catálogo completo</Link></li>
            <li><Link href="/personalizar" className="link-quiet hover:text-cream">Diseña tu arreglo</Link></li>
            <li><Link href="/catalogo?categoria=cajas" className="link-quiet hover:text-cream">Cajas florales</Link></li>
            <li><Link href="/catalogo?categoria=romanticos" className="link-quiet hover:text-cream">Rosas de amor</Link></li>
            <li><Link href="/carrito" className="link-quiet hover:text-cream">Mi carrito</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
            Ayuda
          </p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-cream/70">
            <li><Link href="/contacto" className="link-quiet hover:text-cream">Envíos y entregas</Link></li>
            <li><Link href="/contacto#pagos" className="link-quiet hover:text-cream">Métodos de pago</Link></li>
            <li><Link href="/nosotros" className="link-quiet hover:text-cream">Nuestra historia</Link></li>
            <li><Link href="/contacto" className="link-quiet hover:text-cream">Atención al cliente</Link></li>
            <li>
              <a
                href={whatsappLink("¡Hola Floréa! Necesito ayuda con mi pedido.")}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet inline-flex items-center gap-1.5 hover:text-cream"
              >
                <Icon name="whatsapp" className="h-3.5 w-3.5" /> Pedidos por WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
            Club Floréa
          </p>
          <p className="mt-4 text-[13px] leading-relaxed text-cream/65">
            Recibe nuestras colecciones de temporada y recordatorios de fechas
            especiales antes que nadie.
          </p>
          <NewsletterForm />
          <div className="mt-5 space-y-1.5 text-[11.5px] text-cream/55">
            <p className="flex items-center gap-2"><Icon name="pin" className="h-3.5 w-3.5" /> {BRAND.address}</p>
            <p className="flex items-center gap-2"><Icon name="clock" className="h-3.5 w-3.5" /> {BRAND.hours}</p>
            <p className="flex items-center gap-2"><Icon name="mail" className="h-3.5 w-3.5" /> {BRAND.email}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <div className="shell flex flex-col items-center justify-between gap-4 py-5 text-[10.5px] uppercase tracking-[0.18em] text-cream/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Floréa Floral Boutique · Lima, Perú</p>
          <p className="flex items-center gap-2 text-gold/80">
            <FlowerMark className="h-4 w-4" /> Emociones que florecen
          </p>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "Yape", "Plin"].map((method) => (
              <span
                key={method}
                className="rounded border border-cream/15 px-2 py-1 text-[9px] tracking-[0.12em] text-cream/55"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(
        "¡Hola Floréa! Vi su web y quiero pedir un arreglo floral 🌸",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="print:hidden group fixed right-5 bottom-5 z-[70] flex items-center gap-3 rounded-full bg-forest py-3 pr-4 pl-3 text-cream shadow-[0_18px_40px_-14px_rgba(11,43,34,0.75)] transition hover:bg-forest-deep"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-full bg-cream/12">
        <span className="absolute inset-0 animate-ping rounded-full bg-cream/10" />
        <Icon name="whatsapp" className="relative h-5 w-5 text-gold" />
      </span>
      <span className="hidden text-[10.5px] font-semibold uppercase tracking-[0.16em] sm:block">
        Pide por WhatsApp
      </span>
    </a>
  );
}
