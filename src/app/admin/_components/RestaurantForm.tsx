"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import type { RestaurantInput } from "@/lib/restaurant-input";
import { saveRestaurant } from "../actions";
import { ContactChannelsEditor } from "./ContactChannelsEditor";
import { ImageField } from "./ImageField";
import { MenuItemsEditor } from "./MenuItemsEditor";

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border border-brand-100 bg-surface p-5">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {desc ? <p className="mb-3 mt-0.5 text-sm text-muted">{desc}</p> : <div className="mb-3" />}
      {children}
    </section>
  );
}

const inputCls =
  "w-full rounded-lg border border-brand-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400";

export function RestaurantForm({
  mode,
  id,
  initial,
  divisions,
}: {
  mode: "create" | "edit";
  id: string | null;
  initial: RestaurantInput;
  divisions: string[];
}) {
  const [form, setForm] = useState<RestaurantInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [divisionCustom, setDivisionCustom] = useState(
    () => initial.division !== "" && !divisions.includes(initial.division),
  );
  const NEW_DIVISION = "__new__";

  function set<K extends keyof RestaurantInput>(key: K, value: RestaurantInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(status: "draft" | "published") {
    setError(null);
    if (!form.name.trim()) {
      setError("กรอกชื่อร้าน");
      return;
    }
    if (!form.division.trim()) {
      setError("เลือกหรือกรอกกองงาน");
      return;
    }
    const payload: RestaurantInput = {
      ...form,
      status,
      phones: form.phones.map((p) => p.trim()).filter(Boolean),
    };
    startTransition(async () => {
      const res = await saveRestaurant(id, payload);
      if (res && !res.ok) setError(res.error);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">
          {mode === "create" ? "เพิ่มร้านใหม่" : "แก้ไขร้าน"}
        </h1>
        <Link href="/admin" className="text-sm text-muted hover:text-brand-700">
          ← กลับ
        </Link>
      </div>

      {/* ข้อมูลหลัก */}
      <Section title="ข้อมูลหลัก">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              ชื่อร้าน *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
              placeholder="เช่น ครัวเจบ้านสวน"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              กองงาน *
            </label>
            {divisionCustom ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={form.division}
                  onChange={(e) => set("division", e.target.value)}
                  className={inputCls}
                  placeholder="พิมพ์ชื่อกองงานใหม่"
                />
                <button
                  type="button"
                  onClick={() => {
                    setDivisionCustom(false);
                    set("division", "");
                  }}
                  className="shrink-0 rounded-lg border border-brand-200 px-3 text-xs text-muted hover:bg-brand-50"
                >
                  เลือกจากรายการ
                </button>
              </div>
            ) : (
              <select
                value={form.division}
                onChange={(e) => {
                  if (e.target.value === NEW_DIVISION) {
                    setDivisionCustom(true);
                    set("division", "");
                  } else {
                    set("division", e.target.value);
                  }
                }}
                className={inputCls}
              >
                <option value="">— เลือกกองงาน —</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value={NEW_DIVISION}>+ เพิ่มกองงานใหม่</option>
              </select>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              รายละเอียดร้าน
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={inputCls}
              placeholder="เล่าเรื่องร้าน จุดเด่น เมนูซิกเนเจอร์ ฯลฯ"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              ปักหมุด (ขึ้นหน้าแรก)
            </label>
          </div>
        </div>
      </Section>

      {/* รูป */}
      <Section title="รูปภาพ">
        <ImageField
          label="รูปหน้าปก"
          value={form.coverImage}
          prefix="cover"
          onChange={(url) => set("coverImage", url)}
        />
      </Section>

      {/* ทำเล */}
      <Section title="ทำเล / ที่อยู่" desc="ไม่บังคับ — ใส่เท่าที่มี">
        <div className="space-y-3">
          <input
            value={form.provinceText}
            onChange={(e) => set("provinceText", e.target.value)}
            className={inputCls}
            placeholder="จังหวัด เช่น เชียงใหม่"
          />
          <textarea
            value={form.addressText}
            onChange={(e) => set("addressText", e.target.value)}
            rows={2}
            className={inputCls}
            placeholder="ที่อยู่เต็ม"
          />
          <input
            value={form.mapUrl}
            onChange={(e) => set("mapUrl", e.target.value)}
            className={inputCls}
            placeholder="ลิงก์ Google Maps"
          />
        </div>
      </Section>

      {/* ติดต่อ */}
      <Section
        title="ช่องทางติดต่อ"
        desc="หัวใจของหน้าร้าน — ใส่เบอร์โทรและช่องทางแชท"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              เบอร์โทร
            </label>
            <div className="space-y-2">
              {form.phones.map((phone, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={phone}
                    onChange={(e) =>
                      set(
                        "phones",
                        form.phones.map((p, idx) =>
                          idx === i ? e.target.value : p,
                        ),
                      )
                    }
                    className={inputCls}
                    placeholder="08x-xxx-xxxx"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "phones",
                        form.phones.filter((_, idx) => idx !== i),
                      )
                    }
                    className="shrink-0 rounded-lg border border-red-200 px-3 text-xs text-red-600 hover:bg-red-50"
                  >
                    ลบ
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("phones", [...form.phones, ""])}
                className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                + เพิ่มเบอร์
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              ช่องทางอื่น (LINE / Facebook / …)
            </label>
            <ContactChannelsEditor
              channels={form.contactChannels}
              onChange={(channels) => set("contactChannels", channels)}
            />
          </div>
        </div>
      </Section>

      {/* เมนู */}
      <Section
        title="เมนู"
        desc="ใส่รายการเมนู หรือจะข้ามไปแปะ ‘รูปบอร์ดเมนู’ ด้านบนก็ได้"
      >
        <MenuItemsEditor
          items={form.menuItems}
          onChange={(items) => set("menuItems", items)}
        />
      </Section>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-full border border-brand-100 bg-surface/95 p-2 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => submit("published")}
          disabled={pending}
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "กำลังบันทึก…" : "บันทึกและเผยแพร่"}
        </button>
        <button
          type="button"
          onClick={() => submit("draft")}
          disabled={pending}
          className="rounded-full border border-brand-200 px-6 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-60"
        >
          {pending ? "กำลังบันทึก…" : "บันทึกแบบร่าง"}
        </button>
        <Link
          href="/admin"
          className="rounded-full px-4 py-2.5 text-sm text-muted hover:text-brand-700"
        >
          ยกเลิก
        </Link>
      </div>
    </div>
  );
}
