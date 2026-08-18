import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { getGalleryItems } from "@/lib/content.functions";

const galleryQueryOptions = queryOptions({
  queryKey: ["gallery", "items"],
  queryFn: () => getGalleryItems(),
});

function GalleryError({ error }: { error: Error }) {
  return (
    <section className="section">
      <div className="container-x text-center">
        <h1 className="text-3xl font-bold">ผลงานโหลดไม่สำเร็จ</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "ผลงาน Before & After — กัปตัน Barber" },
      { name: "description", content: "ผลงานตัดผมชาย Before & After ทรง Fade, รองทรง, ย้อมสี, โกนหนวด ที่ Captain Barber เลื่อนเปรียบเทียบก่อน-หลังได้จริง" },
      { property: "og:title", content: "ผลงาน Before & After — กัปตัน Barber" },
      { property: "og:description", content: "เลื่อนดูภาพก่อน-หลังตัดผมจริงจากลูกค้าของ Captain Barber" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/gallery" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQueryOptions),
  component: Gallery,
  errorComponent: GalleryError,
});

function Gallery() {
  const { lang } = useI18n();
  const { data: items } = useSuspenseQuery(galleryQueryOptions);
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const filtered = cat === "all" ? items : items.filter((i) => i.category === cat);

  const label = (key: string) => {
    if (key === "all") return lang === "th" ? "ทั้งหมด" : "All";
    const map: Record<string, [string, string]> = {
      fade: ["Fade", "Fade"],
      cut: ["รองทรง", "Cuts"],
      color: ["ย้อมสี", "Color"],
      shave: ["โกนหนวด", "Shave"],
    };
    const pair = map[key];
    return pair ? (lang === "th" ? pair[0] : pair[1]) : key;
  };

  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Gallery</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">Before &amp; After</h1>
            <p className="mt-4 text-muted-foreground">
              {lang === "th"
                ? "ลากเส้นแบ่งซ้าย–ขวาเพื่อเปรียบเทียบก่อนตัดและหลังตัดจากผลงานจริง"
                : "Drag the divider left and right to compare real before and after results."}
            </p>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="mt-10 rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            {lang === "th" ? "ยังไม่มีผลงานในระบบ" : "No gallery items yet."}
          </p>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap gap-2">
              {["all", ...categories].map((key) => (
                <button
                  key={key}
                  onClick={() => setCat(key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    cat === key
                      ? "bg-gold text-gold-foreground border-gold"
                      : "border-border hover:border-gold hover:text-gold"
                  }`}
                >
                  {label(key)}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <Reveal key={item.id} delay={(i % 6) * 60}>
                  <figure className="rounded-2xl border border-border bg-card p-3">
                    <BeforeAfterSlider
                      beforeSrc={item.before_image_url}
                      afterSrc={item.after_image_url}
                      alt={lang === "th" ? item.title_th : item.title_en}
                      beforeLabel="BEFORE"
                      afterLabel="AFTER"
                    />
                    <figcaption className="mt-3 flex items-center justify-between gap-3 px-1 pb-1">
                      <p className="text-sm font-semibold">{lang === "th" ? item.title_th : item.title_en}</p>
                      <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-xs font-semibold text-gold">
                        {label(item.category)}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
