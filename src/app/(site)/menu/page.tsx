import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { MenuBrowser } from "@/components/MenuBrowser";
import { FOOD_TAGS } from "@/lib/constants";
import { getAllMenuItems } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "เมนูทั้งหมด",
  description: "เมนูจากร้านอาหารเจทุกร้าน",
};

export default async function MenuPage() {
  const items = await getAllMenuItems();
  const usedTags = FOOD_TAGS.filter((t) =>
    items.some((it) => it.foodTag === t),
  );

  return (
    <Container className="py-10">
      <h1 className="mb-1 text-2xl font-extrabold text-ink">เมนูทั้งหมด</h1>
      <p className="mb-6 text-sm text-muted">
        เมนูจากทุกร้าน — กดที่การ์ดเพื่อดูรายละเอียดร้าน
      </p>
      <MenuBrowser items={items} tags={usedTags} />
    </Container>
  );
}
