import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { SESSION_COOKIE, signSession, verifySession } from "./session";

const SCRYPT_KEYLEN = 32;

/** สร้าง hash รูปแบบ "scrypt:<saltHex>:<hashHex>" */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

/** ตรวจรหัสผ่านกับ ADMIN_PASSWORD_HASH */
export function verifyPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) {
    throw new Error("ยังไม่ได้ตั้งค่า ADMIN_PASSWORD_HASH — รัน `npm run hash -- 'รหัสผ่าน'`");
  }
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) {
    throw new Error("ADMIN_PASSWORD_HASH รูปแบบไม่ถูกต้อง");
  }
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** ล็อกอิน: เซ็ต session cookie */
export async function createSession(): Promise<void> {
  const token = await signSession({ role: "admin" });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** ล็อกเอาต์ */
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** true ถ้าล็อกอินอยู่ */
export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return (await verifySession(token)) !== null;
}

/** ใช้ต้นฟังก์ชันของ server action / route handler ที่ต้องเป็น admin */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthed())) {
    throw new Error("ไม่ได้รับอนุญาต — กรุณาเข้าสู่ระบบ");
  }
}
