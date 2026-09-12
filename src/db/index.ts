import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

type DB = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __jmarketClient?: ReturnType<typeof postgres>;
  __jmarketDb?: DB;
};

function getDb(): DB {
  if (globalForDb.__jmarketDb) return globalForDb.__jmarketDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("ไม่พบ DATABASE_URL — ตั้งค่าใน .env หรือบน Vercel");
  }

  const client =
    globalForDb.__jmarketClient ??
    postgres(connectionString, {
      prepare: false, // จำเป็นเมื่อต่อผ่าน Supabase transaction pooler (pgbouncer)
      max: 1,
    });

  const instance = drizzle(client, { schema, casing: "snake_case" });

  // cache เสมอ (ทั้ง dev และ production) — serverless function ที่ยัง warm อยู่
  // จะได้ใช้ connection เดิมซ้ำ แทนที่จะเปิดใหม่ทุก request จนชน connection limit ของ Supabase
  globalForDb.__jmarketClient = client;
  globalForDb.__jmarketDb = instance;
  return instance;
}

// สร้าง client จริงตอนใช้งานครั้งแรกเท่านั้น (ไม่ throw ตอน import → build ผ่านแม้ยังไม่ตั้ง env)
export const db: DB = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
