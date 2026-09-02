"use client";

import { useMemo, useState } from "react";

import { FilterBar } from "@/components/FilterBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Restaurant } from "@/db/schema";

export function RestaurantBrowser({
  restaurants,
  tags,
}: {
  restaurants: Restaurant[];
  tags: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.tagline ?? "").toLowerCase().includes(q) ||
        (r.provinceText ?? "").toLowerCase().includes(q);
      const matchTags =
        activeTags.length === 0 ||
        activeTags.every((t) => r.foodTags.includes(t));
      return matchQ && matchTags;
    });
  }, [restaurants, query, activeTags]);

  return (
    <>
      <FilterBar
        query={query}
        onQuery={setQuery}
        tags={tags}
        activeTags={activeTags}
        onToggleTag={(tag) =>
          setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
          )
        }
        placeholder="ค้นหาชื่อร้าน / คำโปรย / จังหวัด"
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">ไม่พบร้านที่ตรงกับเงื่อนไข</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </>
  );
}
