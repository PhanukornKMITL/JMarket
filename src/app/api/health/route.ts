import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";

export const dynamic = "force-dynamic";

/**
 * ใช้เป็นเป้าหมายของ GitHub Actions cron (กัน Supabase หลับ)
 * และเช็คว่าเว็บ + ฐานข้อมูลยังทำงานอยู่
 */
export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
