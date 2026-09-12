import Link from "next/link";

import { Container } from "@/components/Container";
import { SITE_NAME } from "@/lib/constants";

const NAV = [
  { href: "/", label: "หน้าแรก" },
  { href: "/restaurants", label: "ร้านค้าทั้งหมด" },
  { href: "/menu", label: "เมนูทั้งหมด" },
  { href: "/divisions", label: "กองงาน" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-brand-500 text-lg font-bold text-white">
            เจ
          </span>
          <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
