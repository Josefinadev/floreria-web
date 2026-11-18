import { createCustomRequest } from "@/lib/data";

export const dynamic = "force-dynamic";

function str(value: unknown, max = 400): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const name = str(body.name, 120);
  const phone = str(body.phone, 40);
  const email = str(body.email, 160);
  const deliveryDate = str(body.deliveryDate, 12);

  if (name.length < 2) {
    return Response.json({ error: "Cuéntanos tu nombre." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 9) {
    return Response.json(
      { error: "Ingresa un WhatsApp válido de 9 dígitos." },
      { status: 400 },
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
    return Response.json({ error: "Elige la fecha de entrega." }, { status: 400 });
  }
  if (body.terms === false) {
    return Response.json(
      { error: "Acepta la coordinación por WhatsApp para continuar." },
      { status: 400 },
    );
  }

  try {
    const result = await createCustomRequest({
      name,
      phone,
      email,
      occasion: str(body.occasion, 80),
      style: str(body.style, 60),
      size: str(body.size, 40),
      palette: str(body.palette, 80),
      flowers: str(body.flowers, 300),
      budgetCents: Number(body.budgetCents) || 0,
      dedication: str(body.dedication, 240),
      deliveryDate,
      deliverySlot: str(body.deliverySlot, 40),
      district: str(body.district, 90),
      notes: str(body.notes, 600),
    });

    return Response.json({ code: result.code }, { status: 201 });
  } catch (error) {
    console.error("POST /api/custom-requests error:", error);
    return Response.json(
      { error: "No pudimos guardar tu solicitud. Intenta otra vez o escríbenos por WhatsApp." },
      { status: 500 },
    );
  }
}
