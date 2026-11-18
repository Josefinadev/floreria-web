import { getDb } from "@/db";
import {
  customRequests,
  newsletterSubscribers,
  orderItems,
  orders,
  products,
  type CustomRequest,
  type Order,
  type OrderItem,
  type Product,
} from "@/db/schema";
import {
  deliveryFeeCents,
  pexels,
  SIZES,
  type PaymentMethodId,
} from "@/lib/brand";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";

export type CatalogProduct = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  priceCents: number;
  imageUrl: string;
  badge: string | null;
  stems: string;
  featured: boolean;
  active: boolean;
};

const PRODUCT_SEED = [
  {
    slug: "rosas-de-amor",
    name: "Rosas de amor",
    tagline: "Arreglos románticos",
    category: "romanticos",
    priceCents: 18900,
    imageUrl: pexels(36188440),
    badge: "Más vendido",
    featured: true,
    sortOrder: 1,
    stems: "24 rosas garden · eucalipto · ruscus",
    description:
      "Rosas garden de pétalo grueso en tonos rosa empolvado, abrazadas por eucalipto fresco y envueltas en papel marfil con cinta de satín. Nuestro clásico para decir «te amo» sin una sola palabra.",
  },
  {
    slug: "dulce-primavera",
    name: "Dulce primavera",
    tagline: "Flores variadas",
    category: "primaverales",
    priceCents: 15900,
    imageUrl: pexels(27670859),
    badge: null,
    featured: true,
    sortOrder: 2,
    stems: "Rosas spray · lisianthus · eucalipto",
    description:
      "Una mezcla fresca y luminosa de rosas spray, lisianthus y verdes de estación. Ligera, natural y perfecta para alegrar cualquier semana, sin esperar una ocasión.",
  },
  {
    slug: "caja-lumiere",
    name: "Caja Lumière",
    tagline: "Cajas florales",
    category: "cajas",
    priceCents: 22900,
    imageUrl: pexels(26628920),
    badge: "Nuevo",
    featured: true,
    sortOrder: 3,
    stems: "Rosas · hortensias · claveles · follaje",
    description:
      "Caja redonda forrada a mano y repleta de rosas, hortensias y claveles en tonos pastel. Incluye dedicatoria caligrafiada y sobre de semillas para plantar un recuerdo.",
  },
  {
    slug: "detalles-eternos",
    name: "Detalles eternos",
    tagline: "Detalles personalizados",
    category: "personalizados",
    priceCents: 24900,
    imageUrl: pexels(18057437),
    badge: null,
    featured: true,
    sortOrder: 4,
    stems: "Rosas preservadas · caja de terciopelo",
    description:
      "Rosas preservadas que conservan su belleza por más de un año, presentadas en caja de terciopelo. Una forma elegante de hacer eterno un momento.",
  },
  {
    slug: "jardin-de-peonias",
    name: "Jardín de peonías",
    tagline: "Arreglos románticos",
    category: "romanticos",
    priceCents: 27900,
    imageUrl: pexels(12775959),
    badge: "Edición limitada",
    featured: false,
    sortOrder: 5,
    stems: "Peonías · rosas blancas · eucalipto",
    description:
      "Peonías de temporada con rosas blancas en un jarrón de cerámica artesanal. Un arreglo escultórico, suave y profundamente romántico.",
  },
  {
    slug: "brisa-de-claveles",
    name: "Brisa de claveles",
    tagline: "Flores variadas",
    category: "primaverales",
    priceCents: 13900,
    imageUrl: pexels(28375941),
    badge: null,
    featured: false,
    sortOrder: 6,
    stems: "Claveles · gypsophila · follaje",
    description:
      "Claveles de textura delicada con toques de gypsophila. Un ramo honesto y fresco que huele a jardín de domingo.",
  },
  {
    slug: "ramo-de-estacion",
    name: "Ramo de estación",
    tagline: "Flores variadas",
    category: "primaverales",
    priceCents: 16500,
    imageUrl: pexels(16536584),
    badge: null,
    featured: false,
    sortOrder: 7,
    stems: "Selección del día · papel marfil",
    description:
      "Lo mejor de la cosecha de la semana, elegido por nuestras floristas. Cada ramo es irrepetible, tal como la persona a quien se lo entregas.",
  },
  {
    slug: "caja-aura",
    name: "Caja Aura",
    tagline: "Cajas florales",
    category: "cajas",
    priceCents: 25900,
    imageUrl: pexels(426905),
    badge: null,
    featured: false,
    sortOrder: 8,
    stems: "Rosas blancas · lisianthus",
    description:
      "Blanco absoluto en una caja de lujo con lazo de satín. Serenidad y elegancia para bautizos, agradecimientos y momentos que merecen calma.",
  },
  {
    slug: "susurro-de-tulipanes",
    name: "Susurro de tulipanes",
    tagline: "Detalles personalizados",
    category: "personalizados",
    priceCents: 19900,
    imageUrl: pexels(34969445),
    badge: null,
    featured: false,
    sortOrder: 9,
    stems: "Tulipanes pastel · cinta de raso",
    description:
      "Tulipanes importados en tonos pastel, atados a mano con cinta de raso. Puedes elegir la paleta exacta en el configurador de arreglos.",
  },
  {
    slug: "serenidad",
    name: "Serenidad",
    tagline: "Acompañamiento",
    category: "condolencias",
    priceCents: 28900,
    imageUrl: pexels(9342923),
    badge: null,
    featured: false,
    sortOrder: 10,
    stems: "Rosas blancas · lirios · follaje",
    description:
      "Un arreglo sobrio y luminoso para acompañar con respeto. Coordinamos la entrega con especial cuidado, también en horarios sensibles.",
  },
  {
    slug: "nube-de-peonias",
    name: "Nube de peonías",
    tagline: "Arreglos románticos",
    category: "romanticos",
    priceCents: 23900,
    imageUrl: pexels(3392757),
    badge: null,
    featured: false,
    sortOrder: 11,
    stems: "Peonías · rosas · limonium",
    description:
      "Como una nube rosa: peonías y rosas en capas suaves, con un toque de limonium. Ideal para aniversarios y pedidos de mano.",
  },
  {
    slug: "petite-petale",
    name: "Petite Pétale",
    tagline: "Cajas florales",
    category: "cajas",
    priceCents: 17500,
    imageUrl: pexels(28855241),
    badge: null,
    featured: false,
    sortOrder: 12,
    stems: "Rosas pequeñas · hortensias",
    description:
      "Nuestra caja de regalo compacta: detalles finos, flores frescas y una dedicatoria escrita a mano. Perfecta para sorprender a mitad del día.",
  },
] as const;

