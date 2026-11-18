"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { FlowerMark, Icon } from "@/components/brand";
import {
  BUDGETS,
  CUSTOM_PALETTES,
  CUSTOM_STYLES,
  DELIVERY_SLOTS,
  DISTRICTS,
  FLOWER_OPTIONS,
  OCCASIONS,
  SIZES,
  formatDateLong,
  formatPrice,
  tomorrowISO,
  whatsappLink,
} from "@/lib/brand";

type FormState = {
  name: string;
  phone: string;
  email: string;
  occasion: string;
  style: string;
  size: string;
  palette: string;
  flowers: string[];
  budgetCents: number;
  dedication: string;
  deliveryDate: string;
  deliverySlot: string;
  district: string;
  notes: string;
  terms: boolean;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  occasion: OCCASIONS[0],
  style: CUSTOM_STYLES[1].id,
  size: SIZES[0].label,
  palette: CUSTOM_PALETTES[0].label,
  flowers: ["Rosas garden", "Eucalipto"],
  budgetCents: BUDGETS[1].value,
  dedication: "",
  deliveryDate: "",
  deliverySlot: DELIVERY_SLOTS[1],
  district: DISTRICTS[0].name,
  notes: "",
  terms: false,
};

export function CustomOrderForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ code: string } | null>(null);

  useEffect(() => {
    setMinDate(tomorrowISO(1));
    setMaxDate(tomorrowISO(60));
  }, []);

  const style = CUSTOM_STYLES.find((entry) => entry.id === form.style) ?? CUSTOM_STYLES[0];
  const size = SIZES.find((entry) => entry.label === form.size) ?? SIZES[0];
  const estimateCents = style.from + size.extraCents;
  const palette = CUSTOM_PALETTES.find((entry) => entry.label === form.palette);

  const summary = useMemo(() => {
    return [
      "🌸 *Pedido personalizado Floréa*",
      `Nombre: ${form.name || "—"}`,
      `WhatsApp: ${form.phone || "—"}`,
      `Ocasión: ${form.occasion}`,
      `Estilo: ${style.label}`,
      `Tamaño: ${form.size}`,
      `Paleta: ${form.palette}`,
      `Flores: ${form.flowers.length ? form.flowers.join(", ") : "A elección de la florista"}`,
      `Presupuesto: ${formatPrice(form.budgetCents)}`,
      `Entrega: ${form.deliveryDate ? formatDateLong(form.deliveryDate) : "Por coordinar"} · ${form.deliverySlot}`,
      `Distrito: ${form.district}`,
      form.dedication ? `Dedicatoria: “${form.dedication}”` : "",
      form.notes ? `Notas: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [form, style.label]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function toggleFlower(flower: string) {
    setForm((previous) => ({
      ...previous,
      flowers: previous.flowers.includes(flower)
        ? previous.flowers.filter((entry) => entry !== flower)
        : [...previous.flowers, flower],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Cuéntanos tu nombre para preparar tu pedido.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 9) {
      setError("Necesitamos un WhatsApp válido de 9 dígitos.");
      return;
    }
    if (!form.deliveryDate) {
      setError("Elige la fecha en que quieres recibir tu arreglo.");
      return;
    }
    if (!form.terms) {
      setError("Acepta la coordinación por WhatsApp para continuar.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          flowers: form.flowers.join(", "),
        }),
      });
      const payload = (await response.json()) as { code?: string; error?: string };
      if (!response.ok || !payload.code) {
        throw new Error(payload.error ?? "No pudimos registrar tu pedido.");
      }
      setResult({ code: payload.code });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ocurrió un error. Intenta nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="animate-pop mx-auto max-w-2xl rounded-[28px] border border-sage/50 bg-cream p-8 text-center sm:p-12">
        <FlowerMark className="mx-auto h-16 w-16 text-sage-deep" />
        <p className="eyebrow mt-5">Pedido personalizado registrado</p>
        <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.6rem)]">
          Tu idea ya está en nuestras manos
        </h2>
        <p className="mt-3 text-[13.5px] leading-relaxed text-cocoa">
          Guardamos tu solicitud con el código{" "}
          <strong className="text-forest">{result.code}</strong>. Una florista te
          escribirá por WhatsApp para afinar detalles, confirmar disponibilidad y
          coordinar el pago.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink(summary)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
          >
            <Icon name="whatsapp" className="h-4 w-4" /> Enviar mi pedido por WhatsApp
          </a>
          <Link href="/catalogo" className="btn btn-outline">
            Seguir explorando
          </Link>
        </div>
        <p className="mt-5 text-[11px] text-cocoa/60">
          Código de referencia: {result.code} · Guarda este código para dar seguimiento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
      <form onSubmit={handleSubmit} className="panel p-6 sm:p-8">
        <div className="flex items-start gap-4 border-b border-cocoa/12 pb-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage/25 font-serif text-lg text-forest">
            1
          </span>
          <div>
            <h2 className="font-serif text-[23px] text-forest">Cuéntanos tu idea</h2>
            <p className="mt-1 text-[12.5px] text-cocoa">
              Mínimo 48 horas de anticipación para diseños a medida.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="custom-name" className="label">Tu nombre *</label>
            <input
              id="custom-name"
              className="field"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Ej. Camila Rojas"
              required
            />
          </div>
          <div>
            <label htmlFor="custom-phone" className="label">WhatsApp *</label>
            <input
              id="custom-phone"
              type="tel"
              className="field"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              placeholder="+51 987 654 321"
              required
            />
          </div>
          <div>
            <label htmlFor="custom-email" className="label">Correo (opcional)</label>
            <input
              id="custom-email"
              type="email"
              className="field"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label htmlFor="custom-occasion" className="label">Ocasión</label>
            <select
              id="custom-occasion"
              className="field"
              value={form.occasion}
              onChange={(event) => update("occasion", event.target.value)}
            >
              {OCCASIONS.map((occasion) => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 border-t border-cocoa/12 pt-6">
          <p className="label">Estilo del arreglo</p>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            {CUSTOM_STYLES.map((option) => {
              const active = option.id === form.style;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => update("style", option.id)}
                  aria-pressed={active}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition ${
                    active
                      ? "border-forest bg-forest text-cream"
                      : "border-cocoa/20 bg-white/70 text-charcoal hover:border-sage-deep"
                  }`}
                >
                  <span>
                    <span className="block font-serif text-[16px]">{option.label}</span>
                    <span className={`text-[10.5px] ${active ? "text-cream/70" : "text-cocoa/65"}`}>
                      desde {formatPrice(option.from)}
                    </span>
                  </span>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border ${
                      active ? "border-gold text-gold" : "border-cocoa/25 text-transparent"
                    }`}
                  >
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="custom-size" className="label">Tamaño</label>
            <select
              id="custom-size"
              className="field"
              value={form.size}
              onChange={(event) => update("size", event.target.value)}
            >
              {SIZES.map((entry) => (
                <option key={entry.id} value={entry.label}>
                  {entry.label} · {entry.description}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="custom-budget" className="label">Presupuesto</label>
            <select
              id="custom-budget"
              className="field"
              value={form.budgetCents}
              onChange={(event) => update("budgetCents", Number(event.target.value))}
            >
              {BUDGETS.map((entry) => (
                <option key={entry.value} value={entry.value}>{entry.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <p className="label">Paleta de colores</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CUSTOM_PALETTES.map((entry) => {
              const active = entry.label === form.palette;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => update("palette", entry.label)}
                  aria-pressed={active}
                  className={`flex items-center gap-2.5 rounded-full border px-3.5 py-2 transition ${
                    active
                      ? "border-forest bg-forest/95 text-cream"
                      : "border-cocoa/20 bg-white/70 text-charcoal hover:border-sage-deep"
                  }`}
                >
                  <span className="flex -space-x-1.5">
                    {entry.colors.map((color) => (
                      <span
                        key={color}
                        className="h-4 w-4 rounded-full border border-white/70"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  <span className="text-[11px] font-medium">{entry.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className="label">Flores preferidas (elige varias)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {FLOWER_OPTIONS.map((flower) => {
              const active = form.flowers.includes(flower);
              return (
                <button
                  key={flower}
                  type="button"
                  onClick={() => toggleFlower(flower)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-[11px] transition ${
                    active
                      ? "border-sage-deep bg-sage/30 text-forest"
                      : "border-cocoa/20 bg-white/60 text-cocoa hover:border-sage-deep hover:text-forest"
                  }`}
                >
                  {active ? "✿ " : ""}
                  {flower}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border-t border-cocoa/12 pt-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose/25 font-serif text-lg text-forest">
              2
            </span>
            <div>
              <h2 className="font-serif text-[23px] text-forest">Entrega y dedicatoria</h2>
              <p className="mt-1 text-[12.5px] text-cocoa">
                Programamos tu entrega hasta con 60 días de anticipación.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="custom-date" className="label">Fecha de entrega *</label>
              <input
                id="custom-date"
                type="date"
                className="field"
                min={minDate || undefined}
                max={maxDate || undefined}
                value={form.deliveryDate}
                onChange={(event) => update("deliveryDate", event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="custom-slot" className="label">Horario</label>
              <select
                id="custom-slot"
                className="field"
                value={form.deliverySlot}
                onChange={(event) => update("deliverySlot", event.target.value)}
              >
                {DELIVERY_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="custom-district" className="label">Distrito de entrega</label>
              <select
                id="custom-district"
                className="field"
                value={form.district}
                onChange={(event) => update("district", event.target.value)}
              >
                {DISTRICTS.map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name} · envío {formatPrice(district.feeCents)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="custom-dedication" className="label">
              Dedicatoria ({form.dedication.length}/200)
            </label>
            <textarea
              id="custom-dedication"
              className="field min-h-[86px] resize-y"
              maxLength={200}
              value={form.dedication}
              onChange={(event) => update("dedication", event.target.value)}
              placeholder="Escríbela tal como quieres que la caligrafiemos…"
            />
            <p className="mt-1.5 text-[10.5px] text-cocoa/60">
              La escribimos a mano en papel marfil. Sin costo adicional.
            </p>
          </div>

          <div className="mt-5">
            <label htmlFor="custom-notes" className="label">Referencias adicionales</label>
            <textarea
              id="custom-notes"
              className="field min-h-[70px] resize-y"
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="Colores de la casa, flores que no le gustan, horario del cumpleaños…"
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-rose/60 bg-rose/15 px-4 py-3 text-[12px] text-cocoa"
          >
            {error}
          </p>
        ) : null}

        <label className="mt-6 flex items-start gap-3 text-[11.5px] leading-relaxed text-cocoa">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(event) => update("terms", event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#163f33]"
          />
          <span>
            Acepto que una florista me contacte por WhatsApp para coordinar flores,
            pago y entrega. Entiendo que la disponibilidad depende de la temporada.
          </span>
        </label>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={submitting} className="btn btn-dark flex-1">
            {submitting ? "Enviando…" : "Enviar pedido personalizado"}
            <Icon name="arrow" className="h-4 w-4" />
          </button>
          <a
            href={whatsappLink(summary)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Icon name="whatsapp" className="h-4 w-4" /> Enviar por WhatsApp
          </a>
        </div>
      </form>

      <aside className="lg:sticky lg:top-32">
        <div className="overflow-hidden rounded-[28px] border border-forest/15 bg-forest text-cream">
          <div className="border-b border-cream/12 px-6 py-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-gold">
              Tu propuesta
            </p>
            <p className="mt-2 font-serif text-[24px] leading-tight">{style.label}</p>
            <p className="mt-1 text-[11.5px] text-cream/60">
              {form.size} · {palette?.label ?? form.palette}
            </p>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-wrap gap-1.5">
              {form.flowers.length ? (
                form.flowers.map((flower) => (
                  <span
                    key={flower}
                    className="rounded-full border border-cream/20 bg-cream/10 px-2.5 py-1 text-[10.5px] text-cream/85"
                  >
                    {flower}
                  </span>
                ))
              ) : (
                <span className="text-[11.5px] text-cream/60">
                  Flores a elección de nuestra florista
                </span>
              )}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-cream/12 pt-4 text-[11.5px]">
              <div className="flex justify-between gap-3">
                <dt className="text-cream/55">Ocasión</dt>
                <dd className="text-right text-cream/90">{form.occasion}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-cream/55">Entrega</dt>
                <dd className="text-right text-cream/90">
                  {form.deliveryDate ? formatDateLong(form.deliveryDate) : "Por elegir"}
                  <br />
                  <span className="text-cream/60">{form.deliverySlot}</span>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-cream/55">Distrito</dt>
                <dd className="text-right text-cream/90">{form.district}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-cream/55">Presupuesto</dt>
                <dd className="text-right text-cream/90">{formatPrice(form.budgetCents)}</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-2xl bg-cream/10 p-4">
              <p className="text-[9.5px] uppercase tracking-[0.18em] text-cream/55">
                Referencia estimada
              </p>
              <p className="mt-1 font-serif text-[28px] text-gold">
                {formatPrice(estimateCents)}
              </p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-cream/55">
                Precio final según flores de temporada. No se cobra nada ahora:
                primero confirmamos contigo.
              </p>
            </div>
          </div>

          <div className="border-t border-cream/12 bg-forest-deep/50 px-6 py-5">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/75">
              <Icon name="whatsapp" className="h-4 w-4 text-gold" /> Atención personalizada
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-cream/60">
              Respondemos en menos de 1 hora de lunes a sábado, de 9 a 20 h.
            </p>
            <Link
              href="/contacto"
              className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-cream"
            >
              Ver canales de contacto <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-cocoa/12 bg-cream/70 p-5">
          <p className="flex items-center gap-2 font-serif text-[16px] text-forest">
            <FlowerMark className="h-5 w-5 text-sage-deep" /> Nuestra promesa
          </p>
          <ul className="mt-3 space-y-2 text-[11.5px] text-cocoa">
            {[
              "Flores frescas cortadas el mismo día",
              "Fotografía final antes de la entrega",
              "Reposición garantizada si algo no llega perfecto",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-deep" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
