import { RestaurantForm } from "../../_components/RestaurantForm";
import { emptyRestaurantInput } from "@/lib/restaurant-input";
import { getAllDivisions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewRestaurantPage() {
  const divisions = await getAllDivisions();
  return (
    <RestaurantForm
      mode="create"
      id={null}
      initial={emptyRestaurantInput}
      divisions={divisions}
    />
  );
}
