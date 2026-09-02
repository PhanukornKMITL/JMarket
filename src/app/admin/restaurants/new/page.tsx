import { RestaurantForm } from "../../_components/RestaurantForm";
import { emptyRestaurantInput } from "@/lib/restaurant-input";

export const dynamic = "force-dynamic";

export default function NewRestaurantPage() {
  return (
    <RestaurantForm mode="create" id={null} initial={emptyRestaurantInput} />
  );
}
