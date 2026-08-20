import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import owner from "@/assets/owner.jpg";
import interior from "@/assets/hero-shop.jpg";
import { Award, Scissors, Users, UserPlus } from "lucide-react";
import { getBarbers } from "@/lib/content.functions";
import { getReviewsPayload } from "@/lib/reviews.functions";

const barbersQueryOptions = queryOptions({
  queryKey: ["barbers"],
  queryFn: () => getBarbers(),
});

const aboutReviewsQueryOptions = queryOptions({
  queryKey: ["reviews", "payload"],
  queryFn: () => getReviewsPayload(),
});

function AboutError({ error }: { error: Error }) {
  return (
    <section className="section">
      <div className="container-x text-center">
        <h1 className="text-3xl font-bold">ข้อมูลร้านโหลดไม่สำเร็จ</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "เกี่ยวกับร้าน — กัปตัน Barber" },
      { name: "description", content: "รู้จักช่างกัปตัน เจ้าของร้าน Captain Barber ร้านตัดผมชายที่เปิดมา 3-4 ปี เชี่ยวชาญ Fade และทรงผมชายสมัยใหม่" },
      { property: "og:title", content: "เกี่ยวกับร้าน — กัปตัน Barber" },
      { property: "og:description", content: "ทีมช่างของ Captain Barber และเรื่องราวของร้านตัดผมชายที่เชี่ยวชาญ Fade" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(barbersQueryOptions),
      context.queryClient.ensureQueryData(aboutReviewsQueryOptions),
    ]);
  },
  component: About,
  errorComponent: AboutError,
});

function TeamSection() {
  const { lang } = useI18n();
  const { data: barbers } = useSuspenseQuery(barbersQueryOptions);

  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Our team</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              {lang === "th" ? "ทีมช่างของเรา" : "Meet the barbers"}
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber, i) => {
            const name = (lang === "th" ? barber.name_th : barber.name_en) ?? barber.name_th ?? barber.name_en;
            const role = (lang === "th" ? barber.role_th : barber.role_en) ?? barber.role_th ?? barber.role_en;
            const bio = (lang === "th" ? barber.bio_th : barber.bio_en) ?? barber.bio_th ?? barber.bio_en;
            const ready = barber.is_published && Boolean(name);

            return (
              <Reveal key={barber.id} delay={i * 90}>
                <article className="h-full overflow-hidden rounded-2xl border border-border bg-card transition hover:border-gold/60">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-background">
                    {barber.image_url ? (
                      <img
                        src={barber.image_url}
                        alt={name ?? "Captain Barber"}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
                        <UserPlus className="h-8 w-8 text-gold/70" />
                        <p className="px-6 text-center text-xs">
                          {lang === "th" ? "พื้นที่สำหรับรูปช่างคนถัดไป" : "Profile photo slot"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold">
                      {ready ? name : lang === "th" ? "ตำแหน่งช่างว่าง" : "Barber slot open"}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-gold">
                      {ready
                        ? role
                        : lang === "th"
                          ? "รอเพิ่มข้อมูลช่างในระบบหลังบ้าน"
                          : "Awaiting profile from the admin system"}
                    </p>
                    {ready && bio && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{bio}</p>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  const { tr, lang } = useI18n();
  const { data: reviewsPayload } = useSuspenseQuery(aboutReviewsQueryOptions);
  const stats = reviewsPayload.stats;
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
                { icon: Award, k: stats.total > 0 ? `${stats.average.toFixed(1)}★` : "—", v: lang === "th" ? `คะแนนรีวิว (${stats.total})` : `Rating (${stats.total})` },
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

      <TeamSection />

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