function toCatalogProduct(row: Product): CatalogProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    priceCents: row.priceCents,
    imageUrl: row.imageUrl,
    badge: row.badge,
    stems: row.stems,
    featured: row.featured,
    active: row.active,
  };
}

async function seedIfEmpty(): Promise<void> {
  const existing = await getDb().select({ count: sql<number>`count(*)::int` }).from(products);
  if ((existing[0]?.count ?? 0) > 0) return;
  await getDb().insert(products).values(PRODUCT_SEED.map((p) => ({ ...p })));
}

const globalForSeed = globalThis as typeof globalThis & {
  __floreaSeedPromise?: Promise<void>;
};

export async function ensureSeed(): Promise<void> {
  if (!globalForSeed.__floreaSeedPromise) {
    globalForSeed.__floreaSeedPromise = seedIfEmpty().catch((error) => {
      globalForSeed.__floreaSeedPromise = undefined;
      throw error;
    });
  }
  return globalForSeed.__floreaSeedPromise;
}

function fallbackProducts(): CatalogProduct[] {
  return PRODUCT_SEED.map((p, index) => ({
    ...p,
    id: index + 1,
    active: true,
  }));
}

export async function listProducts(options?: {
  category?: string;
  search?: string;
  sort?: string;
  featuredOnly?: boolean;
  includeInactive?: boolean;
}): Promise<CatalogProduct[]> {
  const opts = options ?? {};
  try {
    await ensureSeed();
    const filters = [];
    if (!opts.includeInactive) filters.push(eq(products.active, true));
    if (opts.category && opts.category !== "todos") {
      filters.push(eq(products.category, opts.category));
    }
    if (opts.featuredOnly) filters.push(eq(products.featured, true));
    if (opts.search) {
      const term = `%${opts.search}%`;
      filters.push(
        or(
          ilike(products.name, term),
          ilike(products.tagline, term),
          ilike(products.description, term),
        )!,
      );
    }
    const order =
      opts.sort === "precio-asc"
        ? asc(products.priceCents)
        : opts.sort === "precio-desc"
          ? desc(products.priceCents)
          : opts.sort === "novedades"
            ? desc(products.createdAt)
            : asc(products.sortOrder);

    const rows = await getDb()
      .select()
      .from(products)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(order);
    return rows.map(toCatalogProduct);
  } catch (error) {
    console.error("listProducts fallback:", error);
    let items = fallbackProducts().filter((p) =>
      opts.includeInactive ? true : p.active,
    );
    if (opts.category && opts.category !== "todos") {
      items = items.filter((p) => p.category === opts.category);
    }
    if (opts.featuredOnly) items = items.filter((p) => p.featured);
    if (opts.search) {
      const term = opts.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.tagline.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }
    if (opts.sort === "precio-asc") items.sort((a, b) => a.priceCents - b.priceCents);
    if (opts.sort === "precio-desc") items.sort((a, b) => b.priceCents - a.priceCents);
    return items;
  }
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  try {
    await ensureSeed();
    const rows = await getDb().select().from(products).where(eq(products.slug, slug)).limit(1);
    if (rows[0]) return toCatalogProduct(rows[0]);
    return fallbackProducts().find((p) => p.slug === slug) ?? null;
  } catch (error) {
    console.error("getProductBySlug fallback:", error);
    return fallbackProducts().find((p) => p.slug === slug) ?? null;
  }
}

