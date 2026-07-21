import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MessageCircle, Scissors, Star, ShieldCheck, Award, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import heroShop from "@/assets/hero-shop.jpg";
import fade from "@/assets/service-fade.jpg";
import shave from "@/assets/service-shave.jpg";
import style from "@/assets/service-style.jpg";
import color from "@/assets/service-color.jpg";
import ba1 from "@/assets/ba-1.jpg";
import ba2 from "@/assets/ba-2.jpg";
import ba3 from "@/assets/ba-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { tr, lang } = useI18n();

  const services = [
    { img: fade, t: lang === "th" ? "Fade / รองทรง" : "Fade / Taper", p: "฿100" },
    { img: shave, t: lang === "th" ? "โกนหนวด" : "Hot-Towel Shave", p: "฿80" },
    { img: style, t: lang === "th" ? "เซ็ตผม" : "Hair Styling", p: "฿100" },
    { img: color, t: lang === "th" ? "ย้อมสี" : "Hair Color", p: "฿100-300" },
  ];

  const usps = [
    { icon: Scissors, t: tr("usp_1_t"), d: tr("usp_1_d") },
    { icon: Star, t: tr("usp_2_t"), d: tr("usp_2_d") },
    { icon: ShieldCheck, t: tr("usp_3_t"), d: tr("usp_3_d") },
    { icon: Award, t: tr("usp_4_t"), d: tr("usp_4_d") },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 h-[92vh] min-h-[620px] w-full overflow-hidden">
        <img
          src={heroShop}
          alt="กัปตัน Barber shop interior"
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={1000}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/85" />
        <div className="relative z-10 h-full container-x flex flex-col justify-center items-start text-white">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-gold animate-fade-in">
            {tr("hero_kicker")}
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.02] animate-fade-in">
            <span className="text-gradient-gold">{tr("hero_title")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg md:text-xl text-white/90 animate-fade-in">
            {tr("hero_sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-in">
            <a href={SITE.bookingUrl} target="_blank" rel="noreferrer" className="btn-gold">{tr("hero_book")} <ChevronRight className="h-4 w-4" /></a>
            <a href={`tel:${SITE.phoneTel}`} className="btn-outline-gold text-white">
              <Phone className="h-4 w-4" /> {tr("hero_call")}
            </a>
            <a href={SITE.lineUrl} className="inline-flex items-center gap-2 rounded-lg bg-[#06C755] px-6 py-3 font-semibold text-white hover:brightness-110 transition">
              <MessageCircle className="h-4 w-4" /> {tr("hero_line")}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/70 animate-fade-in">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}
              <span className="ml-2">4.9 / 5.0 · 320+ {lang === "th" ? "รีวิว" : "reviews"}</span>
            </div>
            <span>·</span>
            <span>{tr("footer_hours")}</span>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="section bg-background">
        <div className="container-x">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Why us</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">{tr("usp_title")}</h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {usps.map((u, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group h-full rounded-xl border border-border bg-card p-6 transition hover:border-gold hover:shadow-[var(--shadow-gold)]">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-gold-foreground transition">
                    <u.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{u.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{u.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-card">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Services</p>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold">{tr("services_title")}</h2>
              </div>
              <Link to="/services" className="text-sm font-semibold text-gold hover:underline inline-flex items-center gap-1">
                {lang === "th" ? "ดูทั้งหมด" : "See all"} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group overflow-hidden rounded-xl border border-border bg-background transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={s.img} alt={s.t} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <h3 className="font-semibold">{s.t}</h3>
                    <span className="text-gold font-bold">{s.p}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="section bg-background">
        <div className="container-x">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Transformations</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">{tr("gallery_title")}</h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[ba1, ba2, ba3].map((src, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative overflow-hidden rounded-xl border border-border">
                  <img src={src} alt={`Before and After ${i + 1}`} loading="lazy" className="h-full w-full object-cover aspect-[16/10]" />
                  <div className="absolute top-3 left-3 rounded-full bg-gold text-gold-foreground text-xs font-bold px-3 py-1">
                    BEFORE / AFTER
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/gallery" className="btn-outline-gold">{lang === "th" ? "ดูผลงานทั้งหมด" : "View all work"}</Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section bg-card">
        <div className="container-x">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Reviews</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">{tr("reviews_title")}</h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "คุณเอก", r: "ตัด Fade เนี้ยบมากพี่ ให้คำแนะนำทรงที่เหมาะกับหน้า ไปเป็นลูกค้าประจำแน่นอน" },
              { n: "คุณโบ๊ท", r: "ร้านสะอาด แอร์เย็น ช่างใจดี ราคาไม่แพง มาตัดทุกเดือน" },
              { n: "คุณจูน", r: "พาลูกชายมาตัด เด็กติดใจ ไม่ร้องเลย ช่างเก่งจริง ๆ" },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="h-full rounded-xl border border-border bg-background p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-gold text-gold" />)}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">"{r.r}"</p>
                  <p className="mt-4 text-sm font-semibold text-gold">— {r.n}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promo CTA */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-[oklch(0.2_0_0)] to-[oklch(0.14_0_0)] p-10 md:p-14 text-white shadow-[var(--shadow-elegant)]">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Promotion</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">{tr("promo_title")}</h2>
              <p className="mt-3 max-w-xl text-white/80">{tr("promo_desc")}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={SITE.bookingUrl} target="_blank" rel="noreferrer" className="btn-gold">{tr("hero_book")}</a>
                <a href={SITE.lineUrl} className="btn-outline-gold text-white">LINE {SITE.line}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
