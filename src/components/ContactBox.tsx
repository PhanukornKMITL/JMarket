import type { ContactChannel } from "@/db/schema";
import { externalHref, telHref } from "@/lib/utils";

const TYPE_META: Record<string, { icon: string; label: string }> = {
  LINE: { icon: "💬", label: "LINE" },
  Facebook: { icon: "📘", label: "Facebook" },
  Instagram: { icon: "📸", label: "Instagram" },
  TikTok: { icon: "🎵", label: "TikTok" },
  website: { icon: "🌐", label: "เว็บไซต์" },
  "อื่นๆ": { icon: "🔗", label: "ช่องทางอื่น" },
};

export function ContactBox({
  phones,
  channels,
}: {
  phones: string[];
  channels: ContactChannel[];
}) {
  const hasAny = phones.length > 0 || channels.length > 0;

  return (
    <section className="rounded-card border border-brand-200 bg-brand-50/60 p-5">
      <h2 className="mb-3 text-lg font-bold text-ink">ช่องทางติดต่อ</h2>

      {!hasAny ? (
        <p className="text-sm text-muted">— ยังไม่มีข้อมูลติดต่อ —</p>
      ) : null}

      {phones.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {phones.map((phone) => (
            <a
              key={phone}
              href={telHref(phone)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              📞 โทรเลย <span className="font-normal opacity-90">{phone}</span>
            </a>
          ))}
        </div>
      ) : null}

      {channels.length > 0 ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {channels.map((c) => {
            const meta = TYPE_META[c.type] ?? TYPE_META["อื่นๆ"];
            return (
              <li
                key={c.id}
                className="rounded-xl border border-brand-100 bg-surface p-3"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span>{meta.icon}</span>
                  <span>{c.label || meta.label}</span>
                </div>

                {c.value ? (
                  <a
                    href={externalHref(c.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-sm text-brand-700 underline underline-offset-2"
                  >
                    {c.value}
                  </a>
                ) : null}

                {c.qrImage ? (
                  <div className="mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.qrImage}
                      alt={`QR ${c.label || meta.label}`}
                      loading="lazy"
                      className="size-36 rounded-lg border border-brand-100 object-contain"
                    />
                    <p className="mt-1 text-xs text-muted">สแกนเพื่อเพิ่มเพื่อน / ติดตาม</p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
