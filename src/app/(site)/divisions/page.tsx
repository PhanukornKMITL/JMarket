import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { getDivisionsWithCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "กองงาน",
  description: "รายชื่อกองงานทั้งหมด กดเข้าไปดูร้านค้าในกองงานนั้น",
};

export default async function DivisionsPage() {
  const divisions = await getDivisionsWithCounts();

  return (
    <Container className="py-10">
      <h1 className="mb-6 text-2xl font-extrabold text-ink">กองงาน</h1>

      {divisions.length === 0 ? (
        <p className="py-16 text-center text-muted">ยังไม่มีกองงาน</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((d) => (
            <Link
              key={d.division}
              href={`/divisions/${encodeURIComponent(d.division)}`}
              className="group flex flex-col gap-1 rounded-card border border-brand-100 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="font-bold text-ink group-hover:text-brand-700">
                {d.division}
              </h2>
              <p className="text-sm text-muted">{d.count} ร้าน</p>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
