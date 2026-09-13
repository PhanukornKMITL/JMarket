"use client";

import { useMemo, useState } from "react";

import { FilterBar } from "@/components/FilterBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Restaurant } from "@/db/schema";

export function RestaurantBrowser({ restaurants }: { restaurants: Restaurant[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return restaurants;
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.provinceText ?? "").toLowerCase().includes(q),
    );
  }, [restaurants, query]);

  return (
    <>
      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="ค้นหาชื่อร้าน / จังหวัด"
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
