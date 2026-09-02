#!/usr/bin/env node
// สร้าง hash รหัสผ่าน admin สำหรับใส่ใน ADMIN_PASSWORD_HASH
// ใช้:  npm run hash -- 'รหัสผ่านที่ต้องการ'
//  หรือ node scripts/hash-password.mjs 'รหัสผ่าน'

import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error("ใช้:  npm run hash -- 'รหัสผ่านที่ต้องการ'");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32);
const value = `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;

console.log("\nคัดลอกบรรทัดนี้ไปใส่ .env.local และบน Vercel:\n");
console.log(`ADMIN_PASSWORD_HASH="${value}"\n`);
