"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { contactChannels, menuItems, restaurants } from "@/db/schema";
import { destroySession, requireAdmin } from "@/lib/auth";
import { deleteImageByUrl } from "@/lib/storage";
import {
  restaurantInputSchema,
  type RestaurantInput,
} from "@/lib/restaurant-input";
import { randomSlug } from "@/lib/utils";

function orNull(v: string | undefined | null): string | null {
  const t = (v ?? "").trim();
  return t.length ? t : null;
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

/** สุ่ม slug ใหม่ที่ยังไม่มีร้านอื่นใช้ */
async function uniqueSlug(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const candidate = randomSlug();
    const clash = await db.query.restaurants.findFirst({
      where: eq(restaurants.slug, candidate),
      columns: { id: true },
    });
    if (!clash) return candidate;
  }
  return `r-${randomUUID().slice(0, 8)}`;
}

/** เก็บ URL รูปทั้งหมดของร้าน (ไว้ลบตอนลบร้าน) */
function collectImageUrls(row: {
  coverImage: string | null;
  gallery: string[];
  menuBoardImages: string[];
}): string[] {
  return [row.coverImage ?? "", ...row.gallery, ...row.menuBoardImages].filter(
    Boolean,
  );
}

export async function saveRestaurant(
  id: string | null,
  raw: RestaurantInput,
): Promise<{ ok: false; error: string } | never> {
  await requireAdmin();

  const parsed = restaurantInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }
  const input = parsed.data;

  const base = {
    name: input.name,
    description: orNull(input.description),
    coverImage: orNull(input.coverImage),
    gallery: input.gallery.filter(Boolean),
    menuBoardImages: input.menuBoardImages.filter(Boolean),
    division: input.division,
    priceRange: orNull(input.priceRange),
    provinceText: orNull(input.provinceText),
    addressText: orNull(input.addressText),
    mapUrl: orNull(input.mapUrl),
    phones: input.phones.filter(Boolean),
    status: input.status,
    featured: input.featured,
    sortOrder: input.sortOrder,
  };

  let restaurantId = id;

  if (id) {
    await db
      .update(restaurants)
      .set({ ...base, updatedAt: new Date() })
      .where(eq(restaurants.id, id));
    await db.delete(menuItems).where(eq(menuItems.restaurantId, id));
    await db.delete(contactChannels).where(eq(contactChannels.restaurantId, id));
  } else {
    const slug = await uniqueSlug();
    const [created] = await db
      .insert(restaurants)
      .values({ ...base, slug })
      .returning({ id: restaurants.id });
    restaurantId = created.id;
  }

  if (input.menuItems.length > 0) {
    await db.insert(menuItems).values(
      input.menuItems.map((m, i) => ({
        restaurantId: restaurantId!,
        name: m.name,
        price: orNull(m.price),
        photo: orNull(m.photo),
        foodTag: orNull(m.foodTag),
        sortOrder: i,
      })),
    );
  }

  if (input.contactChannels.length > 0) {
    await db.insert(contactChannels).values(
      input.contactChannels.map((c, i) => ({
        restaurantId: restaurantId!,
        type: c.type,
        value: orNull(c.value),
        qrImage: orNull(c.qrImage),
        label: orNull(c.label),
        sortOrder: i,
      })),
    );
  }

  revalidateAll();
  redirect("/admin");
}

export async function deleteRestaurant(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const row = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, id),
    columns: { coverImage: true, gallery: true, menuBoardImages: true },
  });
  const items = await db
    .select({ photo: menuItems.photo })
    .from(menuItems)
    .where(eq(menuItems.restaurantId, id));
  const channels = await db
    .select({ qrImage: contactChannels.qrImage })
    .from(contactChannels)
    .where(eq(contactChannels.restaurantId, id));

  await db.delete(restaurants).where(eq(restaurants.id, id));

  const urls = [
    ...(row ? collectImageUrls(row) : []),
    ...items.map((i) => i.photo ?? ""),
    ...channels.map((c) => c.qrImage ?? ""),
  ].filter(Boolean);
  await Promise.allSettled(urls.map((u) => deleteImageByUrl(u)));

  revalidateAll();
}

export async function togglePublish(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const current = String(formData.get("status") ?? "draft");
  if (!id) return;
  await db
    .update(restaurants)
    .set({
      status: current === "published" ? "draft" : "published",
      updatedAt: new Date(),
    })
    .where(eq(restaurants.id, id));
  revalidateAll();
}

export async function toggleFeatured(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const current = String(formData.get("featured") ?? "false") === "true";
  if (!id) return;
  await db
    .update(restaurants)
    .set({ featured: !current, updatedAt: new Date() })
    .where(eq(restaurants.id, id));
  revalidateAll();
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
