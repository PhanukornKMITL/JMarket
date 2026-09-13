import { z } from "zod";

/** payload ที่ฟอร์ม admin ส่งเข้ามาบันทึก (ใช้ได้ทั้งฝั่ง client และ server) */
export const menuItemInputSchema = z.object({
  name: z.string().trim().min(1, "กรอกชื่อเมนู"),
  price: z.string().trim().default(""),
  photo: z.string().trim().default(""),
  foodTag: z.string().trim().default(""),
});

export const contactChannelInputSchema = z.object({
  type: z.string().trim().min(1),
  value: z.string().trim().default(""),
  qrImage: z.string().trim().default(""),
  label: z.string().trim().default(""),
});

export const restaurantInputSchema = z.object({
  name: z.string().trim().min(1, "กรอกชื่อร้าน"),
  description: z.string().trim().default(""),
  coverImage: z.string().trim().default(""),
  division: z.string().trim().min(1, "เลือกกองงาน"),
  priceRange: z.string().trim().default(""),
  provinceText: z.string().trim().default(""),
  addressText: z.string().trim().default(""),
  mapUrl: z.string().trim().default(""),
  phones: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  menuItems: z.array(menuItemInputSchema).default([]),
  contactChannels: z.array(contactChannelInputSchema).default([]),
});

export type RestaurantInput = z.infer<typeof restaurantInputSchema>;
export type MenuItemInput = z.infer<typeof menuItemInputSchema>;
export type ContactChannelInput = z.infer<typeof contactChannelInputSchema>;

export const emptyRestaurantInput: RestaurantInput = {
  name: "",
  description: "",
  coverImage: "",
  division: "",
  priceRange: "",
  provinceText: "",
  addressText: "",
  mapUrl: "",
  phones: [],
  status: "draft",
  featured: false,
  sortOrder: 0,
  menuItems: [],
  contactChannels: [],
};
