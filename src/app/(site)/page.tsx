import Link from "next/link";

import { Container } from "@/components/Container";
import { MenuCard } from "@/components/MenuCard";
import { RestaurantCard } from "@/components/RestaurantCard";
import {
  getFeaturedRestaurants,
  getPublishedRestaurants,
  getRecommendedMenuItems,
} from "@/lib/queries";
import { SITE_TAGLINE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, all, recommended] = await Promise.all([
    getFeaturedRestaurants(6),
    getPublishedRestaurants(),
    getRecommendedMenuItems(),
  ]);

  const featuredList = featured.length > 0 ? featured : all.slice(0, 6);
  const menuStrip = recommended.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-100 to-canvas">
        <Container className="py-14 text-center sm:py-20">
          <p className="mb-3 inline-block rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            อาหารเจ 100%
          </p>
          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            {SITE_TAGLINE}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            รวมร้านอาหารเจทั่วไทย ดูเมนู รูปภาพ และช่องทางติดต่อร้านได้โดยตรง
            ไม่ต้องสมัครสมาชิก ไม่ผ่านคนกลาง
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/restaurants"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              ดูร้านทั้งหมด
            </Link>
            <Link
              href="/menu"
              className="rounded-full border border-brand-300 bg-surface px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
            >
              ดูเมนูทั้งหมด
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        {/* ร้านแนะนำ */}
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink">ร้านแนะนำ</h2>
          <Link
            href="/restaurants"
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        {featuredList.length === 0 ? (
          <p className="rounded-card border border-dashed border-brand-200 bg-surface p-10 text-center text-muted">
            ยังไม่มีร้านในระบบ — เพิ่มร้านได้ที่หน้า{" "}
            <Link href="/admin" className="text-brand-700 underline">
              /admin
            </Link>
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredList.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}

        {/* เมนูแนะนำ */}
        {menuStrip.length > 0 ? (
          <div className="mt-14">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-bold text-ink">เมนูแนะนำ</h2>
              <Link
                href="/menu"
                className="text-sm font-medium text-brand-700 hover:underline"
              >
                ดูทั้งหมด →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {menuStrip.map((it) => (
                <MenuCard key={it.id} item={it} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </>
  );
}
