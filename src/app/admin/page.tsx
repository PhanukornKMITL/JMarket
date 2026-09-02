import Link from "next/link";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { getAllRestaurantsForAdmin } from "@/lib/queries";
import { toggleFeatured, togglePublish } from "./actions";
import { DeleteButton } from "./_components/DeleteButton";

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
        <div className="overflow-x-auto rounded-card border border-brand-100 bg-surface">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-brand-50 text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">ร้าน</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3">แนะนำ</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {rows.map((r) => (
                <tr key={r.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                        {r.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.coverImage}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <ImagePlaceholder
                            label={r.name}
                            className="size-full text-base"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{r.name}</p>
                        <p className="truncate text-xs text-muted">/r/{r.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value={r.status} />
                      <button
                        type="submit"
                        className={
                          r.status === "published"
                            ? "rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700"
                            : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500"
                        }
                      >
                        {r.status === "published" ? "เผยแพร่" : "ร่าง"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleFeatured}>
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="hidden"
                        name="featured"
                        value={String(r.featured)}
                      />
                      <button
                        type="submit"
                        title="สลับปักหมุด"
                        className={
                          r.featured
                            ? "text-lg text-brand-500"
                            : "text-lg text-gray-300"
                        }
                      >
                        ★
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/restaurants/${r.id}`}
                        className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
                      >
                        แก้ไข
                      </Link>
                      <DeleteButton id={r.id} name={r.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
