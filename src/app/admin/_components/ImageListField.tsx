"use client";

import { useRef, useState } from "react";

import { uploadFile } from "./upload-client";

export function ImageListField({
  label,
  values,
  prefix,
  onChange,
}: {
  label: string;
  values: string[];
  prefix: string;
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadFile(file, prefix));
      }
      onChange([...values, ...uploaded]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>

      {values.length > 0 ? (
        <ul className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {values.map((url, i) => (
            <li
              key={`${url}-${i}`}
              className="overflow-hidden rounded-lg border border-brand-100 bg-brand-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between gap-1 p-1.5 text-xs">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded border border-brand-200 px-1.5 disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === values.length - 1}
                    className="rounded border border-brand-200 px-1.5 disabled:opacity-40"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-red-600 hover:underline"
                >
                  ลบ
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-60"
      >
        {busy ? "กำลังอัปโหลด…" : "+ เพิ่มรูป"}
      </button>
      {err ? <p className="mt-1 text-xs text-red-600">{err}</p> : null}
    </div>
  );
}
