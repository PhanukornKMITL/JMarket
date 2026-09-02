import Link from "next/link";

import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-5xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-2 text-xl font-bold text-ink">ไม่พบหน้านี้</h1>
      <p className="mt-1 text-muted">อาจถูกลบไปแล้ว หรือลิงก์ไม่ถูกต้อง</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
      >
        กลับหน้าแรก
      </Link>
    </Container>
  );
}
