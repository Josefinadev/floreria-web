import type { Metadata } from "next";
import Link from "next/link";
import {
  changeOrderStatusAction,
  loginAction,
  logoutAction,
  saveProductAction,
} from "@/app/admin/actions";
import { FlowerMark, Icon, Logo } from "@/components/brand";
import { formatDateLong, formatPrice, paymentMethodLabel } from "@/lib/brand";
import { isAdmin } from "@/lib/admin-auth";
import {
  getDashboardStats,
  listCustomRequests,
  listOrders,
  listProducts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel Floréa",
  description: "Gestión de pedidos, personalizaciones y catálogo de Floréa.",
  robots: { index: false, follow: false },
};

const STATUS_OPTIONS = [
  { id: "nuevo", label: "Nuevo" },
  { id: "en_preparacion", label: "En preparación" },
  { id: "en_camino", label: "En camino" },
  { id: "entregado", label: "Entregado" },
  { id: "cancelado", label: "Cancelado" },
];

const PAYMENT_LABEL: Record<string, { label: string; tone: string }> = {
  aprobado: { label: "Aprobado", tone: "bg-sage/30 text-forest" },
  simulado: { label: "Prueba", tone: "bg-gold/25 text-cocoa" },
  pendiente: { label: "Pendiente", tone: "bg-rose/25 text-cocoa" },
  rechazado: { label: "Rechazado", tone: "bg-rose/40 text-cocoa" },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authed = await isAdmin();

  if (!authed) {
    return (
      <section className="shell flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-[28px] border border-cocoa/12 bg-cream p-8 shadow-[0_30px_70px_-45px_rgba(22,63,51,0.6)]">
          <Logo compact />
          <h1 className="mt-6 font-serif text-[28px] text-forest">Panel administrativo</h1>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-cocoa">
            Ingresa tu clave para gestionar pedidos, solicitudes personalizadas y el
            catálogo.
          </p>

          <form action={loginAction} className="mt-6">
            <label htmlFor="password" className="label">Clave de acceso</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field"
              placeholder="••••••••"
            />
            {error ? (
              <p className="mt-2 text-[11.5px] text-rose">Clave incorrecta. Intenta de nuevo.</p>
            ) : null}
            <button type="submit" className="btn btn-dark mt-4 w-full">
              Entrar al panel <Icon name="arrow" className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 rounded-xl border border-sage/40 bg-sage/10 px-4 py-3 text-[11px] leading-relaxed text-cocoa">
            Clave de demostración: <strong className="text-forest">florea2026</strong>.
            Cámbiala agregando <code>ADMIN_PASSWORD</code> en el archivo{" "}
            <code>.env</code>.
          </p>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-forest hover:text-cocoa">
            ← Volver a la tienda
          </Link>
        </div>
      </section>
    );
  }

  const [stats, orders, customRequests, products] = await Promise.all([
    getDashboardStats(),
    listOrders(60),
    listCustomRequests(40),
    listProducts({ includeInactive: true }),
  ]);

  return (
    <section className="shell py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-cocoa/12 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Panel administrativo</p>
          <h1 className="display mt-2 text-[clamp(1.9rem,4vw,2.6rem)]">
            Hola, equipo Floréa
          </h1>
          <p className="mt-1 text-[12px] text-cocoa">
            Gestión de pedidos, pagos, personalizaciones y catálogo en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/" className="btn btn-outline !px-4 !py-2.5">
            <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" /> Ver tienda
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-dark !px-4 !py-2.5">
              <Icon name="logout" className="h-3.5 w-3.5" /> Salir
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pedidos registrados", value: String(stats.orderCount), icon: "bag" },
          { label: "Ingresos totales", value: formatPrice(stats.revenueCents), icon: "card" },
          { label: "Por atender", value: String(stats.pendingCount), icon: "clock" },
          { label: "Solicitudes a medida", value: String(stats.customCount), icon: "sparkle" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-cocoa/12 bg-white/70 p-5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-sage/20 text-forest">
              <Icon name={card.icon} className="h-4 w-4" />
            </span>
            <p className="mt-3 font-serif text-[26px] leading-none text-forest">{card.value}</p>
            <p className="mt-1.5 text-[9.5px] uppercase tracking-[0.16em] text-cocoa/60">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* PEDIDOS */}
      <div className="mt-10" id="pedidos">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-[24px] text-forest">Pedidos</h2>
            <p className="text-[11.5px] text-cocoa">
              Actualiza el estado para que el equipo prepare y despache cada arreglo.
            </p>
          </div>
          <span className="rounded-full bg-forest px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-cream">
            {orders.length} recientes
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-cocoa/25 bg-cream/60 px-5 py-8 text-center text-[12.5px] text-cocoa">
            Aún no hay pedidos. Los que lleguen desde el checkout aparecerán aquí.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-cocoa/12 bg-white/70">
            <table className="w-full min-w-[900px] text-left text-[11.5px]">
              <thead className="bg-sand/60 text-[9px] uppercase tracking-[0.14em] text-cocoa/70">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Entrega</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Pago</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa/10">
                {orders.map((order) => {
                  const payment = PAYMENT_LABEL[order.paymentStatus] ?? PAYMENT_LABEL.pendiente;
                  return (
                    <tr key={order.id} className="align-top">
                      <td className="px-4 py-3">
                        <Link
                          href={`/pedido/${order.code}`}
                          className="font-semibold text-forest hover:text-cocoa"
                        >
                          {order.code}
                        </Link>
                        <p className="mt-0.5 text-[10px] text-cocoa/55">
                          {new Date(order.createdAt).toLocaleDateString("es-PE")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-charcoal">{order.customerName}</p>
                        <a
                          href={`https://wa.me/51${order.customerPhone.replace(/\D/g, "").slice(-9)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10.5px] text-cocoa/70 hover:text-forest"
                        >
                          {order.customerPhone}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-charcoal">{formatDateLong(order.deliveryDate)}</p>
                        <p className="text-[10.5px] text-cocoa/60">
                          {order.deliverySlot} ·{" "}
                          {order.deliveryMethod === "envio" ? order.district : "Recojo"}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-forest">
                        {formatPrice(order.totalCents)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] ${payment.tone}`}>
                          {payment.label}
                        </span>
                        <p className="mt-1 text-[10px] text-cocoa/60">
                          {paymentMethodLabel(order.paymentMethod)}
                          {order.cardLast4 ? ` · ••${order.cardLast4}` : ""}
                        </p>
                        {order.paymentReference ? (
                          <p className="text-[9.5px] text-cocoa/45">{order.paymentReference}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <form action={changeOrderStatusAction} className="flex items-center gap-1.5">
                          <input type="hidden" name="code" value={order.code} />
                          <select
                            name="status"
                            defaultValue={order.status}
                            aria-label={`Estado del pedido ${order.code}`}
                            className="rounded-lg border border-cocoa/20 bg-white px-2 py-1.5 text-[11px]"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="rounded-lg bg-forest px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-cream hover:bg-forest-deep"
                          >
                            Guardar
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PERSONALIZADOS */}
      <div className="mt-10" id="personalizados">
        <h2 className="font-serif text-[24px] text-forest">Solicitudes personalizadas</h2>
        <p className="text-[11.5px] text-cocoa">
          Pedidos a medida enviados desde el configurador. Contáctalos por WhatsApp.
        </p>
        {customRequests.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-cocoa/25 bg-cream/60 px-5 py-8 text-center text-[12.5px] text-cocoa">
            Aún no hay solicitudes personalizadas.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {customRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-cocoa/12 bg-white/70 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-serif text-[18px] text-forest">{request.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-cocoa/55">
                      {request.code} · {request.occasion}
                    </p>
                  </div>
                  <span className="rounded-full bg-sage/25 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-forest">
                    {request.style}
                  </span>
                </div>
                <dl className="mt-3 space-y-1 text-[11px] text-cocoa">
                  <div className="flex justify-between gap-2">
                    <dt>WhatsApp</dt>
                    <dd className="text-charcoal">{request.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Tamaño / paleta</dt>
                    <dd className="text-right text-charcoal">
                      {request.size} · {request.palette}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Flores</dt>
                    <dd className="text-right text-charcoal">{request.flowers || "A elección"}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Presupuesto</dt>
                    <dd className="text-charcoal">{formatPrice(request.budgetCents)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Entrega</dt>
                    <dd className="text-right text-charcoal">
                      {request.deliveryDate ? formatDateLong(request.deliveryDate) : "Por coordinar"}
                      <br />
                      <span className="text-cocoa/60">{request.district} · {request.deliverySlot}</span>
                    </dd>
                  </div>
                </dl>
                {request.dedication ? (
                  <p className="mt-2.5 rounded-lg bg-sage/10 px-3 py-2 font-serif text-[12px] text-forest italic">
                    “{request.dedication}”
                  </p>
                ) : null}
                <a
                  href={`https://wa.me/51${request.phone.replace(/\D/g, "").slice(-9)}?text=${encodeURIComponent(
                    `¡Hola ${request.name}! Soy del equipo Floréa. Recibimos tu solicitud ${request.code} para un arreglo personalizado 🌸`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest hover:text-cocoa"
                >
                  <Icon name="whatsapp" className="h-3.5 w-3.5" /> Contactar cliente
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CATÁLOGO */}
      <div className="mt-10 mb-6" id="catalogo">
        <h2 className="font-serif text-[24px] text-forest">Catálogo</h2>
        <p className="text-[11.5px] text-cocoa">
          Ajusta precios, visibilidad y destacados. Los cambios se reflejan al instante.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-cocoa/12 bg-white/70">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead className="bg-sand/60 text-[9px] uppercase tracking-[0.14em] text-cocoa/70">
              <tr>
                <th className="px-4 py-3">Arreglo</th>
                <th className="px-4 py-3">Precio (S/)</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3">Destacado</th>
                <th className="px-4 py-3">Guardar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/10">
              {products.map((product) => (
                <tr key={product.slug}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-9 overflow-hidden rounded-md bg-sand">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{product.name}</p>
                        <p className="text-[10px] text-cocoa/55">
                          {product.category} · {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" colSpan={4}>
                    <form action={saveProductAction} className="flex flex-wrap items-center gap-3">
                      <input type="hidden" name="slug" value={product.slug} />
                      <input
                        type="number"
                        name="price"
                        min={1}
                        step="1"
                        defaultValue={(product.priceCents / 100).toFixed(0)}
                        aria-label={`Precio de ${product.name}`}
                        className="w-24 rounded-lg border border-cocoa/20 bg-white px-2.5 py-1.5 text-[11.5px]"
                      />
                      <label className="flex items-center gap-1.5 text-[11px] text-cocoa">
                        <input
                          type="checkbox"
                          name="active"
                          defaultChecked={product.active}
                          className="h-3.5 w-3.5 accent-[#163f33]"
                        />
                        Activo
                      </label>
                      <label className="flex items-center gap-1.5 text-[11px] text-cocoa">
                        <input
                          type="checkbox"
                          name="featured"
                          defaultChecked={product.featured}
                          className="h-3.5 w-3.5 accent-[#163f33]"
                        />
                        Destacado
                      </label>
                      <button
                        type="submit"
                        className="rounded-lg bg-forest px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-cream hover:bg-forest-deep"
                      >
                        Guardar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-[11.5px] leading-relaxed text-cocoa">
        <p className="flex items-center gap-2 font-semibold text-forest">
          <FlowerMark className="h-4 w-4" /> Pasarela de pagos
        </p>
        <p className="mt-1">
          El checkout funciona en modo demostración. Para cobrar de verdad, agrega
          tu llave de Culqi, Mercado Pago o Stripe en el archivo <code>.env</code> y
          completa la llamada de cobro en <code>src/lib/payments.ts</code>. Suscriptores
          del club: {stats.subscriberCount}.
        </p>
      </div>
    </section>
  );
}
