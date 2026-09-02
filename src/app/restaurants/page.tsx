import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { RestaurantBrowser } from "@/components/RestaurantBrowser";
import { FOOD_TAGS } from "@/lib/constants";
import { getPublishedRestaurants } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ร้านค้าทั้งหมด",
  description: "รายชื่อร้านอาหารเจทั้งหมดในระบบ",
};

export default async function RestaurantsPage() {
  const restaurants = await getPublishedRestaurants();
  const usedTags = FOOD_TAGS.filter((t) =>
    restaurants.some((r) => r.foodTags.includes(t)),
  );

  return (
    <Container className="py-10">
      <h1 className="mb-6 text-2xl font-extrabold text-ink">ร้านค้าทั้งหมด</h1>
      <RestaurantBrowser restaurants={restaurants} tags={usedTags} />
    </Container>
  );
}
