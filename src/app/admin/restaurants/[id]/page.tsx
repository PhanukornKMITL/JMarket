import { notFound } from "next/navigation";

import { getAllDivisions, getRestaurantForEdit } from "@/lib/queries";
import type { RestaurantInput } from "@/lib/restaurant-input";
import { RestaurantForm } from "../../_components/RestaurantForm";

export const dynamic = "force-dynamic";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [r, divisions] = await Promise.all([
    getRestaurantForEdit(id),
    getAllDivisions(),
  ]);
  if (!r) notFound();

  const initial: RestaurantInput = {
    name: r.name,
    description: r.description ?? "",
    coverImage: r.coverImage ?? "",
    division: r.division,
    priceRange: r.priceRange ?? "",
    provinceText: r.provinceText ?? "",
    addressText: r.addressText ?? "",
    mapUrl: r.mapUrl ?? "",
    phones: r.phones ?? [],
    status: r.status,
    featured: r.featured,
    sortOrder: r.sortOrder,
    menuItems: r.menuItems.map((m) => ({
      name: m.name,
      price: m.price ?? "",
      photo: m.photo ?? "",
      foodTag: m.foodTag ?? "",
    })),
    contactChannels: r.contactChannels.map((c) => ({
      type: c.type,
      value: c.value ?? "",
      qrImage: c.qrImage ?? "",
      label: c.label ?? "",
    })),
  };

  return (
    <RestaurantForm mode="edit" id={r.id} initial={initial} divisions={divisions} />
  );
}
