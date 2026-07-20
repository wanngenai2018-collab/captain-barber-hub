import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import owner from "@/assets/owner.jpg";
import interior from "@/assets/hero-shop.jpg";
import { Award, Scissors, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "เกี่ยวกับร้าน — กัปตัน Barber" },
      { name: "description", content: "รู้จักช่างกัปตัน เจ้าของร้าน Captain Barber ร้านตัดผมชายที่เปิดมา 3-4 ปี เชี่ยวชาญ Fade และทรงผมชายสมัยใหม่" },
      { property: "og:title", content: "เกี่ยวกับร้าน — กัปตัน Barber" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const { tr, lang } = useI18n();
  return (
    <>
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2 items-center">
          <Reveal>
            <div className="relative">
              <img src={owner} alt="ช่างกัปตัน — เจ้าของร้าน" className="rounded-2xl border border-border w-full object-cover aspect-[4/5]" />
              <div className="absolute -bottom-6 -right-6 hidden md:block rounded-xl bg-gold text-gold-foreground p-4 shadow-[var(--shadow-gold)]">
                <div className="text-3xl font-bold">3-4</div>
                <div className="text-xs uppercase tracking-wider">{lang === "th" ? "ปีบนถนนสายบาร์เบอร์" : "years of craft"}</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">About</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">{tr("about_title")}</h1>
            <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
              {lang === "th" ? (
                <>
                  <p>
                    "กัปตัน Barber" ก่อตั้งขึ้นเมื่อ 3-4 ปีที่แล้ว โดย <b>ช่างกัปตัน</b> ช่างหนุ่มที่หลงใหลในศาสตร์ของ Barber แบบ Classic
                    ผสานกับความ Modern ของทรงผมสมัยใหม่ เป้าหมายเดียวคือทำให้ผู้ชายทุกคน "ก้าวออกจากร้านอย่างมั่นใจ"
                  </p>
                  <p>
                    เราเชี่ยวชาญเป็นพิเศษในทรง <b>Fade</b> ทุกระดับ ตั้งแต่ Low, Mid, High, Skin Fade รวมถึงทรง Pompadour, Undercut,
                    Two-Block, และทรงนักเรียนที่เป๊ะทุกรายละเอียด
                  </p>
                  <p>
                    ทุกครั้งที่คุณมาหาเรา คุณจะได้รับคำแนะนำทรงผมที่เหมาะกับรูปหน้า ไลฟ์สไตล์ และบุคลิกของคุณ ในบรรยากาศที่เป็นกันเอง
                    ห้องแอร์เย็นสบาย และเครื่องมือที่ผ่านการฆ่าเชื้อทุกชิ้น
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Captain Barber was founded 3-4 years ago by <b>Captain</b>, a young barber obsessed with the craft of classic
                    barbering blended with modern men's cuts. One mission: every man walks out confident.
                  </p>
                  <p>
                    We specialize in <b>fades</b> — low, mid, high, skin — plus pompadours, undercuts, two-blocks, and razor-sharp
                    school cuts.
                  </p>
                  <p>
                    Every visit includes a personal consultation based on your face shape, lifestyle, and personality, in a
                    friendly, air-conditioned space with fully sanitized tools.
                  </p>
                </>
              )}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Users, k: "5,000+", v: lang === "th" ? "ลูกค้า" : "Clients" },
                { icon: Scissors, k: "20+", v: lang === "th" ? "ทรงถนัด" : "Signature cuts" },
                { icon: Award, k: "4.9★", v: lang === "th" ? "คะแนนรีวิว" : "Rating" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 text-center">
                  <s.icon className="mx-auto h-5 w-5 text-gold" />
                  <div className="mt-2 text-xl font-bold">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-card">
        <div className="container-x">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Our space</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">
                {lang === "th" ? "บรรยากาศร้านที่พร้อมต้อนรับคุณ" : "A space built for the modern gentleman"}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <img src={interior} alt="Interior" className="mt-8 rounded-2xl w-full object-cover aspect-[16/8] border border-border" loading="lazy" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
