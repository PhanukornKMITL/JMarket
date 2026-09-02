"use server";

import { redirect } from "next/navigation";

import { createSession, verifyPassword } from "@/lib/auth";

export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!password) return { error: "กรอกรหัสผ่าน" };

  let ok = false;
  try {
    ok = verifyPassword(password);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "ตรวจรหัสผ่านไม่ได้" };
  }

  if (!ok) return { error: "รหัสผ่านไม่ถูกต้อง" };

  await createSession();
  redirect(next.startsWith("/admin") ? next : "/admin");
}
