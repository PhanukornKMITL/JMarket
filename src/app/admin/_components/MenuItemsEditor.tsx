"use client";

import { FOOD_TAGS } from "@/lib/constants";
import type { MenuItemInput } from "@/lib/restaurant-input";
import { ImageField } from "./ImageField";

const EMPTY: MenuItemInput = {
  name: "",
  price: "",
  photo: "",
  foodTag: "",
};

export function MenuItemsEditor({
  items,
  onChange,
}: {
  items: MenuItemInput[];
  onChange: (items: MenuItemInput[]) => void;
}) {
  function update(i: number, patch: Partial<MenuItemInput>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-xl border border-brand-100 bg-brand-50/40 p-3"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2">
              <input
                value={it.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="ชื่อเมนู *"
                className="w-full rounded-lg border border-brand-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <input
                value={it.price}
                onChange={(e) => update(i, { price: e.target.value })}
                placeholder='ราคา เช่น "60" หรือ "60-90"'
                className="w-full rounded-lg border border-brand-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <select
                value={it.foodTag}
                onChange={(e) => update(i, { foodTag: e.target.value })}
                className="w-full rounded-lg border border-brand-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400"
              >
                <option value="">— ไม่ระบุแท็ก —</option>
                {FOOD_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <ImageField
              label="รูปเมนู"
              value={it.photo}
              prefix="menu"
              onChange={(url) => update(i, { photo: url })}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="rounded border border-brand-200 px-2 py-1 disabled:opacity-40"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              className="rounded border border-brand-200 px-2 py-1 disabled:opacity-40"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="ml-auto text-red-600 hover:underline"
            >
              ลบเมนูนี้
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, { ...EMPTY }])}
        className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
      >
        + เพิ่มเมนู
      </button>
    </div>
  );
}
