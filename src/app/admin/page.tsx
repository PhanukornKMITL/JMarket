import Link from "next/link";

import { getAllRestaurantsForAdmin } from "@/lib/queries";
import { AdminRestaurantsTable } from "./_components/AdminRestaurantsTable";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const rows = await getAllRestaurantsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">ร้านอาหารเจ</h1>
          <p className="text-sm text-muted">ทั้งหมด {rows.length} ร้าน</p>
        </div>
        <Link
          href="/admin/restaurants/new"
          className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + เพิ่มร้าน
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-card border border-dashed border-brand-200 bg-surface p-10 text-center text-muted">
          ยังไม่มีร้าน — กด “เพิ่มร้าน” เพื่อเริ่ม
        </p>
      ) : (
        <AdminRestaurantsTable rows={rows} />
      )}
    </div>
  );
}
