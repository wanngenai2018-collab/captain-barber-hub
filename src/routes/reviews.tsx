import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight, Star, Loader as Loader2, CircleCheck as CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { getApprovedReviews, submitReview } from "@/lib/reviews.functions";
import type { ReviewInput, ReviewItem } from "@/lib/reviews.schema";

const reviewsQueryOptions = queryOptions({
  queryKey: ["reviews", "approved"],
  queryFn: () => getApprovedReviews(),
});

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${size} ${index < rating ? "fill-gold text-gold" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

function formatReviewDate(value?: string) {
  if (!value) return "Today";
  try {
    return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(value),
    );
  } catch {
    return "Today";
  }
}

function ReviewsErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <section className="section">
      <div className="container-x text-center">
        <h1 className="text-3xl font-bold">Reviews did not load</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <button
          className="btn-gold mt-6"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
      </div>
    </section>
  );
}

function ReviewsNotFoundComponent() {
  return (
    <section className="section">
      <div className="container-x text-center">
        <h1 className="text-3xl font-bold">Reviews not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">ไม่พบหน้ารีวิวที่คุณค้นหา</p>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "รีวิวลูกค้า — กัปตัน Barber" },
      { name: "description", content: "รีวิวจากลูกค้าจริงของ Captain Barber ร้านตัดผมชายเชี่ยวชาญ Fade" },
      { property: "og:title", content: "รีวิวลูกค้า — กัปตัน Barber" },
      { property: "og:description", content: "อ่านรีวิวลูกค้าจริงของ Captain Barber และแชร์ประสบการณ์หลังใช้บริการ" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/reviews" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "รีวิวลูกค้า — กัปตัน Barber" },
      { name: "twitter:description", content: "อ่านรีวิวลูกค้าจริงของ Captain Barber และแชร์ประสบการณ์หลังใช้บริการ" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQueryOptions),
  component: Reviews,
  errorComponent: ReviewsErrorComponent,
  notFoundComponent: ReviewsNotFoundComponent,
});

const seedReviews: ReviewItem[] = [
  { id: "seed-1", n: "คุณเอก", role: "พนักงานออฟฟิศ", rating: 5, r: "ตัด Fade เนี้ยบมากพี่ ให้คำแนะนำทรงที่เหมาะกับหน้า ไปเป็นลูกค้าประจำแน่นอน ราคาก็สบายกระเป๋า" },
  { id: "seed-2", n: "คุณโบ๊ท", role: "นักศึกษา", rating: 5, r: "ร้านสะอาด แอร์เย็น ช่างใจดี ราคาไม่แพง มาตัดทุกเดือน เพื่อน ๆ ถามหมดว่าตัดที่ไหน" },
  { id: "seed-3", n: "คุณจูน", role: "คุณแม่", rating: 5, r: "พาลูกชายมาตัด เด็กติดใจ ไม่ร้องเลย ช่างเก่งจริง ๆ ใจเย็นกับเด็กมาก" },
  { id: "seed-4", n: "คุณต้น", role: "ครีเอเตอร์", rating: 5, r: "ทรงมิดฟาดที่ผมอยากได้เป๊ะตามที่คุยไว้ ทำงานปราณีต ใช้เวลาไม่นานแต่งานออกมาโปร" },
  { id: "seed-5", n: "คุณโอ๊ค", role: "ฟรีแลนซ์", rating: 5, r: "โกนหนวดผ้าร้อนที่นี่ฟินมาก ผ่อนคลายเหมือนไปสปา จะกลับมาแน่นอน" },
  { id: "seed-6", n: "คุณเจมส์", role: "วิศวกร", rating: 5, r: "ย้อมสีบลอนด์ให้ผม สีสวยไม่เพี้ยน ช่างแนะนำการดูแลผมหลังย้อมด้วย ประทับใจ" },
];

function Reviews() {
  const { lang } = useI18n();
  const [i, setI] = useState(0);
  const { data: dbReviews } = useSuspenseQuery(reviewsQueryOptions);
  const queryClient = useQueryClient();
  const submitReviewFn = useServerFn(submitReview);

  const [form, setForm] = useState({ name: "", role: "", rating: 5, message: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState(false);

  const submitMutation = useMutation({
    mutationFn: submitReviewFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: reviewsQueryOptions.queryKey });
      const previous = queryClient.getQueryData<ReviewItem[]>(reviewsQueryOptions.queryKey) ?? [];
      const optimisticId = `instant-${Date.now()}`;
      const optimisticReview: ReviewItem = {
        id: optimisticId,
        n: variables.data.name,
        role: variables.data.role ?? "",
        r: variables.data.message,
        rating: variables.data.rating,
        created_at: new Date().toISOString(),
        optimistic: true,
      };

      queryClient.setQueryData<ReviewItem[]>(reviewsQueryOptions.queryKey, [optimisticReview, ...previous]);
      setFormOk(true);
      setForm({ name: "", role: "", rating: 5, message: "" });
      setI(0);

      return { previous, optimisticId, submitted: variables.data };
    },
    onSuccess: (review, _variables, context) => {
      queryClient.setQueryData<ReviewItem[]>(reviewsQueryOptions.queryKey, (current = []) => {
        const next = current.map((item) => (item.id === context?.optimisticId ? review : item));
        return next.some((item) => item.id === review.id) ? next : [review, ...next];
      });
      queryClient.invalidateQueries({ queryKey: reviewsQueryOptions.queryKey });
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData<ReviewItem[]>(reviewsQueryOptions.queryKey, context.previous);
      }
      if (context?.submitted) {
        setForm({
          name: context.submitted.name,
          role: context.submitted.role ?? "",
          rating: context.submitted.rating,
          message: context.submitted.message,
        });
      }
      setFormOk(false);
      setFormError(lang === "th" ? "ส่งรีวิวไม่สำเร็จ กรุณาลองอีกครั้ง" : "Failed to submit. Please try again.");
    },
  });

  const allReviews: ReviewItem[] = useMemo(() => [...dbReviews, ...seedReviews], [dbReviews]);
  const latestReviews = allReviews.slice(0, 6);

  useEffect(() => {
    if (allReviews.length === 0) return;
    const id = setInterval(() => setI((v) => (v + 1) % allReviews.length), 5000);
    return () => clearInterval(id);
  }, [allReviews.length]);

  const active = allReviews[i] ?? allReviews[0];

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormOk(false);
    if (form.name.trim().length < 2) {
      setFormError(lang === "th" ? "กรุณากรอกชื่อ" : "Please enter your name");
      return;
    }
    if (form.message.trim().length < 5) {
      setFormError(lang === "th" ? "กรุณาเขียนรีวิวอย่างน้อย 5 ตัวอักษร" : "Review must be at least 5 characters");
      return;
    }
    const payload: ReviewInput = {
      name: form.name.trim(),
      role: form.role.trim() || null,
      rating: form.rating,
      message: form.message.trim(),
    };
    submitMutation.mutate({ data: payload });
  };

  return (
    <main className="section">
      <div className="container-x">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Captain Barber Reviews</p>
              <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight">
                {lang === "th" ? "รีวิวลูกค้าแบบเรียลไทม์" : "Real-time customer reviews"}
              </h1>
              <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                {lang === "th"
                  ? "พิมพ์รีวิวของคุณ กดส่ง แล้วรีวิวจะแสดงบนหน้าเว็บทันที พร้อมบันทึกเข้าระบบให้ลูกค้าคนอื่นเห็น"
                  : "Write your review, submit it, and it appears on the website instantly while being saved for future visitors."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-2xl font-bold text-gold">4.9</p>
                <p className="mt-1 text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-2xl font-bold text-gold">320+</p>
                <p className="mt-1 text-xs text-muted-foreground">Reviews</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-2xl font-bold text-gold">Live</p>
                <p className="mt-1 text-xs text-muted-foreground">Instant</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={80}>
            <section id="write-review" className="rounded-2xl border border-gold/30 bg-card p-6 md:p-8 shadow-[var(--shadow-elegant)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">Write Review</p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {lang === "th" ? "เขียนรีวิวของคุณ" : "Share your experience"}
                  </h2>
                </div>
                <div className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">
                  {lang === "th" ? "ขึ้นเว็บทันที" : "Instant post"}
                </div>
              </div>

              {formOk && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold/60 bg-gold/10 p-4 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                  <p className="font-semibold text-gold">
                    {lang === "th"
                      ? "รีวิวของคุณขึ้นบนเว็บแล้ว กำลังบันทึกให้เรียบร้อย"
                      : "Your review is live now and is being saved."}
                  </p>
                </div>
              )}

              {formError && (
                <div className="mt-5 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  {formError}
                </div>
              )}

              <form onSubmit={submit} noValidate className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      {lang === "th" ? "ชื่อ" : "Name"} *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="review-input"
                      maxLength={80}
                      placeholder={lang === "th" ? "เช่น คุณต้น" : "Your name"}
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
                      className="review-input"
                      maxLength={80}
                      placeholder={lang === "th" ? "เช่น ฟรีแลนซ์" : "Your role"}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {lang === "th" ? "คะแนน" : "Rating"} *
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, rating: n })}
                        aria-label={`${n} star`}
                        className="rounded-full p-1.5 transition hover:bg-gold/10"
                      >
                        <Star
                          className={`h-8 w-8 transition ${
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
                    rows={5}
                    maxLength={500}
                    className="review-input resize-none"
                    placeholder={lang === "th" ? "เล่าประสบการณ์หลังใช้บริการ..." : "Tell us about your visit..."}
                    required
                  />
                  <p className="mt-1 text-right text-xs text-muted-foreground">{form.message.length}/500</p>
                </div>

                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="btn-gold w-full justify-center disabled:opacity-60"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {lang === "th" ? "กำลังบันทึก..." : "Saving..."}
                    </>
                  ) : (
                    lang === "th" ? "ส่งรีวิวให้ขึ้นเว็บทันที" : "Post review instantly"
                  )}
                </button>
              </form>
            </section>
          </Reveal>

          <Reveal delay={120}>
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">Featured</p>
                  <h2 className="mt-2 text-2xl font-bold">{lang === "th" ? "รีวิวล่าสุด" : "Latest review"}</h2>
                </div>
                <Stars rating={active?.rating ?? 5} size="h-5 w-5" />
              </div>

              {active && (
                <div className="mt-8">
                  <blockquote className="text-xl md:text-2xl font-semibold leading-relaxed">“{active.r}”</blockquote>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-gold">{active.n}</p>
                      <p className="text-sm text-muted-foreground">
                        {[active.role, formatReviewDate(active.created_at)].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {active.optimistic && (
                      <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">
                        {lang === "th" ? "กำลังบันทึก" : "Saving"}
                      </span>
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setI((i - 1 + allReviews.length) % allReviews.length)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition hover:border-gold hover:text-gold"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setI((i + 1) % allReviews.length)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition hover:border-gold hover:text-gold"
                        aria-label="Next"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {latestReviews.map((review, index) => (
                        <button
                          key={review.id ?? index}
                          onClick={() => setI(index)}
                          aria-label={`Go to review ${index + 1}`}
                          className={`h-1.5 rounded-full transition-all ${index === i ? "w-8 bg-gold" : "w-2 bg-border"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </Reveal>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">Customer Feed</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold">
                {lang === "th" ? "ทุกเสียงจากลูกค้า" : "All customer voices"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === "th" ? `${allReviews.length} รีวิวบนหน้าเว็บ` : `${allReviews.length} reviews on this page`}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allReviews.map((review, index) => (
              <Reveal key={review.id ?? index} delay={(index % 6) * 45}>
                <article className="h-full rounded-xl border border-border bg-card p-6 transition hover:border-gold/50">
                  <div className="flex items-start justify-between gap-3">
                    <Stars rating={review.rating} />
                    {review.optimistic && (
                      <span className="rounded-full border border-gold/40 px-2.5 py-1 text-xs font-semibold text-gold">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed">“{review.r}”</p>
                  <footer className="mt-5 border-t border-border pt-4">
                    <p className="text-sm font-bold text-gold">{review.n}</p>
                    <p className="text-xs text-muted-foreground">
                      {[review.role, formatReviewDate(review.created_at)].filter(Boolean).join(" · ")}
                    </p>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <style>{`
          .review-input {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid var(--color-border);
            background: var(--color-background);
            padding: 0.75rem 0.9rem;
            font-size: 0.95rem;
            outline: none;
            transition: border-color .15s, box-shadow .15s;
          }
          .review-input:focus {
            border-color: var(--color-gold);
            box-shadow: 0 0 0 3px oklch(0.75 0.14 82 / 0.2);
          }
        `}</style>
      </div>
    </main>
  );
}
