import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlowerMark, Icon } from "@/components/brand";
import {
  BRAND,
  formatDateLong,
  formatPrice,
  paymentMethodLabel,
  whatsappLink,
} from "@/lib/brand";
import { getOrderByCode } from "@/lib/data";

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ code: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Pedido ${code.toUpperCase()}`,
    description: "Detalle y seguimiento de tu pedido floral en Floréa.",
    robots: { index: false, follow: false },
  };
}

const PAYMENT_COPY: Record<
  string,
  { label: string; tone: string; icon: string; note: string }
> = {
  aprobado: {
    label: "Pago aprobado",
    tone: "border-sage bg-sage/18 text-forest",
    icon: "check",
    note: "Tu pago fue autorizado. Empezamos a preparar tu arreglo.",
  },
  simulado: {
    label: "Pago de prueba aprobado",
    tone: "border-gold/60 bg-gold/12 text-cocoa",
    icon: "shield",
    note: "No se realizó ningún cargo real: estamos en entorno de demostración. Coordinamos el cobro final por WhatsApp.",
  },
  pendiente: {
    label: "Pago por confirmar",
    tone: "border-rose/60 bg-rose/12 text-cocoa",
    icon: "clock",
    note: "Coordinamos la confirmación del pago por WhatsApp para liberar tu entrega.",
  },
  rechazado: {
    label: "Pago rechazado",
    tone: "border-rose bg-rose/20 text-cocoa",
    icon: "close",
    note: "El banco rechazó el intento de pago. Escríbenos para reintentarlo con otro medio.",
  },
};

const ORDER_STEPS = ["nuevo", "en_preparacion", "en_camino", "entregado"];

export default async function OrderPage({ params }: { params: RouteParams }) {
  const { code } = await params;
  const result = await getOrderByCode(code);
  if (!result) notFound();

  const { order, items } = result;
  const payment = PAYMENT_COPY[order.paymentStatus] ?? PAYMENT_COPY.pendiente;
  const methodLabel = paymentMethodLabel(order.paymentMethod);
  const activeStep = Math.max(ORDER_STEPS.indexOf(order.status), 0);

  const message = [
    `🌸 *Seguimiento de pedido ${order.code}*`,
    `Hola Floréa, acabo de hacer un pedido en su web.`,
    `Cliente: ${order.customerName}`,
    `Entrega: ${formatDateLong(order.deliveryDate)} · ${order.deliverySlot}`,
    order.deliveryMethod === "envio"
      ? `Dirección: ${order.address}, ${order.district}`
      : "Recojo en tienda (Miraflores)",
    ...items.map(
      (item) =>
        `• ${item.quantity}x ${item.name} (${item.sizeLabel}) — ${formatPrice(item.unitPriceCents * item.quantity)}`,
    ),
    `Total: ${formatPrice(order.totalCents)}`,
    `Pago: ${methodLabel} (${payment.label})`,
  ].join("\n");

  return (
    <section className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-cream">
          <FlowerMark className="h-11 w-11 text-sage-deep" />
        </div>
        <p className="eyebrow mt-6">Pedido registrado</p>
        <h1 className="display mt-3 text-[clamp(2.2rem,5vw,3.4rem)]">
          Gracias, {order.customerName.split(" ")[0]}.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-cocoa">
          Estamos preparando algo que va a emocionar. Te escribiremos por WhatsApp
          para confirmar cada detalle de tu entrega.
        </p>
        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2.5">
          <span className="rounded-full bg-forest px-4 py-2 text-[10.5px] font-semibold tracking-[0.14em] text-cream">
            Pedido {order.code}
          </span>
          <span className={`rounded-full border px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] ${payment.tone}`}>
            {payment.label}
          </span>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
        <div className="space-y-5">
          <div className={`rounded-2xl border px-5 py-4 ${payment.tone}`}>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
              <Icon name={payment.icon} className="h-4 w-4" /> {payment.label}
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed opacity-90">
              {payment.note}
            </p>
            {order.paymentReference ? (
              <p className="mt-2 text-[10.5px] uppercase tracking-[0.12em] opacity-60">
                Referencia: {order.paymentReference}
                {order.cardLast4 ? ` · •••• ${order.cardLast4}` : ""}
              </p>
            ) : null}
          </div>

          <div className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cocoa/12 pb-4">
              <div>
                <p className="eyebrow text-[9px]">Entrega</p>
                <p className="mt-1 font-serif text-[21px] text-forest">
                  {formatDateLong(order.deliveryDate)} · {order.deliverySlot}
                </p>
              </div>
              <Icon name={order.deliveryMethod === "envio" ? "truck" : "pin"} className="h-6 w-6 text-sage-deep" />
            </div>

            <dl className="mt-4 grid gap-4 text-[12.5px] sm:grid-cols-2">
              <div>
                <dt className="label">Método</dt>
                <dd className="text-charcoal">
                  {order.deliveryMethod === "envio" ? "Envío a domicilio" : "Recojo en tienda"}
                </dd>
              </div>
              <div>
                <dt className="label">Contacto</dt>
                <dd className="text-charcoal">
                  {order.customerPhone}
                  <br />
                  <span className="text-cocoa/70">{order.customerEmail}</span>
                </dd>
              </div>
              {order.deliveryMethod === "envio" ? (
                <div className="sm:col-span-2">
                  <dt className="label">Dirección</dt>
                  <dd className="text-charcoal">
                    {order.address}, {order.district}
                    {order.addressReference ? (
                      <span className="block text-[11.5px] text-cocoa/65">
                        Ref. {order.addressReference}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <dt className="label">Punto de recojo</dt>
                  <dd className="text-charcoal">
                    {BRAND.address} · {BRAND.hours}
                  </dd>
                </div>
              )}
              {order.recipientName ? (
                <div>
                  <dt className="label">Recibe</dt>
                  <dd className="text-charcoal">{order.recipientName}</dd>
                </div>
              ) : null}
              {order.cardMessage ? (
                <div className="sm:col-span-2">
                  <dt className="label">Dedicatoria</dt>
                  <dd className="rounded-xl border border-sage/40 bg-sage/10 px-4 py-3 font-serif text-[15px] text-forest italic">
                    “{order.cardMessage}”
                  </dd>
                </div>
              ) : null}
              {order.notes ? (
                <div className="sm:col-span-2">
                  <dt className="label">Notas</dt>
                  <dd className="text-cocoa">{order.notes}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="panel p-6">
            <p className="eyebrow text-[9px]">Estado del pedido</p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-4">
              {[
                { id: "nuevo", label: "Recibido" },
                { id: "en_preparacion", label: "En preparación" },
                { id: "en_camino", label: "En camino" },
                { id: "entregado", label: "Entregado" },
              ].map((step, index) => {
                const done = index <= activeStep && order.status !== "cancelado";
                return (
                  <li key={step.id} className="flex items-center gap-2.5 sm:flex-col sm:items-start">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                        done ? "bg-forest text-cream" : "border border-cocoa/25 text-cocoa/50"
                      }`}
                    >
                      {done ? <Icon name="check" className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span className={`text-[11px] ${done ? "font-semibold text-forest" : "text-cocoa/60"}`}>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
            {order.status === "cancelado" ? (
              <p className="mt-3 text-[11.5px] text-rose">Este pedido fue cancelado.</p>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-[24px] border border-cocoa/12 bg-cream/90">
            <div className="border-b border-cocoa/12 px-5 py-4">
              <p className="eyebrow text-[9px]">Detalle</p>
              <p className="mt-1 font-serif text-[20px] text-forest">Tu selección</p>
            </div>
            <ul className="divide-y divide-cocoa/10 px-5">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 py-3 text-[12px]">
                  <span className="text-charcoal">
                    {item.quantity}× {item.name}
                    <span className="block text-[10px] uppercase tracking-[0.12em] text-cocoa/55">
                      {item.sizeLabel}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-forest">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 border-t border-cocoa/12 px-5 py-4 text-[12px]">
              <div className="flex justify-between">
                <span className="text-cocoa">Subtotal</span>
                <span className="text-forest">{formatPrice(order.subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa">Envío</span>
                <span className="text-forest">
                  {order.deliveryFeeCents === 0 ? "Gratis" : formatPrice(order.deliveryFeeCents)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-cocoa/12 pt-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa">
                  Total
                </span>
                <span className="font-serif text-[23px] text-forest">
                  {formatPrice(order.totalCents)}
                </span>
              </div>
              <p className="pt-1 text-[10.5px] text-cocoa/60">
                Pago: {methodLabel}
              </p>
            </div>
          </div>

          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark w-full"
          >
            <Icon name="whatsapp" className="h-4 w-4" /> Confirmar por WhatsApp
          </a>
          <Link href="/catalogo" className="btn btn-outline w-full">
            Seguir explorando
          </Link>
          <div className="rounded-2xl border border-cocoa/12 bg-white/60 p-4 text-[11.5px] leading-relaxed text-cocoa">
            <p className="flex items-center gap-2 font-semibold text-forest">
              <Icon name="clock" className="h-3.5 w-3.5 text-sage-deep" /> ¿Necesitas un cambio?
            </p>
            <p className="mt-1.5">
              Escríbenos con tu código <strong>{order.code}</strong> hasta 24 horas
              antes de la entrega y reprogramamos sin costo.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
