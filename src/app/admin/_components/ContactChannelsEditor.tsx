"use client";

import { CONTACT_TYPES } from "@/lib/constants";
import type { ContactChannelInput } from "@/lib/restaurant-input";
import { ImageField } from "./ImageField";

const EMPTY: ContactChannelInput = {
  type: "LINE",
  value: "",
  qrImage: "",
  label: "",
};

export function ContactChannelsEditor({
  channels,
  onChange,
}: {
  channels: ContactChannelInput[];
  onChange: (channels: ContactChannelInput[]) => void;
}) {
  function update(i: number, patch: Partial<ContactChannelInput>) {
    onChange(channels.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= channels.length) return;
    const next = [...channels];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function remove(i: number) {
    onChange(channels.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      {channels.map((c, i) => (
        <div
          key={i}
          className="rounded-xl border border-brand-100 bg-brand-50/40 p-3"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={c.type}
                  onChange={(e) => update(i, { type: e.target.value })}
                  className="rounded-lg border border-brand-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400"
                >
                  {CONTACT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  value={c.label}
                  onChange={(e) => update(i, { label: e.target.value })}
                  placeholder="ป้ายกำกับ เช่น LINE OA สั่งอาหาร"
                  className="w-full rounded-lg border border-brand-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
              </div>
              <input
                value={c.value}
                onChange={(e) => update(i, { value: e.target.value })}
                placeholder="ลิงก์ หรือ ID เช่น https://lin.ee/xxxx หรือ @jaishop"
                className="w-full rounded-lg border border-brand-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
            <ImageField
              label="รูป QR"
              value={c.qrImage}
              prefix="qr"
              onChange={(url) => update(i, { qrImage: url })}
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
              disabled={i === channels.length - 1}
              className="rounded border border-brand-200 px-2 py-1 disabled:opacity-40"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="ml-auto text-red-600 hover:underline"
            >
              ลบช่องทางนี้
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...channels, { ...EMPTY }])}
        className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
      >
        + เพิ่มช่องทางติดต่อ
      </button>
    </div>
  );
}
