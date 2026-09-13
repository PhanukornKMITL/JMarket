import Link from "next/link";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { Restaurant } from "@/db/schema";

export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/r/${r.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-brand-100 bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        {r.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.coverImage}
            alt={r.name}
            loading="lazy"
            className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={r.name} className="size-full" />
        )}
        {r.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
            ★ แนะนำ
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-snug text-ink group-hover:text-brand-700">
            {r.name}
          </h3>
          {r.priceRange ? (
            <span className="shrink-0 text-sm font-semibold text-brand-600">
              {r.priceRange}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {r.provinceText ? (
            <span className="text-xs text-muted">📍 {r.provinceText}</span>
          ) : null}
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
            {r.division}
          </span>
        </div>
      </div>
    </Link>
  );
}
