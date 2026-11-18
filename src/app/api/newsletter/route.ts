import { subscribeNewsletter } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = (await request.json()) as { email?: unknown };
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Correo no válido." }, { status: 400 });
  }

  try {
    await subscribeNewsletter(email);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return Response.json({ error: "No pudimos registrar tu correo." }, { status: 500 });
  }
}
