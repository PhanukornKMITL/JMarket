export function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (images.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-ink">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${src}-${i}`}
            src={src}
            alt={`${title} ${i + 1}`}
            loading="lazy"
            className="aspect-square w-full rounded-xl border border-brand-100 object-cover"
          />
        ))}
      </div>
    </section>
  );
}
