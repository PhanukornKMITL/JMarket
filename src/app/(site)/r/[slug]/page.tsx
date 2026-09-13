import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { ContactBox } from "@/components/ContactBox";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { MenuItem } from "@/db/schema";
import { getRestaurantBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const r = await getRestaurantBySlug(slug);
  if (!r) return { title: "ไม่พบร้าน" };

  const description = r.description ?? `ร้านอาหารเจ ${r.name}`;
  return {
    title: r.name,
    description,
    openGraph: {
      title: r.name,
      description,
      images: r.coverImage ? [{ url: r.coverImage }] : undefined,
    },
  };
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-brand-100 bg-surface p-3">
      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-brand-50">
        {item.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.photo}
            alt={item.name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <ImagePlaceholder label={item.name} className="size-full text-lg" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-semibold text-ink">
          {item.name}
          {item.foodTag ? (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
              {item.foodTag}
            </span>
          ) : null}
        </p>
      </div>
      {item.price ? (
        <span className="shrink-0 font-bold text-brand-600">
          {/^\d+$/.test(item.price) ? `฿${item.price}` : item.price}
        </span>
      ) : null}
    </li>
  );
}

export default async function RestaurantDetailPage({ params }: Params) {
  const { slug } = await params;
  const r = await getRestaurantBySlug(slug);
  if (!r) notFound();

  return (
    <Container className="py-8">
      <Link
        href="/restaurants"
        className="text-sm text-brand-700 hover:underline"
      >
        ← กลับหน้าร้านทั้งหมด
      </Link>

      {/* 1. หัวเรื่อง */}
      <div className="mt-4 overflow-hidden rounded-card border border-brand-100 bg-surface">
        <div className="aspect-[16/9] w-full bg-brand-50 sm:aspect-[21/9]">
          {r.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={r.coverImage}
              alt={r.name}
              className="size-full object-cover"
            />
          ) : (
            <ImagePlaceholder label={r.name} className="size-full" />
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-2xl font-extrabold text-ink">{r.name}</h1>
            {r.priceRange ? (
              <span className="text-lg font-bold text-brand-600">
                {r.priceRange}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-8">
        {/* 2. ช่องทางติดต่อ */}
        <ContactBox phones={r.phones} channels={r.contactChannels} />

        {/* 3. รายละเอียดร้าน */}
        {r.description ? (
          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">รายละเอียดร้าน</h2>
            <p className="whitespace-pre-line leading-relaxed text-ink/90">
              {r.description}
            </p>
          </section>
        ) : null}

        {/* 4. เมนู */}
        {r.menuItems.length > 0 ? (
          <section>
            <h2 className="mb-3 text-lg font-bold text-ink">เมนู</h2>
            <ul className="space-y-2">
              {r.menuItems.map((item) => (
                <MenuRow key={item.id} item={item} />
              ))}
            </ul>
          </section>
        ) : null}

        {/* 5. ที่อยู่ */}
        {r.addressText || r.mapUrl ? (
          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">ที่อยู่</h2>
            {r.provinceText ? (
              <p className="text-sm text-muted">จังหวัด{r.provinceText}</p>
            ) : null}
            {r.addressText ? (
              <p className="mt-1 whitespace-pre-line text-ink/90">
                {r.addressText}
              </p>
            ) : null}
            {r.mapUrl ? (
              <a
                href={r.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-300 bg-surface px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                🗺️ เปิดใน Google Maps
              </a>
            ) : null}
          </section>
        ) : null}
      </div>
    </Container>
  );
}
