import { jwtVerify, SignJWT } from "jose";

// edge-safe: ใช้ jose อย่างเดียว (ไม่มี node:crypto) — import ได้จาก middleware

const SECRET = process.env.AUTH_SECRET;

function key(): Uint8Array {
  if (!SECRET || SECRET.length < 16) {
    throw new Error("AUTH_SECRET ไม่ถูกตั้งค่า หรือสั้นเกินไป (อย่างน้อย 16 ตัวอักษร)");
  }
  return new TextEncoder().encode(SECRET);
}

export type SessionPayload = { role: "admin" };

export async function signSession(
  payload: SessionPayload,
  maxAgeSeconds = 60 * 60 * 24 * 7,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .sign(key());
}

export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    if (payload.role === "admin") return { role: "admin" };
    return null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "jm_session";
