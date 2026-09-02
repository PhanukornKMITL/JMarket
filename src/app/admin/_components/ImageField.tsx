"use client";

import { useRef, useState } from "react";

import { uploadFile } from "./upload-client";

export function ImageField({
  label,
  value,
  prefix,
  onChange,
}: {
  label: string;
  value: string;
  prefix: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await uploadFile(file, prefix));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <div className="flex items-center gap-3">
        <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-brand-100 bg-brand-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-60"
          >
            {busy ? "กำลังอัปโหลด…" : value ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-red-600 hover:underline"
            >
              ลบรูป
            </button>
          ) : null}
        </div>
      </div>
      {err ? <p className="mt-1 text-xs text-red-600">{err}</p> : null}
    </div>
  );
}
