export const FOOD_TAGS = [
  "ตามสั่ง",
  "ก๋วยเตี๋ยว",
  "ข้าวราดแกง",
  "บุฟเฟต์",
  "ขนม-เครื่องดื่ม",
  "อาหารตามเทศกาล",
  "อื่นๆ",
] as const;
export type FoodTag = (typeof FOOD_TAGS)[number];

export const PRICE_RANGES = ["฿", "฿฿", "฿฿฿"] as const;
export type PriceRange = (typeof PRICE_RANGES)[number];

export const CONTACT_TYPES = [
  "LINE",
  "Facebook",
  "Instagram",
  "TikTok",
  "website",
  "อื่นๆ",
] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

export const SITE_NAME = "JMarket";
export const SITE_TAGLINE = "รวมร้านอาหารเจ ใกล้คุณ";
export const SITE_DESCRIPTION =
  "แหล่งรวมร้านอาหารเจทั่วไทย ดูเมนู รูปภาพ และช่องทางติดต่อร้านโดยตรง";

export function siteUrl(path = ""): string {
  const base =
    process.env.SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
