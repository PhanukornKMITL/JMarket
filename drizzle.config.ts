import { defineConfig } from "drizzle-kit";

// โหลดตัวแปรจาก .env (Node >= 20.12) — เงียบไว้ถ้าไม่มีไฟล์ (เช่นบน CI ที่ตั้ง env ให้แล้ว)
try {
  process.loadEnvFile(".env");
} catch {
  /* ไม่มีไฟล์ .env ก็ไม่เป็นไร */
}

// ใช้ DIRECT_URL (ต่อตรง พอร์ต 5432) สำหรับ migration; fallback เป็น DATABASE_URL
// ปล่อยว่างได้ถ้าแค่รัน `db:generate` (drizzle-kit จะเตือนเองตอน migrate/push ถ้าไม่มีค่า)
const url =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "postgresql://localhost:5432/_";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  casing: "snake_case",
});
