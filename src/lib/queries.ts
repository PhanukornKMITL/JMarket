import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  contactChannels,
  menuItems,
  restaurants,
  type ContactChannel,
  type MenuItem,
  type Restaurant,
} from "@/db/schema";

export type RestaurantWithRelations = Restaurant & {
  menuItems: MenuItem[];
  contactChannels: ContactChannel[];
};

const publishedOrder = [
  desc(restaurants.featured),
  asc(restaurants.sortOrder),
  desc(restaurants.createdAt),
];

/** ร้านที่เผยแพร่แล้วทั้งหมด (สำหรับหน้า /restaurants และหน้าแรก) */
export async function getPublishedRestaurants(): Promise<Restaurant[]> {
  return db
    .select()
    .from(restaurants)
    .where(eq(restaurants.status, "published"))
    .orderBy(...publishedOrder);
}

/** ร้านปักหมุด (สำหรับหน้าแรก) */
export async function getFeaturedRestaurants(limit = 6): Promise<Restaurant[]> {
  return db
    .select()
    .from(restaurants)
    .where(and(eq(restaurants.status, "published"), eq(restaurants.featured, true)))
    .orderBy(asc(restaurants.sortOrder), desc(restaurants.createdAt))
    .limit(limit);
}

/** รายละเอียดร้านตาม slug พร้อมเมนู + ช่องทางติดต่อ */
export async function getRestaurantBySlug(
  slug: string,
): Promise<RestaurantWithRelations | null> {
  const row = await db.query.restaurants.findFirst({
    where: eq(restaurants.slug, slug),
  });
  if (!row || row.status !== "published") return null;

  const [items, channels] = await Promise.all([
    db
      .select()
      .from(menuItems)
      .where(eq(menuItems.restaurantId, row.id))
      .orderBy(desc(menuItems.recommended), asc(menuItems.sortOrder)),
    db
      .select()
      .from(contactChannels)
      .where(eq(contactChannels.restaurantId, row.id))
      .orderBy(asc(contactChannels.sortOrder)),
  ]);

  return { ...row, menuItems: items, contactChannels: channels };
}

export type MenuItemWithRestaurant = MenuItem & {
  restaurantName: string;
  restaurantSlug: string;
  restaurantTags: string[];
};

/** เมนูแนะนำจากทุกร้าน (สำหรับหน้า /menu) */
export async function getRecommendedMenuItems(): Promise<MenuItemWithRestaurant[]> {
  const rows = await db
    .select({
      item: menuItems,
      name: restaurants.name,
      slug: restaurants.slug,
      tags: restaurants.foodTags,
    })
    .from(menuItems)
    .innerJoin(restaurants, eq(menuItems.restaurantId, restaurants.id))
    .where(and(eq(menuItems.recommended, true), eq(restaurants.status, "published")))
    .orderBy(asc(restaurants.sortOrder), asc(menuItems.sortOrder));

  return rows.map((r) => ({
    ...r.item,
    restaurantName: r.name,
    restaurantSlug: r.slug,
    restaurantTags: r.tags ?? [],
  }));
}

/** ── ฝั่ง admin (ไม่กรอง status) ────────────────────────────── */

/** ร้านทั้งหมดสำหรับตารางหน้า admin */
export async function getAllRestaurantsForAdmin(): Promise<Restaurant[]> {
  return db
    .select()
    .from(restaurants)
    .orderBy(
      desc(restaurants.featured),
      asc(restaurants.sortOrder),
      desc(restaurants.createdAt),
    );
}

/** ร้าน 1 ร้านตาม id พร้อมเมนู + ช่องทางติดต่อ (แก้ไขในหน้า admin) */
export async function getRestaurantForEdit(
  id: string,
): Promise<RestaurantWithRelations | null> {
  const row = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, id),
  });
  if (!row) return null;

  const [items, channels] = await Promise.all([
    db
      .select()
      .from(menuItems)
      .where(eq(menuItems.restaurantId, row.id))
      .orderBy(asc(menuItems.sortOrder)),
    db
      .select()
      .from(contactChannels)
      .where(eq(contactChannels.restaurantId, row.id))
      .orderBy(asc(contactChannels.sortOrder)),
  ]);

  return { ...row, menuItems: items, contactChannels: channels };
}

/** slug ทั้งหมดของร้านที่เผยแพร่ (สำหรับ generateStaticParams ถ้าต้องใช้) */
export async function getPublishedSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: restaurants.slug })
    .from(restaurants)
    .where(eq(restaurants.status, "published"));
  return rows.map((r) => r.slug);
}
