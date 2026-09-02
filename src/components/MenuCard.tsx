import Link from "next/link";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { MenuItemWithRestaurant } from "@/lib/queries";

export function MenuCard({ item }: { item: MenuItemWithRestaurant }) {
  return (
    <Link
      href={`/r/${item.restaurantSlug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-brand-100 bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-50">
        {item.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.photo}
            alt={item.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={item.name} className="size-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-ink group-hover:text-brand-700">
            {item.name}
          </h3>
          {item.price ? (
            <span className="shrink-0 text-sm font-bold text-brand-600">
              {/^\d+$/.test(item.price) ? `฿${item.price}` : item.price}
            </span>
          ) : null}
        </div>
        <p className="mt-auto text-xs text-muted">🍽️ {item.restaurantName}</p>
      </div>
    </Link>
  );
}