export type NewOrderItem = {
  slug: string;
  name: string;
  sizeLabel: string;
  unitPriceCents: number;
  quantity: number;
  note?: string;
};

export type NewOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: "envio" | "recojo";
  deliveryDate: string;
  deliverySlot: string;
  district: string;
  address: string;
  addressReference: string;
  recipientName: string;
  recipientPhone: string;
  cardMessage: string;
  notes: string;
  items: NewOrderItem[];
  paymentMethod: PaymentMethodId;
  paymentStatus: string;
  paymentProvider: string;
  paymentReference: string;
  cardLast4: string;
};

function generateCode(prefix: string): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 4);
  return `${prefix}-${stamp}${rand}`;
}

export async function createOrder(input: NewOrderInput): Promise<{
  code: string;
  totalCents: number;
  subtotalCents: number;
  deliveryFeeCents: number;
}> {
  await ensureSeed();
  const catalog = await listProducts({ includeInactive: true });
  const priced = input.items.map((item) => {
    const product = catalog.find((p) => p.slug === item.slug);
    const size = SIZES.find((s) => s.label === item.sizeLabel) ?? SIZES[0];
    const unit = product ? product.priceCents + size.extraCents : item.unitPriceCents;
    return {
      productSlug: item.slug,
      name: product?.name ?? item.name,
      sizeLabel: size.label,
      unitPriceCents: unit,
      quantity: Math.min(Math.max(item.quantity, 1), 20),
      note: item.note ?? "",
    };
  });

  const subtotalCents = priced.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
  const fee =
    input.deliveryMethod === "recojo"
      ? 0
      : deliveryFeeCents(input.district, subtotalCents);
  const totalCents = subtotalCents + fee;

  let code = generateCode("FLR");
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const clash = await getDb().select({ id: orders.id }).from(orders).where(eq(orders.code, code)).limit(1);
    if (!clash[0]) break;
    code = generateCode("FLR");
  }

  const inserted = await getDb()
    .insert(orders)
    .values({
      code,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      deliveryMethod: input.deliveryMethod,
      deliveryDate: input.deliveryDate,
      deliverySlot: input.deliverySlot,
      district: input.deliveryMethod === "recojo" ? "" : input.district,
      address: input.deliveryMethod === "recojo" ? "" : input.address,
      addressReference: input.addressReference,
      recipientName: input.recipientName,
      recipientPhone: input.recipientPhone,
      cardMessage: input.cardMessage,
      notes: input.notes,
      subtotalCents,
      deliveryFeeCents: fee,
      totalCents,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentStatus,
      paymentProvider: input.paymentProvider,
      paymentReference: input.paymentReference,
      cardLast4: input.cardLast4,
    })
    .returning({ id: orders.id, code: orders.code });

  const order = inserted[0];
  if (!order) throw new Error("No se pudo registrar el pedido");

  await getDb().insert(orderItems).values(
    priced.map((item) => ({
      orderId: order.id,
      productSlug: item.productSlug,
      name: item.name,
      sizeLabel: item.sizeLabel,
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity,
      note: item.note,
    })),
  );

  return {
    code: order.code,
    totalCents,
    subtotalCents,
    deliveryFeeCents: fee,
  };
}

