import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * สุ่ม slug สั้น ๆ ใช้ทำ URL /r/… — เป็นอังกฤษ/ตัวเลขล้วนเสมอ
 * (ไม่ derive จากชื่อร้าน เพราะชื่อร้านส่วนใหญ่เป็นภาษาไทย ถ้าเอาไปทำ slug
 * ตรงๆ จะไปชนบั๊ก routing กับ URL ที่มีอักขระไทยได้)
 */
export function randomSlug(): string {
  return `r-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

/** ทำให้ค่า input (อาจเป็น undefined) เป็น array ของ string ที่ไม่ว่าง */
export function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

/** เบอร์โทรสำหรับลิงก์ tel: (ตัดอักขระที่ไม่ใช่ตัวเลข/บวก) */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** ทำให้ URL ปลอดภัยสำหรับ href — เติม https:// ให้ถ้าไม่มี scheme */
export function externalHref(value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(mailto:|tel:)/i.test(v)) return v;
  return `https://${v}`;
}
