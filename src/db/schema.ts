import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** ร้านอาหารเจ 1 ร้าน */
export const restaurants = pgTable("restaurants", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"), // รายละเอียดร้าน (ย่อหน้ายาว)
  coverImage: text("cover_image"), // URL รูปหน้าปก
  division: text("division").notNull().default("ไม่ระบุ"), // กองงาน/สังกัดของร้าน
  priceRange: text("price_range"), // '฿' | '฿฿' | '฿฿฿'
  provinceText: text("province_text"),
  addressText: text("address_text"),
  mapUrl: text("map_url"),
  phones: jsonb("phones").$type<string[]>().notNull().default([]),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** รายการเมนูของร้าน */
export const menuItems = pgTable("menu_items", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: text("price"), // เก็บเป็นข้อความ เช่น "60", "60-90", "ตามสั่ง"
  photo: text("photo"),
  foodTag: text("food_tag"), // หมวดอาหารของเมนูนี้ (ขนม / อาหารสด-แห้ง / อาหารแช่แข็ง)
  sortOrder: integer("sort_order").notNull().default(0),
});

/** ช่องทางติดต่อของร้าน (LINE / Facebook / ...) */
export const contactChannels = pgTable("contact_channels", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'LINE' | 'Facebook' | 'Instagram' | 'TikTok' | 'website' | 'อื่นๆ'
  value: text("value"), // ลิงก์ หรือ ID
  qrImage: text("qr_image"), // URL รูป QR (ถ้ามี)
  label: text("label"), // ป้ายกำกับ เช่น "LINE OA สั่งอาหาร"
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
export type ContactChannel = typeof contactChannels.$inferSelect;
export type NewContactChannel = typeof contactChannels.$inferInsert;
