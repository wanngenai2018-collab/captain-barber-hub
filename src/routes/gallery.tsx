import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import ba1 from "@/assets/ba-1.jpg";
import ba2 from "@/assets/ba-2.jpg";
import ba3 from "@/assets/ba-3.jpg";
import ba4 from "@/assets/ba-4.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "ผลงาน Before & After — กัปตัน Barber" },
      { name: "description", content: "ผลงานตัดผมชาย Before & After ทรง Fade, รองทรง, ย้อมสี, โกนหนวด ที่ Captain Barber" },
      { property: "og:title", content: "ผลงาน Before & After — กัปตัน Barber" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

type Cat = "all" | "fade" | "cut" | "color" | "shave";

function Gallery() {
  const { lang } = useI18n();
  const [cat, setCat] = useState<Cat>("all");

  const items: { src: string; cat: Exclude<Cat, "all">; t: string }[] = [
    { src: ba1, cat: "fade", t: "Skin Fade + Pompadour" },
    { src: ba2, cat: "fade", t: "Mid Fade + Side Part" },
    { src: ba3, cat: "cut", t: lang === "th" ? "ทรงเด็ก" : "Kids Cut" },
    { src: ba4, cat: "color", t: lang === "th" ? "ย้อมสีบลอนด์" : "Blonde Highlights" },
    { src: ba1, cat: "cut", t: "Undercut" },
    { src: ba2, cat: "fade", t: "Low Fade" },
    { src: ba4, cat: "color", t: lang === "th" ? "ไฮไลท์" : "Ash Highlights" },
    { src: ba3, cat: "shave", t: lang === "th" ? "โกนคลาสสิก" : "Classic Shave" },
  ];

  const tabs: { k: Cat; l: string }[] = [
    { k: "all", l: lang === "th" ? "ทั้งหมด" : "All" },
    { k: "fade", l: "Fade" },
    { k: "cut", l: lang === "th" ? "รองทรง" : "Cuts" },
    { k: "color", l: lang === "th" ? "ย้อมสี" : "Color" },
    { k: "shave", l: lang === "th" ? "โกนหนวด" : "Shave" },
  ];

  const filtered = cat === "all" ? items : items.filter((i) => i.cat === cat);

  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Gallery</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">Before & After</h1>
            <p className="mt-4 text-muted-foreground">
              {lang === "th"
                ? "ผลงานจริงจากลูกค้าของเรา ทุกภาพจากช่างกัปตันโดยตรง"
                : "Real client transformations, all cut by Captain."}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setCat(t.k)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                cat === t.k
                  ? "bg-gold text-gold-foreground border-gold"
                  : "border-border hover:border-gold hover:text-gold"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it, i) => (
            <Reveal key={`${cat}-${i}`} delay={i * 60}>
              <div className="group relative overflow-hidden rounded-xl border border-border">
                <img src={it.src} alt={it.t} loading="lazy" className="w-full h-full object-cover aspect-[16/10] transition duration-700 group-hover:scale-110" />
                <div className="absolute top-3 left-3 rounded-full bg-gold text-gold-foreground text-xs font-bold px-3 py-1">
                  BEFORE / AFTER
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-semibold text-sm">{it.t}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
