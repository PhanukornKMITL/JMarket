"use client";

import { cn } from "@/lib/utils";

export function FilterBar({
  query,
  onQuery,
  tags = [],
  activeTags = [],
  onToggleTag,
  placeholder = "ค้นหา…",
  resultCount,
}: {
  query: string;
  onQuery: (v: string) => void;
  tags?: string[];
  activeTags?: string[];
  onToggleTag?: (tag: string) => void;
  placeholder?: string;
  resultCount: number;
}) {
  return (
    <div className="mb-6 space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-brand-200 bg-surface px-5 py-3 text-sm shadow-sm outline-none focus:border-brand-400"
      />

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag?.(tag)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-brand-200 bg-surface text-muted hover:border-brand-400 hover:text-brand-700",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="text-xs text-muted">พบ {resultCount} รายการ</p>
    </div>
  );
}
