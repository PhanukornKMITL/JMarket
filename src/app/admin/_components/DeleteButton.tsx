"use client";

import { deleteRestaurant } from "../actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteRestaurant}
      className="contents"
      onSubmit={(e) => {
        if (!confirm(`ลบร้าน “${name}” ? การลบนี้ย้อนกลับไม่ได้`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        ลบ
      </button>
    </form>
  );
}
