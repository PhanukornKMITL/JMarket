"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { Restaurant } from "@/db/schema";
import { toggleFeatured, togglePublish } from "../actions";
import { DeleteButton } from "./DeleteButton";

type SortDir = "asc" | "desc" | null;

export function AdminRestaurantsTable({ rows }: { rows: Restaurant[] }) {
  const [divisionFilter, setDivisionFilter] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const divisions = useMemo(
    () => [...new Set(rows.map((r) => r.division))].sort((a, b) => a.localeCompare(b, "th")),
    [rows],
  );

  const visibleRows = useMemo(() => {
    const filtered = divisionFilter
      ? rows.filter((r) => r.division === divisionFilter)
      : rows;
    if (!sortDir) return filtered;
    const sorted = [...filtered].sort((a, b) => a.division.localeCompare(b.division, "th"));
    return sortDir === "desc" ? sorted.reverse() : sorted;
  }, [rows, divisionFilter, sortDir]);

  function toggleSort() {
    setSortDir((d) => (d === null ? "asc" : d === "asc" ? "desc" : null));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted">กรองกองงาน:</label>
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className="rounded-lg border border-brand-200 bg-surface px-3 py-1.5 text-sm"
        >
          <option value="">ทั้งหมด</option>
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted">แสดง {visibleRows.length} จาก {rows.length} ร้าน</span>
      </div>

      <div className="overflow-x-auto rounded-card border border-brand-100 bg-surface">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-brand-50 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">ร้าน</th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  onClick={toggleSort}
                  className="flex items-center gap-1 uppercase text-muted hover:text-brand-700"
                >
                  กองงาน
                  <span>{sortDir === "asc" ? "▲" : sortDir === "desc" ? "▼" : "↕"}</span>
                </button>
              </th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">แนะนำ</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {visibleRows.map((r) => (
              <tr key={r.id} className="align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                      {r.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.coverImage}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <ImagePlaceholder
                          label={r.name}
                          className="size-full text-base"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{r.name}</p>
                      <p className="truncate text-xs text-muted">/r/{r.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700">
                    {r.division}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={togglePublish}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value={r.status} />
                    <button
                      type="submit"
                      className={
                        r.status === "published"
                          ? "rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700"
                          : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500"
                      }
                    >
                      {r.status === "published" ? "เผยแพร่" : "ร่าง"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={toggleFeatured}>
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      type="hidden"
                      name="featured"
                      value={String(r.featured)}
                    />
                    <button
                      type="submit"
                      title="สลับปักหมุด"
                      className={
                        r.featured ? "text-lg text-brand-500" : "text-lg text-gray-300"
                      }
                    >
                      ★
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/restaurants/${r.id}`}
                      className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
                    >
                      แก้ไข
                    </Link>
                    <DeleteButton id={r.id} name={r.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
