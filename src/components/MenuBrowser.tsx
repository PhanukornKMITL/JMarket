"use client";

import { useMemo, useState } from "react";

import { FilterBar } from "@/components/FilterBar";
import { MenuCard } from "@/components/MenuCard";
import type { MenuItemWithRestaurant } from "@/lib/queries";

export function MenuBrowser({
  items,
  tags,
}: {
  items: MenuItemWithRestaurant[];
  tags: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchQ =
        !q ||
        it.name.toLowerCase().includes(q) ||
        it.restaurantName.toLowerCase().includes(q);
      const matchTags =
        activeTags.length === 0 ||
        (it.foodTag != null && activeTags.includes(it.foodTag));
      return matchQ && matchTags;
    });
  }, [items, query, activeTags]);

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
        placeholder="ค้นหาชื่อเมนู / ชื่อร้าน"
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">ไม่พบเมนูที่ตรงกับเงื่อนไข</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((it) => (
            <MenuCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </>
  );
}
