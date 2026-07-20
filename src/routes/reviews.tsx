import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "รีวิวลูกค้า — กัปตัน Barber" },
      { name: "description", content: "รีวิวจากลูกค้าจริงของ Captain Barber ร้านตัดผมชายเชี่ยวชาญ Fade" },
      { property: "og:title", content: "รีวิวลูกค้า — กัปตัน Barber" },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: Reviews,
});

const reviews = [
  { n: "คุณเอก", role: "พนักงานออฟฟิศ", r: "ตัด Fade เนี้ยบมากพี่ ให้คำแนะนำทรงที่เหมาะกับหน้า ไปเป็นลูกค้าประจำแน่นอน ราคาก็สบายกระเป๋า" },
  { n: "คุณโบ๊ท", role: "นักศึกษา", r: "ร้านสะอาด แอร์เย็น ช่างใจดี ราคาไม่แพง มาตัดทุกเดือน เพื่อน ๆ ถามหมดว่าตัดที่ไหน" },
  { n: "คุณจูน", role: "คุณแม่", r: "พาลูกชายมาตัด เด็กติดใจ ไม่ร้องเลย ช่างเก่งจริง ๆ ใจเย็นกับเด็กมาก" },
  { n: "คุณต้น", role: "ครีเอเตอร์", r: "ทรงมิดฟาดที่ผมอยากได้เป๊ะตามที่คุยไว้ ทำงานปราณีต ใช้เวลาไม่นานแต่งานออกมาโปร" },
  { n: "คุณโอ๊ค", role: "ฟรีแลนซ์", r: "โกนหนวดผ้าร้อนที่นี่ฟินมาก ผ่อนคลายเหมือนไปสปา จะกลับมาแน่นอน" },
  { n: "คุณเจมส์", role: "วิศวกร", r: "ย้อมสีบลอนด์ให้ผม สีสวยไม่เพี้ยน ช่างแนะนำการดูแลผมหลังย้อมด้วย ประทับใจ" },
];

function Reviews() {
  const { lang } = useI18n();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, []);

  const active = reviews[i];

  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Testimonials</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">
              {lang === "th" ? "รีวิวจากลูกค้าจริง" : "Real Customer Reviews"}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-5 w-5 fill-gold text-gold" />)}
              <span className="ml-2 text-sm text-muted-foreground">4.9 / 5.0 · 320+ reviews</span>
            </div>
          </div>
        </Reveal>

        {/* Slider */}
        <Reveal delay={120}>
          <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-gold/30 bg-card p-8 md:p-12 text-center relative shadow-[var(--shadow-elegant)]">
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-gold text-gold" />)}
            </div>
            <p className="text-lg md:text-xl leading-relaxed">"{active.r}"</p>
            <p className="mt-6 font-bold text-gold">{active.n}</p>
            <p className="text-xs text-muted-foreground">{active.role}</p>
            <button onClick={() => setI((i - 1 + reviews.length) % reviews.length)} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center hover:border-gold hover:text-gold" aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setI((i + 1) % reviews.length)} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center hover:border-gold hover:text-gold" aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="mt-6 flex justify-center gap-2">
              {reviews.map((_, j) => (
                <button key={j} onClick={() => setI(j)} aria-label={`Go to ${j + 1}`} className={`h-1.5 rounded-full transition-all ${j === i ? "w-8 bg-gold" : "w-2 bg-border"}`} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, j) => (
            <Reveal key={j} delay={j * 60}>
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-gold text-gold" />)}
                </div>
                <p className="text-sm leading-relaxed">"{r.r}"</p>
                <div className="mt-4">
                  <p className="text-sm font-bold text-gold">{r.n}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
