import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Container } from "@/components/Container";
import { RestaurantBrowser } from "@/components/RestaurantBrowser";
import { FOOD_TAGS } from "@/lib/constants";
import { getPublishedRestaurantsByDivision } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string }>;
}): Promise<Metadata> {
  const { division } = await params;
  const name = decodeURIComponent(division);
  return {
    title: `กองงาน: ${name}`,
    description: `ร้านค้าในกองงาน ${name}`,
  };
}

export default async function DivisionRestaurantsPage({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const { division } = await params;
  const name = decodeURIComponent(division);
  const restaurants = await getPublishedRestaurantsByDivision(name);
  if (restaurants.length === 0) notFound();

  const usedTags = FOOD_TAGS.filter((t) =>
    restaurants.some((r) => r.foodTags.includes(t)),
  );

  return (
    <Container className="py-10">
      <Link
        href="/divisions"
        className="mb-4 inline-block text-sm text-muted hover:text-brand-700"
      >
        ← กองงานทั้งหมด
      </Link>
      <h1 className="mb-6 text-2xl font-extrabold text-ink">
        ร้านค้ากองงาน: {name}
      </h1>
      <RestaurantBrowser restaurants={restaurants} tags={usedTags} />
    </Container>
  );
}
