import {
  createOrder,
  getOrderByCode,
  updateOrderPayment,
  updateOrderStatus,
  type NewOrderItem,
} from "@/lib/data";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/brand";
import { processPayment } from "@/lib/payments";

export const dynamic = "force-dynamic";

function str(value: unknown, max = 320): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const METHOD_IDS = PAYMENT_METHODS.map((method) => method.id) as string[];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const customerName = str(body.customerName, 120);
  const customerEmail = str(body.customerEmail, 160);
  const customerPhone = str(body.customerPhone, 40);
  const deliveryMethod = body.deliveryMethod === "recojo" ? "recojo" : "envio";
  const deliveryDate = str(body.deliveryDate, 12);
  const deliverySlot = str(body.deliverySlot, 40);
  const district = str(body.district, 90);
  const address = str(body.address, 240);
  const cardMessage = str(body.cardMessage, 240);
  const paymentMethod = str(body.paymentMethod, 24) as PaymentMethodId;

  if (customerName.length < 2) {
    return Response.json({ error: "Ingresa tu nombre completo." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return Response.json({ error: "El correo no es válido." }, { status: 400 });
  }
  if (customerPhone.replace(/\D/g, "").length < 9) {
    return Response.json({ error: "El WhatsApp no es válido." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
    return Response.json({ error: "Elige una fecha de entrega válida." }, { status: 400 });
  }
  const today = new Date().toISOString().slice(0, 10);
  if (deliveryDate < today) {
    return Response.json(
      { error: "La fecha de entrega ya pasó. Elige otra." },
      { status: 400 },
    );
  }
  if (!deliverySlot) {
    return Response.json({ error: "Elige un horario de entrega." }, { status: 400 });
  }
  if (deliveryMethod === "envio" && address.length < 6) {
    return Response.json({ error: "Falta la dirección de entrega." }, { status: 400 });
  }
  if (!METHOD_IDS.includes(paymentMethod)) {
    return Response.json({ error: "Método de pago no válido." }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items: NewOrderItem[] = rawItems
    .slice(0, 20)
    .map((entry) => {
      const item = entry as Record<string, unknown>;
      return {
        slug: str(item.slug, 90),
        name: str(item.name, 120),
        sizeLabel: str(item.sizeLabel, 30) || "Clásico",
        unitPriceCents: Number(item.unitPriceCents) || 0,
        quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 20),
        note: str(item.note, 200),
      };
    })
    .filter((item) => item.slug.length > 0);

  if (items.length === 0) {
    return Response.json(
      { error: "Tu carrito está vacío. Agrega un arreglo para continuar." },
      { status: 400 },
    );
  }

  const cardRaw = (body.card ?? {}) as Record<string, unknown>;
  const card =
    paymentMethod === "tarjeta"
      ? {
          number: str(cardRaw.number, 25),
          holder: str(cardRaw.holder, 120),
          expiry: str(cardRaw.expiry, 8),
          cvv: str(cardRaw.cvv, 6),
        }
      : undefined;

  try {
    const order = await createOrder({
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      deliveryDate,
      deliverySlot,
      district: deliveryMethod === "envio" ? district : "",
      address: deliveryMethod === "envio" ? address : "",
      addressReference: str(body.addressReference, 200),
      recipientName: str(body.recipientName, 120),
      recipientPhone: str(body.recipientPhone, 40),
      cardMessage,
      notes: str(body.notes, 600),
      items,
      paymentMethod,
      paymentStatus: "pendiente",
      paymentProvider: "pendiente",
      paymentReference: "",
      cardLast4: "",
    });

    // Cobro con la pasarela (o simulación local si aún no hay credenciales).
    const payment = await processPayment({
      method: paymentMethod,
      amountCents: order.totalCents,
      card,
      customer: { name: customerName, email: customerEmail, phone: customerPhone },
    });

    await updateOrderPayment(order.code, {
      status: payment.status,
      provider: payment.provider,
      reference: payment.reference,
      last4: payment.last4,
    });

    if (payment.status === "rechazado") {
      await updateOrderStatus(order.code, "cancelado");
      return Response.json(
        {
          error: payment.message,
          code: order.code,
          paymentStatus: payment.status,
        },
        { status: 402 },
      );
    }

    const saved = await getOrderByCode(order.code);
    return Response.json(
      {
        code: order.code,
        totalCents: order.totalCents,
        paymentStatus: payment.status,
        paymentMessage: payment.message,
        paymentReference: payment.reference,
        hasItems: Boolean(saved?.items.length),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json(
      { error: "No pudimos registrar tu pedido. Intenta nuevamente o escríbenos por WhatsApp." },
      { status: 500 },
    );
  }
}
