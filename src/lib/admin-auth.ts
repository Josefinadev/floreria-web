import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "florea_admin";
const MAX_AGE = 60 * 60 * 8;

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "florea2026";
}

function sessionToken(): string {
  return createHash("sha256")
    .update(`florea-admin::${adminPassword()}`)
    .digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === sessionToken();
}

export async function signInAdmin(password: string): Promise<boolean> {
  if (password !== adminPassword()) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return true;
}

export async function signOutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
