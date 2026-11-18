"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin, signInAdmin, signOutAdmin } from "@/lib/admin-auth";
import { updateOrderStatus, updateProductFlags } from "@/lib/data";

const ORDER_STATUSES = [
  "nuevo",
  "en_preparacion",
  "en_camino",
  "entregado",
  "cancelado",
];

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const ok = await signInAdmin(password);
  if (!ok) redirect("/admin?error=1");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await signOutAdmin();
  redirect("/admin");
}

export async function changeOrderStatusAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");
  const code = String(formData.get("code") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!code || !ORDER_STATUSES.includes(status)) return;
  await updateOrderStatus(code, status);
  revalidatePath("/admin");
}

export async function saveProductAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;
  const priceSoles = Number(formData.get("price") ?? "");
  const flags: { active: boolean; featured: boolean; priceCents?: number } = {
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
  };
  if (Number.isFinite(priceSoles) && priceSoles > 0) {
    flags.priceCents = Math.round(priceSoles * 100);
  }
  await updateProductFlags(slug, flags);
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/");
}
