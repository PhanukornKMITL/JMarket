import { cn } from "@/lib/utils";

/** กล่องรูป fallback สีเขียว พร้อมตัวอักษรแรกของชื่อ */
export function ImagePlaceholder({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  const ch = (label ?? "เจ").trim().charAt(0) || "เจ";
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-brand-200 to-brand-400 text-brand-800",
        className,
      )}
      aria-hidden
    >
      <span className="text-3xl font-bold opacity-80">{ch}</span>
    </div>
  );
}
