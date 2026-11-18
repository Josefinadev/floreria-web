import type { PaymentMethodId } from "@/lib/brand";

export type CardDetails = {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
};

export type PaymentOutcome = {
  status: "aprobado" | "simulado" | "pendiente" | "rechazado";
  provider: string;
  reference: string;
  last4: string;
  message: string;
};

/**
 * Detecta si ya existe una pasarela configurada.
 * Cuando el cliente cargue sus credenciales en .env, el flujo cambia solo.
 *
 * Variables reconocidas:
 *  - CULQI_SECRET_KEY          (Perú · tarjetas, Yape)
 *  - MERCADOPAGO_ACCESS_TOKEN  (Perú · tarjetas, Yape, Plin)
 *  - STRIPE_SECRET_KEY         (internacional)
 */
export function detectProvider(): { id: string; live: boolean } {
  if (process.env.CULQI_SECRET_KEY) return { id: "culqi", live: true };
  if (process.env.MERCADOPAGO_ACCESS_TOKEN) return { id: "mercadopago", live: true };
  if (process.env.STRIPE_SECRET_KEY) return { id: "stripe", live: true };
  return { id: "demo", live: false };
}

export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

export function luhnValid(cardNumber: string): boolean {
  const digits = onlyDigits(cardNumber);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function expiryValid(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const end = new Date(year, month, 1);
  return end.getTime() > now.getTime();
}

export function cardBrand(cardNumber: string): string {
  const digits = onlyDigits(cardNumber);
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6/.test(digits)) return "Diners";
  return "Tarjeta";
}

export function maskCard(cardNumber: string): string {
  return onlyDigits(cardNumber).slice(-4).padStart(4, "•");
}

function reference(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .toUpperCase()
    .slice(2, 6)}`;
}

/**
 * Punto único de cobro. En modo demo simula la autorización para que todo el
 * flujo (pedido → pago → confirmación → WhatsApp) sea verificable.
 *
 * Para conectar la pasarela real:
 *  1. Agrega CULQI_SECRET_KEY / MERCADOPAGO_ACCESS_TOKEN en .env
 *  2. Reemplaza el bloque `live` por la llamada al API del proveedor.
 *  3. Confirma el pago con el webhook (/api/payments/webhook) antes de marcar
 *     el pedido como pagado.
 */
export async function processPayment(input: {
  method: PaymentMethodId;
  amountCents: number;
  card?: CardDetails;
  customer: { name: string; email: string; phone: string };
}): Promise<PaymentOutcome> {
  const provider = detectProvider();

  if (input.method !== "tarjeta") {
    const labels: Record<string, string> = {
      yape: "Yape",
      plin: "Plin",
      transferencia: "Transferencia bancaria",
    };
    return {
      status: "pendiente",
      provider: "manual",
      reference: reference(input.method.toUpperCase()),
      last4: "",
      message: `${labels[input.method] ?? "Pago manual"}: coordinaremos la confirmación por WhatsApp.`,
    };
  }

  const card = input.card;
  if (!card || !luhnValid(card.number) || !expiryValid(card.expiry) || onlyDigits(card.cvv).length < 3) {
    return {
      status: "rechazado",
      provider: provider.id,
      reference: reference("ERR"),
      last4: card ? onlyDigits(card.number).slice(-4) : "",
      message: "Revisa los datos de tu tarjeta e inténtalo nuevamente.",
    };
  }

  const last4 = onlyDigits(card.number).slice(-4);

  if (!provider.live) {
    // Simulación local. La tarjeta terminada en 0000 se rechaza a propósito.
    if (last4 === "0000") {
      return {
        status: "rechazado",
        provider: "demo",
        reference: reference("DEMO-ERR"),
        last4,
        message: "El banco rechazó la tarjeta de prueba terminada en 0000.",
      };
    }
    return {
      status: "simulado",
      provider: "demo",
      reference: reference("DEMO"),
      last4,
      message:
        "Pago de prueba aprobado. No se realizó ningún cargo real (modo demostración).",
    };
  }

  // ---------------------------------------------------------------------------
  // PASARELA REAL — aquí va la llamada al proveedor (Culqi / Mercado Pago / Stripe)
  // ---------------------------------------------------------------------------
  // const charge = await fetch("https://api.culqi.com/v2/charges", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     amount: input.amountCents,
  //     currency_code: "PEN",
  //     email: input.customer.email,
  //     source_id: tokenFromClient,
  //   }),
  // });
  // const data = await charge.json();
  //
  // Importante: el token de tarjeta se genera en el navegador del cliente
  // (Culqi Checkout / Mercado Pago Brick) para no tocar datos sensibles aquí.
  console.info(
    `[payments] Proveedor ${provider.id} configurado. Falta completar la llamada de cobro.`,
    { amountCents: input.amountCents, email: input.customer.email },
  );

  return {
    status: "pendiente",
    provider: provider.id,
    reference: reference(provider.id.toUpperCase()),
    last4,
    message:
      "Recibimos tus datos. La pasarela confirmará el pago en segundos y te avisaremos por correo y WhatsApp.",
  };
}
