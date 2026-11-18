"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FlowerMark, Icon } from "@/components/brand";
import { BRAND, formatPrice, SIZES, whatsappLink } from "@/lib/brand";

const STORAGE_KEY = "florea-cart-v1";

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  imageUrl: string;
  sizeId: string;
  sizeLabel: string;
  unitPriceCents: number;
  quantity: number;
};

type CartApi = {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          if (Array.isArray(parsed)) {
            setItems(
              parsed.filter(
                (item) =>
                  item &&
                  typeof item.slug === "string" &&
                  typeof item.unitPriceCents === "number" &&
                  typeof item.quantity === "number",
              ),
            );
          }
        }
      } catch {
        // Ignoramos carritos corruptos y arrancamos en limpio.
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // modo privado: seguimos en memoria
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const addItem = useCallback((item: Omit<CartItem, "key">) => {
    const key = `${item.slug}::${item.sizeId}`;
    setItems((previous) => {
      const existing = previous.find((entry) => entry.key === key);
      if (existing) {
        return previous.map((entry) =>
          entry.key === key
            ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, 20) }
            : entry,
        );
      }
      return [...previous, { ...item, key }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((previous) => previous.filter((entry) => entry.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((previous) =>
      previous
        .map((entry) =>
          entry.key === key
            ? { ...entry, quantity: Math.min(Math.max(quantity, 1), 20) }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartApi>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalCents = items.reduce(
      (sum, item) => sum + item.unitPriceCents * item.quantity,
      0,
    );
    return {
      items,
      hydrated,
      count,
      subtotalCents,
      isOpen,
      addItem,
      removeItem,
      setQuantity,
      clear,
      openCart,
      closeCart,
    };
  }, [
    items,
    hydrated,
    isOpen,
    addItem,
    removeItem,
    setQuantity,
    clear,
    openCart,
    closeCart,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart(): CartApi {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}

export function CartButton({ className = "" }: { className?: string }) {
  const { count, openCart, hydrated } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito, ${count} producto${count === 1 ? "" : "s"}`}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 text-forest transition hover:border-forest hover:bg-forest hover:text-cream ${className}`}
    >
      <Icon name="bag" className="h-[18px] w-[18px]" />
      {hydrated && count > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-rose px-1 text-[10px] font-bold text-forest-deep">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    setQuantity,
    subtotalCents,
    count,
    hydrated,
  } = useCart();

  if (!isOpen) return null;

  const missingForFreeShipping = Math.max(
    BRAND.freeShippingFromCents - subtotalCents,
    0,
  );
  const progress = Math.min(
    (subtotalCents / BRAND.freeShippingFromCents) * 100,
    100,
  );

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="animate-fade absolute inset-0 bg-forest-deep/45 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu selección de flores"
        className="animate-drawer relative flex h-full w-full max-w-[430px] flex-col bg-cream shadow-[0_0_60px_rgba(11,43,34,0.25)]"
      >
        <header className="flex items-start justify-between border-b border-cocoa/12 px-6 py-5">
          <div>
            <p className="eyebrow text-[9px]">Tu selección</p>
            <h2 className="mt-1 font-serif text-2xl text-forest">
              Ramos elegidos
              <span className="ml-2 align-middle text-sm text-cocoa/60">
                ({hydrated ? count : 0})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full border border-forest/15 text-forest transition hover:bg-forest hover:text-cream"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <FlowerMark className="h-16 w-16 text-sage" />
            <p className="font-serif text-2xl text-forest">Tu carrito está en calma</p>
            <p className="text-sm text-cocoa/80">
              Descubre nuestros arreglos, cajas florales y detalles hechos a mano.
            </p>
            <Link
              href="/catalogo"
              onClick={closeCart}
              className="btn btn-dark mt-2"
            >
              Ver catálogo <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <a
              href={whatsappLink(
                "¡Hola Floréa! Estoy buscando un arreglo floral y me gustaría recibir una recomendación.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cocoa underline decoration-sage decoration-2 underline-offset-4"
            >
              Asesórate por WhatsApp
            </a>
          </div>
        ) : (
          <>
            <div className="border-b border-cocoa/10 bg-white/60 px-6 py-3">
              <p className="text-[11px] text-cocoa">
                {missingForFreeShipping > 0 ? (
                  <>
                    Te faltan{" "}
                    <strong className="text-forest">
                      {formatPrice(missingForFreeShipping)}
                    </strong>{" "}
                    para <span className="text-forest">envío gratis</span> en Lima
                  </>
                ) : (
                  <span className="font-semibold text-forest">
                    ¡Envío gratis desbloqueado en Lima! ✿
                  </span>
                )}
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-sage transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4">
                    <div className="h-[92px] w-[74px] shrink-0 overflow-hidden rounded-2xl bg-sand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-serif text-[17px] leading-tight text-forest">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-cocoa/70">
                            {item.sizeLabel}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Quitar ${item.name}`}
                          className="text-cocoa/50 transition hover:text-rose"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-end justify-between pt-2">
                        <div className="inline-flex items-center rounded-full border border-cocoa/20">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.key, item.quantity - 1)}
                            aria-label="Quitar una unidad"
                            className="grid h-7 w-7 place-items-center text-cocoa transition hover:text-forest"
                          >
                            <Icon name="minus" className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-forest">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.key, item.quantity + 1)}
                            aria-label="Agregar una unidad"
                            className="grid h-7 w-7 place-items-center text-cocoa transition hover:text-forest"
                          >
                            <Icon name="plus" className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-forest">
                          {formatPrice(item.unitPriceCents * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-sage/40 bg-sage/10 p-4">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest">
                  <Icon name="gift" className="h-4 w-4" /> Incluido en cada pedido
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-cocoa">
                  Dedicatoria caligrafiada, papel marfil y cinta de satín. Coordinamos
                  la hora exacta de entrega por WhatsApp.
                </p>
              </div>
            </div>

            <footer className="border-t border-cocoa/12 bg-white/70 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa">
                  Subtotal
                </span>
                <span className="font-serif text-2xl text-forest">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-cocoa/70">
                Envío calculado según distrito en el siguiente paso.
              </p>
              <Link
                href="/carrito"
                onClick={closeCart}
                className="btn btn-dark mt-4 w-full"
              >
                Finalizar pedido <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-[11px] font-semibold uppercase tracking-[0.18em] text-cocoa/80 transition hover:text-forest"
              >
                Seguir eligiendo flores
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

export function AddToCartButton({
  product,
  variant = "compact",
  withSizes = false,
  className = "",
}: {
  product: {
    slug: string;
    name: string;
    imageUrl: string;
    priceCents: number;
  };
  variant?: "compact" | "full";
  withSizes?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [sizeId, setSizeId] = useState<string>(SIZES[0].id);
  const [quantity, setQuantity] = useState(1);

  const size = SIZES.find((entry) => entry.id === sizeId) ?? SIZES[0];
  const unitPriceCents = product.priceCents + size.extraCents;

  const handleAdd = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      sizeId: size.id,
      sizeLabel: size.label,
      unitPriceCents,
      quantity,
    });
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-forest/20 bg-white/80 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-forest transition hover:border-forest hover:bg-forest hover:text-cream ${className}`}
      >
        <Icon name="bag" className="h-3.5 w-3.5" /> Agregar
      </button>
    );
  }

  return (
    <div className={className}>
      {withSizes ? (
        <fieldset className="mt-6">
          <legend className="label">Tamaño del arreglo</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {SIZES.map((entry) => {
              const active = entry.id === sizeId;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSizeId(entry.id)}
                  aria-pressed={active}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-forest bg-forest text-cream"
                      : "border-cocoa/20 bg-white/70 text-charcoal hover:border-sage-deep"
                  }`}
                >
                  <span className="block font-serif text-lg leading-tight">
                    {entry.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10.5px] ${
                      active ? "text-cream/70" : "text-cocoa/70"
                    }`}
                  >
                    {entry.description}
                  </span>
                  <span
                    className={`mt-1 block text-xs font-semibold ${
                      active ? "text-gold" : "text-forest"
                    }`}
                  >
                    {entry.extraCents === 0
                      ? "Precio base"
                      : `+ ${formatPrice(entry.extraCents)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="inline-flex w-fit items-center rounded-full border border-cocoa/25 bg-white/80">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Quitar una unidad"
            className="grid h-11 w-11 place-items-center text-cocoa transition hover:text-forest"
          >
            <Icon name="minus" className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-forest">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            aria-label="Agregar una unidad"
            className="grid h-11 w-11 place-items-center text-cocoa transition hover:text-forest"
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </div>

        <button type="button" onClick={handleAdd} className="btn btn-dark flex-1">
          Agregar al carrito · {formatPrice(unitPriceCents * quantity)}
        </button>

        <a
          href={whatsappLink(
            `¡Hola Floréa! Me interesa el arreglo "${product.name}" (${size.label})${
              quantity > 1 ? ` x${quantity}` : ""
            }. ¿Me ayudan a coordinar la entrega?`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          <Icon name="whatsapp" className="h-4 w-4" /> Pedir por WhatsApp
        </a>
      </div>
      <p className="mt-3 flex items-center gap-2 text-[11px] text-cocoa/70">
        <Icon name="truck" className="h-4 w-4 text-sage-deep" />
        Entrega el mismo día en Lima si pides antes de las 2 p.m.
      </p>
    </div>
  );
}
