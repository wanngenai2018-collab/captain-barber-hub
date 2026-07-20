import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { Check } from "lucide-react";
import fade from "@/assets/service-fade.jpg";
import shave from "@/assets/service-shave.jpg";
import style from "@/assets/service-style.jpg";
import color from "@/assets/service-color.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "บริการและราคา — กัปตัน Barber" },
      { name: "description", content: "บริการตัดผมชาย, Fade, โกนหนวด, ย้อมสี, เซ็ตผม ราคาชัดเจน เริ่มต้น 80 บาท" },
      { property: "og:title", content: "บริการและราคา — กัปตัน Barber" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  const { lang } = useI18n();
  const items = [
    {
      img: fade,
      t: lang === "th" ? "ตัดผมเด็ก (อายุไม่เกิน 12)" : "Kids Haircut (under 12)",
      p: "80",
      d: lang === "th" ? "ตัดทรงตามใจคุณพ่อคุณแม่และน้อง ๆ ใจเย็น ค่อยเป็นค่อยไป" : "Patient, gentle cuts for kids.",
      f: [lang === "th" ? "ปรึกษาทรง" : "Style consult", lang === "th" ? "สระเซ็ตพื้นฐาน" : "Basic wash"],
    },
    {
      img: fade,
      t: lang === "th" ? "ตัดผมผู้ใหญ่ / Fade" : "Adult Haircut / Fade",
      p: "100",
      d: lang === "th" ? "รวม Fade ทุกระดับ, Undercut, Two-Block, Pompadour, ทรงนักเรียน-นักศึกษา" : "All fade levels, undercut, two-block, pompadour, school cuts.",
      f: [lang === "th" ? "ปรึกษาทรงเฉพาะบุคคล" : "Personal style consult", lang === "th" ? "สระผม + เซ็ตพื้นฐาน" : "Wash + basic set"],
      highlight: true,
    },
    {
      img: shave,
      t: lang === "th" ? "โกนหนวด (Hot-Towel Shave)" : "Hot-Towel Shave",
      p: "80",
      d: lang === "th" ? "โกนด้วยมีดโกนคลาสสิก พร้อมผ้าร้อนและครีมบำรุงผิว" : "Straight-razor shave with hot towel and after-balm.",
      f: [lang === "th" ? "ผ้าร้อน" : "Hot towel", lang === "th" ? "ครีมบำรุงหลังโกน" : "After-shave balm"],
    },
    {
      img: style,
      t: lang === "th" ? "เซ็ตผม / ไดร์จัดทรง" : "Hair Styling",
      p: "100",
      d: lang === "th" ? "เซ็ตทรงพร้อมออกงาน พร้อมสอนวิธีเซ็ตเองที่บ้าน" : "Event-ready styling. We teach you the at-home technique.",
      f: [lang === "th" ? "แว็กซ์/พอมเมด" : "Wax / pomade", lang === "th" ? "ไดร์เป่าจัดทรง" : "Blow-dry"],
    },
    {
      img: color,
      t: lang === "th" ? "ย้อมสีผม" : "Hair Color",
      p: "100-300",
      d: lang === "th" ? "ย้อมสีธรรมชาติ, แฟชั่น, ไฮไลท์, ปิดผมขาว ราคาตามความยาว/สี" : "Natural, fashion, highlight, grey coverage — priced by length/color.",
      f: [lang === "th" ? "ปรึกษาสีที่เหมาะ" : "Color match", lang === "th" ? "ใช้สียี่ห้อพรีเมี่ยม" : "Premium color brand"],
    },
  ];

  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Services & pricing</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">
              {lang === "th" ? "บริการและราคา" : "Services & Pricing"}
            </h1>
            <p className="mt-4 text-muted-foreground">
              {lang === "th"
                ? "ราคาแสดงชัดเจน ไม่มีค่าใช้จ่ายแอบแฝง สามารถโทรสอบถามหรือแอด LINE ก่อนได้"
                : "Transparent pricing. Call or LINE us any time."}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className={`h-full overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] ${s.highlight ? "border-gold shadow-[var(--shadow-gold)]" : "border-border"}`}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={s.img} alt={s.t} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold">{s.t}</h3>
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-muted-foreground">{lang === "th" ? "เริ่มต้น" : "from"}</div>
                      <div className="text-2xl font-bold text-gold">฿{s.p}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                  <ul className="mt-4 space-y-1.5">
                    {s.f.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-gold" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking" className="mt-5 btn-gold w-full">
                    {lang === "th" ? "จองบริการนี้" : "Book this"}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
