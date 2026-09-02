import { Container } from "@/components/Container";
import { SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-brand-100 bg-surface py-8 text-sm text-muted">
      <Container className="flex flex-col items-center gap-1 text-center">
        <p className="font-semibold text-ink">{SITE_NAME}</p>
        <p>เว็บประชาสัมพันธ์ร้านอาหารเจ — ติดต่อร้านค้าได้โดยตรง</p>
        <p className="text-xs">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </Container>
    </footer>
  );
}
