# JMarket

เว็บประชาสัมพันธ์ร้านอาหารเจแนว community — แสดงรายการร้าน เมนู รูปภาพ และช่องทางติดต่อ
ลูกค้าติดต่อร้านเอง **ไม่มีตะกร้า ไม่มีการชำระเงิน**

## เทคโนโลยี

| ส่วน | ใช้ |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (โทนเขียว) · ฟอนต์ Noto Sans Thai |
| Database | PostgreSQL (Supabase) + Drizzle ORM |
| เก็บรูป | Supabase Storage |
| Auth admin | รหัสผ่านเดียวใน env + session cookie (jose) |
| Deploy | Vercel + Supabase (ใช้ URL `*.vercel.app`) |
| สถิติ | Vercel Web Analytics |

---

## เริ่มใช้งานในเครื่อง (local)

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. เตรียม Supabase

1. สร้างโปรเจคที่ <https://supabase.com> (free)
2. **Database** → Project Settings → Database → คัดลอก connection string
   - *Transaction pooler* (พอร์ต 6543) → ใส่ใน `DATABASE_URL` (เติม `?pgbouncer=true`)
   - *Direct connection* (พอร์ต 5432) → ใส่ใน `DIRECT_URL`
3. **Storage** → สร้าง bucket ชื่อ `restaurant-images` และตั้งเป็น **Public**
4. **API** → Project Settings → API → คัดลอก `Project URL` และ `service_role` key

### 3. ตั้งค่า env

```bash
cp .env.example .env
```

แก้ค่าในไฟล์ `.env` ให้ครบ จากนั้นสร้าง hash รหัสผ่าน admin:

```bash
npm run hash -- 'รหัสผ่านที่ต้องการ'
```

นำบรรทัด `ADMIN_PASSWORD_HASH="..."` ที่ได้ไปใส่ใน `.env`
และตั้ง `AUTH_SECRET` เป็นค่าสุ่มยาว ๆ เช่น `openssl rand -base64 48`

### 4. สร้างตารางในฐานข้อมูล

```bash
npm run db:generate   # สร้างไฟล์ migration จาก schema
npm run db:migrate    # รัน migration ขึ้น Supabase
```

> หรือใช้ `npm run db:push` เพื่อ sync schema ตรง ๆ โดยไม่สร้างไฟล์ migration (เหมาะตอน dev)

### 5. (ไม่บังคับ) ใส่ข้อมูลตัวอย่าง 3 ร้าน

```bash
npm run db:seed
```

### 6. รัน dev server

```bash
npm run dev
```

- เว็บสาธารณะ: <http://localhost:3000>
- หน้า admin: <http://localhost:3000/admin> (ใส่รหัสผ่านที่ตั้งไว้)

---

## โครงหน้าเว็บ

| URL | หน้า |
|---|---|
| `/` | Landing — ร้านแนะนำ + เมนูแนะนำ |
| `/restaurants` | ร้านค้าทั้งหมด + ค้นหา/กรองแท็ก |
| `/menu` | เมนูแนะนำจากทุกร้าน |
| `/r/[slug]` | รายละเอียดร้าน (เมนู รูป ช่องทางติดต่อ) |
| `/admin` | จัดการร้าน (ต้องล็อกอิน) |

---

## Deploy บน Vercel

1. push repo นี้ขึ้น GitHub แล้ว import เข้า Vercel
2. ใส่ Environment Variables ทั้งหมดจาก `.env` (ตั้ง `SITE_URL`
   เป็น URL จริงของ Vercel เช่น `https://jmarket-xxx.vercel.app`)
3. Deploy — Vercel รัน `npm run build` ให้อัตโนมัติ
4. รัน migration ครั้งแรกจากเครื่อง (ชี้ `DIRECT_URL` ไปที่ Supabase เดียวกัน):
   ```bash
   npm run db:migrate
   ```

### กัน Supabase หลับ (free tier หยุดโปรเจคเมื่อไม่มี request 7 วัน)

ไฟล์ `.github/workflows/keepalive.yml` จะยิง `/api/health` ทุก 3 วัน
เปิดใช้โดยตั้ง **repo variable** ชื่อ `SITE_URL` (Settings → Secrets and variables → Actions → Variables)
ให้เท่ากับ URL ของเว็บ เช่น `https://jmarket-xxx.vercel.app`

---

## คำสั่งที่ใช้บ่อย

```bash
npm run dev            # dev server
npm run build          # build production
npm run db:generate    # สร้าง migration จาก schema
npm run db:migrate     # รัน migration
npm run db:push        # sync schema ตรง ๆ (dev)
npm run db:seed        # ใส่ข้อมูลตัวอย่าง
npm run hash -- 'pw'   # สร้าง hash รหัสผ่าน admin
```