export async function getOrderByCode(
  code: string,
): Promise<{ order: Order; items: OrderItem[] } | null> {
  try {
    const rows = await getDb()
      .select()
      .from(orders)
      .where(eq(orders.code, code.trim().toUpperCase()))
      .limit(1);
    const order = rows[0];
    if (!order) return null;
    const items = await getDb().select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return { order, items };
  } catch (error) {
    console.error("getOrderByCode error:", error);
    return null;
  }
}

export type NewCustomRequestInput = {
  name: string;
  phone: string;
  email: string;
  occasion: string;
  style: string;
  size: string;
  palette: string;
  flowers: string;
  budgetCents: number;
  dedication: string;
  deliveryDate: string;
  deliverySlot: string;
  district: string;
  notes: string;
};

export async function createCustomRequest(
  input: NewCustomRequestInput,
): Promise<{ code: string }> {
  const code = generateCode("FLP");
  await getDb().insert(customRequests).values({ ...input, code });
  return { code };
}

export async function listOrders(limit = 80): Promise<Order[]> {
  try {
    return await getDb().select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  } catch (error) {
    console.error("listOrders error:", error);
    return [];
  }
}

export async function listCustomRequests(limit = 60): Promise<CustomRequest[]> {
  try {
    return await getDb()
      .select()
      .from(customRequests)
      .orderBy(desc(customRequests.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("listCustomRequests error:", error);
    return [];
  }
}

export async function getDashboardStats(): Promise<{
  orderCount: number;
  revenueCents: number;
  pendingCount: number;
  customCount: number;
  subscriberCount: number;
}> {
  try {
    const [orderStats] = await getDb()
      .select({
        count: sql<number>`count(*)::int`,
        revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)::int`,
        pending: sql<number>`count(*) filter (where ${orders.status} in ('nuevo','en_preparacion'))::int`,
      })
      .from(orders);
    const [customStats] = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(customRequests);
    const [subs] = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(newsletterSubscribers);
    return {
      orderCount: orderStats?.count ?? 0,
      revenueCents: orderStats?.revenue ?? 0,
      pendingCount: orderStats?.pending ?? 0,
      customCount: customStats?.count ?? 0,
      subscriberCount: subs?.count ?? 0,
    };
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return {
      orderCount: 0,
      revenueCents: 0,
      pendingCount: 0,
      customCount: 0,
      subscriberCount: 0,
    };
  }
}

export async function updateOrderStatus(code: string, status: string): Promise<void> {
  await getDb().update(orders).set({ status }).where(eq(orders.code, code));
}

export async function updateOrderPayment(
  code: string,
  payment: { status: string; provider: string; reference: string; last4: string },
): Promise<void> {
  await getDb()
    .update(orders)
    .set({
      paymentStatus: payment.status,
      paymentProvider: payment.provider,
      paymentReference: payment.reference,
      cardLast4: payment.last4,
    })
    .where(eq(orders.code, code));
}

export async function updateProductFlags(
  slug: string,
  flags: { active?: boolean; featured?: boolean; priceCents?: number },
): Promise<void> {
  await getDb().update(products).set(flags).where(eq(products.slug, slug));
}

export async function subscribeNewsletter(email: string): Promise<void> {
  await getDb()
    .insert(newsletterSubscribers)
    .values({ email: email.toLowerCase() })
    .onConflictDoNothing();
}
