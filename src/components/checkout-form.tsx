"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/brand";
import { useCart } from "@/components/cart";
import {
  BRAND,
  DELIVERY_SLOTS,
  DISTRICTS,
  PAYMENT_METHODS,
  deliveryFeeCents,
  formatPrice,
  whatsappLink,
  type PaymentMethodId,
} from "@/lib/brand";
import { cardBrand, expiryValid, luhnValid, onlyDigits } from "@/lib/payments";

type DeliveryMethod = "envio" | "recojo";

export function CheckoutForm({ gatewayLive }: { gatewayLive: boolean }) {
  const { items, subtotalCents, setQuantity, removeItem, clear, hydrated } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("envio");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState<string>(DELIVERY_SLOTS[1]);
  const [district, setDistrict] = useState(DISTRICTS[0].name);
  const [address, setAddress] = useState("");
  const [addressReference, setAddressReference] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("tarjeta");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date();
    const max = new Date();
    max.setDate(max.getDate() + 60);
    setMinDate(today.toISOString().slice(0, 10));
    setMaxDate(max.toISOString().slice(0, 10));
  }, []);

  const shippingCents =
    deliveryMethod === "recojo" ? 0 : deliveryFeeCents(district, subtotalCents);
  const totalCents = subtotalCents + shippingCents;
  const freeShipping = shippingCents === 0 && deliveryMethod === "envio";

  const summary = useMemo(
    () =>
      [
        "🌸 *Pedido Floréa*",
        ...items.map(
          (item) =>
            `• ${item.quantity}x ${item.name} (${item.sizeLabel}) — ${formatPrice(
              item.unitPriceCents * item.quantity,
            )}`,
        ),
        `Subtotal: ${formatPrice(subtotalCents)}`,
        `Envío: ${shippingCents === 0 ? "Gratis / recojo" : formatPrice(shippingCents)}`,
        `Total: ${formatPrice(totalCents)}`,
        `Entrega: ${deliveryDate || "por coordinar"} · ${deliverySlot}`,
        deliveryMethod === "envio"
          ? `Dirección: ${address}, ${district}`
          : "Recojo en tienda: Av. La Mar 1234, Miraflores",
        cardMessage ? `Dedicatoria: “${cardMessage}”` : "",
        customerName ? `A nombre de: ${customerName}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [
      items,
      subtotalCents,
      shippingCents,
      totalCents,
      deliveryDate,
      deliverySlot,
      deliveryMethod,
      address,
      district,
      cardMessage,
      customerName,
    ],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("Tu carrito está vacío. Elige un arreglo antes de continuar.");
      return;
    }
    if (customerName.trim().length < 2) {
      setError("Ingresa tu nombre completo.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setError("Ingresa un correo válido para enviarte la confirmación.");
      return;
    }
    if (onlyDigits(customerPhone).length < 9) {
      setError("Ingresa un WhatsApp válido (9 dígitos).");
      return;
    }
    if (!deliveryDate) {
      setError("Elige la fecha de entrega.");
      return;
    }
    if (deliveryMethod === "envio" && address.trim().length < 6) {
      setError("Ingresa la dirección completa de entrega.");
      return;
    }
    if (paymentMethod === "tarjeta") {
      if (!luhnValid(cardNumber)) {
        setError("El número de tarjeta no es válido. Revísalo e intenta otra vez.");
        return;
      }
      if (!expiryValid(cardExpiry)) {
        setError("La fecha de vencimiento no es válida (MM/AA).");
        return;
      }
      if (onlyDigits(cardCvv).length < 3) {
        setError("Ingresa el código CVV de tu tarjeta.");
        return;
      }
      if (cardHolder.trim().length < 3) {
        setError("Ingresa el nombre tal como aparece en la tarjeta.");
        return;
      }
    }
    if (!terms) {
      setError("Acepta los términos para finalizar tu pedido.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryMethod,
          deliveryDate,
          deliverySlot,
          district,
          address,
          addressReference,
          recipientName,
          recipientPhone,
          cardMessage,
          notes,
          items: items.map((item) => ({
            slug: item.slug,
            name: item.name,
            sizeLabel: item.sizeLabel,
            unitPriceCents: item.unitPriceCents,
            quantity: item.quantity,
          })),
          paymentMethod,
          card:
            paymentMethod === "tarjeta"
              ? {
                  number: cardNumber,
                  holder: cardHolder,
                  expiry: cardExpiry,
                  cvv: cardCvv,
                }
              : undefined,
        }),
      });
      const payload = (await response.json()) as { code?: string; error?: string };
      if (!response.ok || !payload.code) {
        throw new Error(payload.error ?? "No pudimos registrar tu pedido.");
      }
      clear();
      router.push(`/pedido/${payload.code}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ocurrió un error inesperado. Intenta nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="panel mx-auto max-w-xl px-6 py-14 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage/20 text-forest">
          <Icon name="bag" className="h-7 w-7" />
        </span>
        <h1 className="display mt-5 text-3xl">Tu carrito está en calma</h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-cocoa">
          Elige tu arreglo favorito, personaliza el tamaño y agenda la entrega.
          Estamos listos para hacer florecer tu detalle.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/catalogo" className="btn btn-dark">
            Ver catálogo <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <Link href="/personalizar" className="btn btn-outline">
            Diseñar a medida
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
      <div className="space-y-6">
        {/* 1. CONTACTO */}
        <section className="panel p-6 sm:p-7">
          <SectionTitle number="1" title="Datos de contacto" hint="Para enviarte la confirmación" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre y apellido *">
              <input
                className="field"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Camila Rojas"
                autoComplete="name"
                required
              />
            </Field>
            <Field label="Correo electrónico *">
              <input
                type="email"
                className="field"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="camila@correo.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field label="WhatsApp *" full>
              <input
                type="tel"
                className="field"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="+51 987 654 321"
                autoComplete="tel"
                required
              />
            </Field>
          </div>
        </section>

        {/* 2. ENTREGA */}
        <section className="panel p-6 sm:p-7">
          <SectionTitle number="2" title="Fecha y lugar de entrega" hint="Lima Metropolitana" />

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {(
              [
                {
                  id: "envio" as DeliveryMethod,
                  label: "Envío a domicilio",
                  hint: "Lima · según distrito",
                  icon: "truck",
                },
                {
                  id: "recojo" as DeliveryMethod,
                  label: "Recojo en tienda",
                  hint: "Miraflores · sin costo",
                  icon: "pin",
                },
              ]
            ).map((option) => {
              const active = deliveryMethod === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDeliveryMethod(option.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                    active
                      ? "border-forest bg-forest text-cream"
                      : "border-cocoa/20 bg-white/70 text-charcoal hover:border-sage-deep"
                  }`}
                >
                  <Icon name={option.icon} className={`h-5 w-5 ${active ? "text-gold" : "text-sage-deep"}`} />
                  <span>
                    <span className="block text-[12.5px] font-semibold">{option.label}</span>
                    <span className={`block text-[10.5px] ${active ? "text-cream/65" : "text-cocoa/65"}`}>
                      {option.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Fecha de entrega *">
              <input
                type="date"
                className="field"
                min={minDate || undefined}
                max={maxDate || undefined}
                value={deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                required
              />
            </Field>
            <Field label="Horario de entrega *">
              <select
                className="field"
                value={deliverySlot}
                onChange={(event) => setDeliverySlot(event.target.value)}
              >
                {DELIVERY_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </Field>

            {deliveryMethod === "envio" ? (
              <>
                <Field label="Distrito *">
                  <select
                    className="field"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                  >
                    {DISTRICTS.map((entry) => (
                      <option key={entry.name} value={entry.name}>
                        {entry.name} · envío {formatPrice(entry.feeCents)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Dirección completa *">
                  <input
                    className="field"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Av. La Mar 1234, dpto. 502"
                    autoComplete="street-address"
                    required
                  />
                </Field>
                <Field label="Referencia (opcional)" full>
                  <input
                    className="field"
                    value={addressReference}
                    onChange={(event) => setAddressReference(event.target.value)}
                    placeholder="Frente al parque, edificio de rejas verdes"
                  />
                </Field>
              </>
            ) : (
              <div className="rounded-2xl border border-sage/40 bg-sage/10 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest">
                  <Icon name="pin" className="h-4 w-4" /> Atelier Floréa
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-cocoa">
                  {BRAND.address}. Te avisamos por WhatsApp cuando tu arreglo esté
                  listo. Horario: {BRAND.hours}.
                </p>
              </div>
            )}

            <Field label="¿Quién recibe? (opcional)">
              <input
                className="field"
                value={recipientName}
                onChange={(event) => setRecipientName(event.target.value)}
                placeholder="Nombre de la persona sorprendida"
              />
            </Field>
            <Field label="WhatsApp de quien recibe (opcional)">
              <input
                type="tel"
                className="field"
                value={recipientPhone}
                onChange={(event) => setRecipientPhone(event.target.value)}
                placeholder="Para coordinar la entrega"
              />
            </Field>
          </div>
        </section>

        {/* 3. DEDICATORIA */}
        <section className="panel p-6 sm:p-7">
          <SectionTitle number="3" title="Dedicatoria y notas" hint="La escribimos a mano" />
          <div className="mt-5 grid gap-4">
            <Field label={`Mensaje para la tarjeta (${cardMessage.length}/200)`}>
              <textarea
                className="field min-h-[80px] resize-y"
                maxLength={200}
                value={cardMessage}
                onChange={(event) => setCardMessage(event.target.value)}
                placeholder="Para ti, porque contigo todo florece. Te amo."
              />
            </Field>
            <Field label="Indicaciones especiales">
              <textarea
                className="field min-h-[70px] resize-y"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Tocar el timbre, dejar en recepción, horario de oficina…"
              />
            </Field>
          </div>
        </section>

        {/* 4. PAGO */}
        <section className="panel p-6 sm:p-7" id="pago">
          <SectionTitle number="4" title="Pago online" hint="Datos protegidos" />

          {!gatewayLive ? (
            <p className="mt-4 rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 text-[11.5px] leading-relaxed text-cocoa">
              <strong className="text-forest">Entorno de demostración.</strong> La
              pasarela aún no está conectada: tu tarjeta no será cobrada. El pedido
              se registra como pago de prueba y coordinamos el cobro real por
              WhatsApp.
            </p>
          ) : null}

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {PAYMENT_METHODS.map((method) => {
              const active = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  aria-pressed={active}
                  className={`rounded-2xl border px-4 py-3.5 text-left transition ${
                    active
                      ? "border-forest bg-forest text-cream"
                      : "border-cocoa/20 bg-white/70 text-charcoal hover:border-sage-deep"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold">{method.label}</span>
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full border ${
                        active ? "border-gold" : "border-cocoa/30"
                      }`}
                    >
                      {active ? <span className="h-2 w-2 rounded-full bg-gold" /> : null}
                    </span>
                  </span>
                  <span className={`mt-1 block text-[10.5px] ${active ? "text-cream/65" : "text-cocoa/65"}`}>
                    {method.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {paymentMethod === "tarjeta" ? (
            <div className="mt-5 rounded-2xl border border-cocoa/15 bg-white/70 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest">
                  <Icon name="card" className="h-4 w-4" /> Tarjeta
                </p>
                <span className="text-[10px] font-semibold tracking-[0.1em] text-cocoa/70">
                  {cardNumber ? cardBrand(cardNumber) : "Visa · Mastercard · Amex"}
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Número de tarjeta *" full>
                  <input
                    className="field tracking-[0.12em]"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={cardNumber}
                    onChange={(event) => {
                      const digits = onlyDigits(event.target.value).slice(0, 19);
                      setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    placeholder="4111 1111 1111 1111"
                    required
                  />
                </Field>
                <Field label="Nombre en la tarjeta *">
                  <input
                    className="field"
                    autoComplete="cc-name"
                    value={cardHolder}
                    onChange={(event) => setCardHolder(event.target.value.toUpperCase())}
                    placeholder="CAMILA ROJAS"
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Vence *">
                    <input
                      className="field"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={cardExpiry}
                      onChange={(event) => {
                        const digits = onlyDigits(event.target.value).slice(0, 4);
                        setCardExpiry(
                          digits.length > 2
                            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                            : digits,
                        );
                      }}
                      placeholder="MM/AA"
                      required
                    />
                  </Field>
                  <Field label="CVV *">
                    <input
                      className="field"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={cardCvv}
                      onChange={(event) =>
                        setCardCvv(onlyDigits(event.target.value).slice(0, 4))
                      }
                      placeholder="123"
                      required
                    />
                  </Field>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[10.5px] text-cocoa/65">
                <Icon name="lock" className="h-3.5 w-3.5 text-sage-deep" />
                No almacenamos el número completo ni el CVV. Solo guardamos los
                últimos 4 dígitos para tu comprobante.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-sage/40 bg-sage/10 p-4">
              <p className="text-[12px] leading-relaxed text-cocoa">
                Al confirmar, te enviaremos el{" "}
                {paymentMethod === "yape" ? "QR de Yape" : paymentMethod === "plin" ? "número de Plin" : "número de cuenta"}{" "}
                de Floréa por WhatsApp junto con el resumen de tu pedido. Tu
                arreglo se prepara apenas confirmes el abono.
              </p>
            </div>
          )}

          <label className="mt-5 flex items-start gap-3 text-[11.5px] leading-relaxed text-cocoa">
            <input
              type="checkbox"
              checked={terms}
              onChange={(event) => setTerms(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#163f33]"
            />
            <span>
              Acepto la coordinación por WhatsApp y las condiciones de entrega de
              Floréa. Entiendo que las flores dependen de la temporada y pueden
              variar manteniendo la paleta y el valor.
            </span>
          </label>
        </section>
      </div>

      {/* RESUMEN */}
      <aside className="lg:sticky lg:top-32">
        <div className="overflow-hidden rounded-[26px] border border-cocoa/12 bg-cream/90">
          <div className="border-b border-cocoa/12 px-6 py-5">
            <p className="eyebrow text-[9px]">Resumen del pedido</p>
            <p className="mt-1 font-serif text-[22px] text-forest">
              {items.reduce((sum, item) => sum + item.quantity, 0)} productos
            </p>
          </div>

          <div className="max-h-[320px] overflow-y-auto px-6 py-5">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <div className="h-[68px] w-[56px] shrink-0 overflow-hidden rounded-xl bg-sand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-serif text-[15px] leading-tight text-forest">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Quitar ${item.name}`}
                        className="text-cocoa/45 hover:text-rose"
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-cocoa/60">
                      {item.sizeLabel}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-cocoa/20">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                          aria-label="Quitar una unidad"
                          className="grid h-6 w-6 place-items-center text-cocoa hover:text-forest"
                        >
                          <Icon name="minus" className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-[11px] font-semibold text-forest">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                          aria-label="Agregar una unidad"
                          className="grid h-6 w-6 place-items-center text-cocoa hover:text-forest"
                        >
                          <Icon name="plus" className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-[12px] font-semibold text-forest">
                        {formatPrice(item.unitPriceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-cocoa/12 px-6 py-5 text-[12px]">
            <div className="flex justify-between py-1">
              <span className="text-cocoa">Subtotal</span>
              <span className="font-medium text-forest">{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-cocoa">Envío</span>
              <span className="font-medium text-forest">
                {deliveryMethod === "recojo"
                  ? "Recojo en tienda"
                  : freeShipping
                    ? "Gratis"
                    : shippingCents === 0
                      ? "Por coordinar"
                      : formatPrice(shippingCents)}
              </span>
            </div>
            {deliveryMethod === "envio" && shippingCents > 0 ? (
              <p className="mt-1 text-[10.5px] text-cocoa/60">
                Envío gratis desde {formatPrice(BRAND.freeShippingFromCents)}.
              </p>
            ) : null}
            <div className="mt-3 flex items-baseline justify-between border-t border-cocoa/12 pt-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-cocoa">
                Total
              </span>
              <span className="font-serif text-[26px] text-forest">
                {formatPrice(totalCents)}
              </span>
            </div>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-rose/60 bg-rose/15 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-cocoa"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || !items.length}
              className="btn btn-dark mt-4 w-full"
            >
              {submitting ? "Procesando pago…" : "Confirmar y pagar"}
              {!submitting ? <Icon name="arrow" className="h-4 w-4" /> : null}
            </button>

            <a
              href={whatsappLink(summary)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-2.5 w-full !py-3"
            >
              <Icon name="whatsapp" className="h-4 w-4" /> Prefiero pedir por WhatsApp
            </a>

            <div className="mt-4 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.14em] text-cocoa/50">
              <span className="flex items-center gap-1">
                <Icon name="lock" className="h-3 w-3" /> SSL
              </span>
              <span>·</span>
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Yape</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-cocoa/12 bg-white/60 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-forest">
            ¿Necesitas ayuda ahora?
          </p>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-cocoa">
            Escríbenos al {BRAND.whatsappDisplay}. Atendemos de lunes a sábado de
            9:00 a 20:00.
          </p>
        </div>
      </aside>
    </form>
  );
}

function SectionTitle({
  number,
  title,
  hint,
}: {
  number: string;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-3.5 border-b border-cocoa/12 pb-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage/25 font-serif text-[15px] text-forest">
        {number}
      </span>
      <div>
        <h2 className="font-serif text-[21px] leading-tight text-forest">{title}</h2>
        <p className="text-[10.5px] uppercase tracking-[0.14em] text-cocoa/55">{hint}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
