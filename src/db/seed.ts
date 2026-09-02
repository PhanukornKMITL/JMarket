/**
 * ข้อมูลตัวอย่าง — รัน:  npm run db:seed
 * ต้องตั้งค่า DATABASE_URL ใน .env.local ก่อน (โหลดผ่าน --env-file)
 */
import { db } from "./index";
import { contactChannels, menuItems, restaurants } from "./schema";

async function main() {
  console.log("กำลังล้างข้อมูลเดิม…");
  await db.delete(contactChannels);
  await db.delete(menuItems);
  await db.delete(restaurants);

  const seed = [
    {
      name: "ครัวเจบ้านสวน",
      slug: "krua-jae-baan-suan",
      tagline: "อาหารเจโฮมเมด วัตถุดิบสดใหม่ทุกวัน",
      description:
        "ร้านอาหารเจเล็ก ๆ บรรยากาศสวน ทำสด ๆ ทุกจาน ไม่ใช้ผงชูรส\nเปิดมากว่า 8 ปี ลูกค้าประจำเยอะ",
      foodTags: ["ตามสั่ง", "ข้าวราดแกง"],
      priceRange: "฿",
      provinceText: "เชียงใหม่",
      addressText: "123 ถ.สุเทพ ต.สุเทพ อ.เมือง เชียงใหม่",
      mapUrl: "https://maps.google.com/?q=chiang+mai",
      phones: ["081-234-5678"],
      featured: true,
      sortOrder: 1,
      menu: [
        { name: "ผัดกะเพราเห็ดรวม", price: "60", recommended: true },
        { name: "ข้าวผัดเจ", price: "50", recommended: true },
        { name: "ต้มยำเห็ด", price: "70", recommended: false },
        { name: "แกงเขียวหวานลูกชิ้นเจ", price: "65", recommended: false },
      ],
      contacts: [
        { type: "LINE", label: "LINE ร้าน", value: "@kruajae" },
        {
          type: "Facebook",
          label: "เพจครัวเจบ้านสวน",
          value: "https://facebook.com/kruajaebaansuan",
        },
      ],
    },
    {
      name: "เจ๊หมวย โภชนาเจ",
      slug: "jae-muay-phochana-jae",
      tagline: "บุฟเฟต์เจ 99 บาท อิ่มไม่อั้น",
      description:
        "บุฟเฟต์อาหารเจกว่า 30 อย่าง หมุนเวียนทุกวัน เปิด 10:00–20:00\nมีที่จอดรถกว้าง",
      foodTags: ["บุฟเฟต์"],
      priceRange: "฿฿",
      provinceText: "กรุงเทพมหานคร",
      addressText: "ตลาดเจ เขตจตุจักร กทม.",
      phones: ["02-111-2222", "089-999-0000"],
      featured: true,
      sortOrder: 2,
      menu: [
        { name: "บุฟเฟต์เจ (ต่อคน)", price: "99", recommended: true },
        { name: "น้ำสมุนไพร", price: "15", recommended: false },
      ],
      contacts: [{ type: "LINE", label: "จองโต๊ะ", value: "@jaemuay" }],
    },
    {
      name: "อิ่มบุญ วีแกนคาเฟ่",
      slug: "im-boon-vegan-cafe",
      tagline: "ขนมและเครื่องดื่มเจ ไม่มีนม ไม่มีไข่",
      description:
        "คาเฟ่ขนมเจสไตล์โฮมเบเกอรี่ เค้ก คุกกี้ กาแฟ นมพืช\nนั่งชิลได้ทั้งวัน",
      foodTags: ["ขนม-เครื่องดื่ม"],
      priceRange: "฿฿",
      provinceText: "ภูเก็ต",
      phones: ["076-555-1234"],
      featured: false,
      sortOrder: 3,
      menu: [
        { name: "บราวนี่เจ", price: "55", recommended: true },
        { name: "ลาเต้นมโอ๊ต", price: "70", recommended: true },
        { name: "คุกกี้ธัญพืช", price: "40", recommended: false },
      ],
      contacts: [
        {
          type: "Instagram",
          label: "IG ร้าน",
          value: "https://instagram.com/imboon.cafe",
        },
      ],
    },
  ];

  for (const r of seed) {
    console.log(`เพิ่มร้าน: ${r.name}`);
    const [row] = await db
      .insert(restaurants)
      .values({
        name: r.name,
        slug: r.slug,
        tagline: r.tagline,
        description: r.description,
        foodTags: r.foodTags,
        priceRange: r.priceRange,
        provinceText: r.provinceText,
        addressText: r.addressText ?? null,
        mapUrl: r.mapUrl ?? null,
        phones: r.phones,
        status: "published",
        featured: r.featured,
        sortOrder: r.sortOrder,
      })
      .returning({ id: restaurants.id });

    await db.insert(menuItems).values(
      r.menu.map((m, i) => ({
        restaurantId: row.id,
        name: m.name,
        price: m.price,
        recommended: m.recommended,
        sortOrder: i,
      })),
    );

    await db.insert(contactChannels).values(
      r.contacts.map((c, i) => ({
        restaurantId: row.id,
        type: c.type,
        label: c.label,
        value: c.value,
        sortOrder: i,
      })),
    );
  }

  console.log("\nเสร็จ ✅  seed 3 ร้านเรียบร้อย");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
