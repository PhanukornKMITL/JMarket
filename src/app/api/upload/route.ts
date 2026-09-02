import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST multipart/form-data: field `file` (+ optional `prefix`) → { url } */
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const prefix = (form.get("prefix") as string | null) ?? "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
  }

  try {
    const url = await uploadImage(file, prefix);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ" },
      { status: 400 },
    );
  }
}
