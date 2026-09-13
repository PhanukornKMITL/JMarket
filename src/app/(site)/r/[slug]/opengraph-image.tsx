import { ImageResponse } from "next/og";

import { getRestaurantBySlug } from "@/lib/queries";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** โหลดฟอนต์ไทยจาก Google Fonts เฉพาะตัวอักษรที่ใช้ (ถ้าล้มเหลวคืน null) */
async function loadThaiFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@700&text=${encodeURIComponent(
      text,
    )}`;
    const css = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const src = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    return await fetch(src).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await getRestaurantBySlug(slug);
  const name = r?.name ?? SITE_NAME;
  const subtitle = r?.provinceText ? `📍 ${r.provinceText}` : "ร้านอาหารเจ";

  const font = await loadThaiFont(`${name}${subtitle}${SITE_NAME}เจร้านอาหาร`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
          color: "white",
          fontFamily: font ? "Noto Sans Thai" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            เจ
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            {name}
          </div>
          <div style={{ fontSize: 34, opacity: 0.9 }}>{subtitle}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Noto Sans Thai", data: font, weight: 700, style: "normal" }]
        : undefined,
    },
  );
}
