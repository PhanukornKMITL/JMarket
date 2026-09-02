import Link from "next/link";

import { Container } from "@/components/Container";
import { logout } from "./actions";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-brand-100 bg-surface">
        <Container className="flex h-14 items-center justify-between">
          <Link href="/admin" className="font-bold text-ink">
            JMarket <span className="text-brand-600">admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              target="_blank"
              className="text-muted hover:text-brand-700"
            >
              ดูเว็บจริง ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-brand-200 px-3 py-1.5 font-medium text-muted hover:bg-brand-50 hover:text-brand-700"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        </Container>
      </header>
      <Container className="py-8">{children}</Container>
    </div>
  );
}
