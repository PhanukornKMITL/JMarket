import "server-only";

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "restaurant-images";

function getClient() {
  if (!url || !serviceKey) {
    throw new Error(
      "ตั้งค่า SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ก่อนอัปโหลดรูป",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 6 * 1024 * 1024; // 6MB

function extFor(type: string): string {
  return (
    { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }[
      type
    ] ?? "bin"
  );
}

/** อัปโหลดรูปขึ้น Supabase Storage แล้วคืน public URL */
export async function uploadImage(file: File, prefix = "misc"): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error("รองรับเฉพาะไฟล์รูป JPG / PNG / WEBP / GIF");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("ไฟล์ใหญ่เกิน 6MB");
  }

  const supabase = getClient();
  const safePrefix = prefix.replace(/[^a-z0-9/_-]/gi, "") || "misc";
  const path = `${safePrefix}/${crypto.randomUUID()}.${extFor(file.type)}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`อัปโหลดไม่สำเร็จ: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** ลบรูปจาก URL แบบ best-effort (ไม่ throw ถ้าลบไม่ได้) */
export async function deleteImageByUrl(publicUrl: string | null | undefined): Promise<void> {
  if (!publicUrl) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(publicUrl.slice(idx + marker.length));
  try {
    await getClient().storage.from(BUCKET).remove([path]);
  } catch {
    // เงียบไว้ — ปล่อยให้ไฟล์ค้างดีกว่าทำ request ล้ม
  }
}
