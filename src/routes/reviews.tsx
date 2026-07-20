import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Loader as Loader2, CircleCheck as CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { supabase, type Review } from "@/lib/supabase";

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

const seedReviews = [
  { n: "คุณเอก", role: "พนักงานออฟฟิศ", r: "ตัด Fade เนี้ยบมากพี่ ให้คำแนะนำทรงที่เหมาะกับหน้า ไปเป็นลูกค้าประจำแน่นอน ราคาก็สบายกระเป๋า" },
  { n: "คุณโบ๊ท", role: "นักศึกษา", r: "ร้านสะอาด แอร์เย็น ช่างใจดี ราคาไม่แพง มาตัดทุกเดือน เพื่อน ๆ ถามหมดว่าตัดที่ไหน" },
  { n: "คุณจูน", role: "คุณแม่", r: "พาลูกชายมาตัด เด็กติดใจ ไม่ร้องเลย ช่างเก่งจริง ๆ ใจเย็นกับเด็กมาก" },
  { n: "คุณต้น", role: "ครีเอเตอร์", r: "ทรงมิดฟาดที่ผมอยากได้เป๊ะตามที่คุยไว้ ทำงานปราณีต ใช้เวลาไม่นานแต่งานออกมาโปร" },
  { n: "คุณโอ๊ค", role: "ฟรีแลนซ์", r: "โกนหนวดผ้าร้อนที่นี่ฟินมาก ผ่อนคลายเหมือนไปสปา จะกลับมาแน่นอน" },
  { n: "คุณเจมส์", role: "วิศวกร", r: "ย้อมสีบลอนด์ให้ผม สีสวยไม่เพี้ยน ช่างแนะนำการดูแลผมหลังย้อมด้วย ประทับใจ" },
];

type ReviewItem = { n: string; role: string; r: string };

function Reviews() {
  const { lang } = useI18n();
  const [i, setI] = useState(0);
  const [dbReviews, setDbReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: "", role: "", rating: 5, message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("name, role, rating, message")
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (!error && data) {
        const mapped = (data as Pick<Review, "name" | "role" | "rating" | "message">[]).map((d) => ({
          n: d.name,
          role: d.role ?? "",
          r: d.message,
        }));
        setDbReviews(mapped);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allReviews: ReviewItem[] = [...dbReviews, ...seedReviews];

  useEffect(() => {
    if (allReviews.length === 0) return;
    const id = setInterval(() => setI((v) => (v + 1) % allReviews.length), 5000);
    return () => clearInterval(id);
  }, [allReviews.length]);

  const active = allReviews[i] ?? allReviews[0];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (form.name.trim().length < 2) {
      setFormError(lang === "th" ? "กรุณากรอกชื่อ" : "Please enter your name");
      return;
    }
    if (form.message.trim().length < 5) {
      setFormError(lang === "th" ? "กรุณาเขียนรีวิวอย่างน้อย 5 ตัวอักษร" : "Review must be at least 5 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      name: form.name.trim(),
      role: form.role.trim() || null,
      rating: form.rating,
      message: form.message.trim(),
      approved: false,
    });
    setSubmitting(false);
    if (error) {
      setFormError(lang === "th" ? "ส่งรีวิวไม่สำเร็จ กรุณาลองอีกครั้ง" : "Failed to submit. Please try again.");
      return;
    }
    setFormOk(true);
    setForm({ name: "", role: "", rating: 5, message: "" });
  };

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
        {active && (
          <Reveal delay={120}>
            <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-gold/30 bg-card p-8 md:p-12 text-center relative shadow-[var(--shadow-elegant)]">
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-gold text-gold" />)}
              </div>
              <p className="text-lg md:text-xl leading-relaxed">"{active.r}"</p>
              <p className="mt-6 font-bold text-gold">{active.n}</p>
              {active.role && <p className="text-xs text-muted-foreground">{active.role}</p>}
              <button onClick={() => setI((i - 1 + allReviews.length) % allReviews.length)} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center hover:border-gold hover:text-gold" aria-label="Previous">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => setI((i + 1) % allReviews.length)} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center hover:border-gold hover:text-gold" aria-label="Next">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="mt-6 flex justify-center gap-2">
                {allReviews.map((_, j) => (
                  <button key={j} onClick={() => setI(j)} aria-label={`Go to ${j + 1}`} className={`h-1.5 rounded-full transition-all ${j === i ? "w-8 bg-gold" : "w-2 bg-border"}`} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Submit review form */}
        <Reveal delay={80}>
          <div className="mt-12 max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold">
              {lang === "th" ? "แบ่งปันรีวิวของคุณ" : "Share your review"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "th"
                ? "รีวิวของคุณจะถูกส่งเพื่อตรวจสอบก่อนนำขึ้นเว็บ"
                : "Your review will be reviewed before appearing on the site."}
            </p>

            {formOk && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold/60 bg-gold/10 p-4 text-sm">
                <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                <p className="font-semibold text-gold">
                  {lang === "th"
                    ? "ขอบคุณสำหรับรีวิว! ทีมงานจะตรวจสอบและนำขึ้นเว็บเร็ว ๆ นี้"
                    : "Thanks for your review! We'll publish it shortly."}
                </p>
              </div>
            )}

            {formError && (
              <div className="mt-5 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {formError}
              </div>
            )}

            <form onSubmit={submit} noValidate className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {lang === "th" ? "ชื่อ" : "Name"} *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                    maxLength={80}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {lang === "th" ? "อาชีพ (ไม่บังคับ)" : "Role (optional)"}
                  </label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="input"
                    maxLength={80}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {lang === "th" ? "คะแนน" : "Rating"} *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      aria-label={`${n} star`}
                      className="p-1"
                    >
                      <Star
                        className={`h-7 w-7 transition ${
                          n <= form.rating ? "fill-gold text-gold" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {lang === "th" ? "รีวิว" : "Review"} *
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  maxLength={500}
                  className="input resize-none"
                  required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-gold w-full sm:w-auto sm:justify-center disabled:opacity-60">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {lang === "th" ? "กำลังส่ง..." : "Submitting..."}
                  </>
                ) : (
                  lang === "th" ? "ส่งรีวิว" : "Submit review"
                )}
              </button>
            </form>

            <style>{`
              .input {
                width: 100%;
                border-radius: 0.5rem;
                border: 1px solid var(--color-border);
                background: var(--color-background);
                padding: 0.65rem 0.85rem;
                font-size: 0.95rem;
                outline: none;
                transition: border-color .15s, box-shadow .15s;
              }
              .input:focus {
                border-color: var(--color-gold);
                box-shadow: 0 0 0 3px oklch(0.75 0.14 82 / 0.2);
              }
            `}</style>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {allReviews.map((r, j) => (
            <Reveal key={j} delay={j * 60}>
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-gold text-gold" />)}
                </div>
                <p className="text-sm leading-relaxed">"{r.r}"</p>
                <div className="mt-4">
                  <p className="text-sm font-bold text-gold">{r.n}</p>
                  {r.role && <p className="text-xs text-muted-foreground">{r.role}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {loading && (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        )}
      </div>
    </section>
  );
}
