import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, Loader as Loader2, CircleCheck as CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { getReviewsPayload, submitReview } from "@/lib/reviews.functions";
import {
  REVIEW_FEED_LIMIT,
  type ReviewInput,
  type ReviewItem,
  type ReviewerType,
  type ReviewsPayload,
} from "@/lib/reviews.schema";

const reviewsQueryOptions = queryOptions({
  queryKey: ["reviews", "payload"],
  queryFn: () => getReviewsPayload(),
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
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(value),
    );
  } catch {
    return "";
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
      { name: "description", content: "รีวิวจากลูกค้าจริงของ Captain Barber ร้านตัดผมชายเชี่ยวชาญ Fade ให้คะแนนและเขียนรีวิวได้ทันที" },
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

type SubmitReviewVariables = { data: ReviewInput };
type SubmitReviewContext = {
  previous: ReviewsPayload | undefined;
  optimisticId: string;
  submitted: ReviewInput;
};

export function reviewerTypeLabel(type: ReviewerType, lang: string) {
  if (type === "customer") return lang === "th" ? "เคยใช้บริการแล้ว" : "Verified visit";
  return lang === "th" ? "ลูกค้าทั่วไป" : "General";
}

function Reviews() {
  const { lang } = useI18n();
  const { data: payload } = useSuspenseQuery(reviewsQueryOptions);
  const queryClient = useQueryClient();
  const submitReviewFn = useServerFn(submitReview);

  const [form, setForm] = useState({
    name: "",
    role: "",
    rating: 5,
    message: "",
    reviewer_type: "customer" as ReviewerType,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState(false);

  const submitMutation = useMutation<ReviewItem, Error, SubmitReviewVariables, SubmitReviewContext>({
    mutationFn: (variables) => submitReviewFn(variables),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: reviewsQueryOptions.queryKey });
      const previous = queryClient.getQueryData<ReviewsPayload>(reviewsQueryOptions.queryKey);
      const optimisticId = `instant-${Date.now()}`;
      const optimisticReview: ReviewItem = {
        id: optimisticId,
        name: variables.data.name,
        role: variables.data.role ?? "",
        message: variables.data.message,
        rating: variables.data.rating,
        reviewer_type: variables.data.reviewer_type,
        created_at: new Date().toISOString(),
        optimistic: true,
      };

      queryClient.setQueryData<ReviewsPayload>(reviewsQueryOptions.queryKey, (current) => {
        const base = current ?? { reviews: [], stats: { total: 0, average: 0 } };
        const reviews = [optimisticReview, ...base.reviews].slice(0, REVIEW_FEED_LIMIT);
        const total = base.stats.total + 1;
        const sum = base.stats.average * base.stats.total + variables.data.rating;
        return { reviews, stats: { total, average: Math.round((sum / total) * 10) / 10 } };
      });

      setFormOk(true);
      setForm({ name: "", role: "", rating: 5, message: "", reviewer_type: variables.data.reviewer_type });

      return { previous, optimisticId, submitted: variables.data };
    },
    onSuccess: (review, _variables, context) => {
      queryClient.setQueryData<ReviewsPayload>(reviewsQueryOptions.queryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          reviews: current.reviews.map((item) => (item.id === context?.optimisticId ? review : item)),
        };
      });
      queryClient.invalidateQueries({ queryKey: reviewsQueryOptions.queryKey });
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData<ReviewsPayload>(reviewsQueryOptions.queryKey, context.previous);
      }
      if (context?.submitted) {
        setForm({
          name: context.submitted.name,
          role: context.submitted.role ?? "",
          rating: context.submitted.rating,
          message: context.submitted.message,
          reviewer_type: context.submitted.reviewer_type,
        });
      }
      setFormOk(false);
      setFormError(lang === "th" ? "ส่งรีวิวไม่สำเร็จ กรุณาลองอีกครั้ง" : "Failed to submit. Please try again.");
    },
  });

  const reviews = payload.reviews;
  const stats = payload.stats;

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
    const data: ReviewInput = {
      name: form.name.trim(),
      role: form.role.trim() || null,
      rating: form.rating,
      message: form.message.trim(),
      reviewer_type: form.reviewer_type,
    };
    submitMutation.mutate({ data });
  };

  return (
    <main className="section">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Captain Barber Reviews</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight">
              {lang === "th" ? "รีวิวลูกค้าแบบเรียลไทม์" : "Real-time customer reviews"}
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              {lang === "th"
                ? `พิมพ์รีวิวของคุณ กดส่ง แล้วรีวิวจะแสดงบนหน้าเว็บทันที หน้านี้แสดงรีวิวล่าสุด ${REVIEW_FEED_LIMIT} รายการ แต่คะแนนสะสมทั้งหมดยังถูกเก็บไว้`
                : `Write your review and it appears instantly. This page shows the latest ${REVIEW_FEED_LIMIT} reviews while all ratings stay in the running average.`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-gold">{stats.total > 0 ? stats.average.toFixed(1) : "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{lang === "th" ? "คะแนนเฉลี่ย" : "Average"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-gold">{stats.total}</p>
              <p className="mt-1 text-xs text-muted-foreground">{lang === "th" ? "รีวิวทั้งหมด" : "Total reviews"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-gold">{reviews.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">{lang === "th" ? "แสดงล่าสุด" : "Showing"}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section
            id="write-review"
            className="rounded-2xl border border-gold/30 bg-card p-6 md:p-8 shadow-[var(--shadow-elegant)]"
          >
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
                  {lang === "th" ? "รีวิวของคุณขึ้นบนเว็บแล้ว" : "Your review is live now."}
                </p>
              </div>
            )}

            {formError && (
              <div className="mt-5 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {formError}
              </div>
            )}

            <form onSubmit={submit} noValidate className="mt-6 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {lang === "th" ? "ประเภทผู้รีวิว" : "Reviewer type"} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["customer", "general"] as ReviewerType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, reviewer_type: type })}
                      aria-pressed={form.reviewer_type === type}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                        form.reviewer_type === type
                          ? "border-gold bg-gold text-gold-foreground"
                          : "border-border hover:border-gold hover:text-gold"
                      }`}
                    >
                      {reviewerTypeLabel(type, lang)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{lang === "th" ? "ชื่อ" : "Name"} *</label>
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
                <label className="mb-2 block text-sm font-medium">{lang === "th" ? "คะแนน" : "Rating"} *</label>
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
                <label className="mb-1.5 block text-sm font-medium">{lang === "th" ? "รีวิว" : "Review"} *</label>
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
                ) : lang === "th" ? (
                  "ส่งรีวิวให้ขึ้นเว็บทันที"
                ) : (
                  "Post review instantly"
                )}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">Customer Feed</p>
                <h2 className="mt-2 text-2xl font-bold">
                  {lang === "th" ? `รีวิวล่าสุด ${REVIEW_FEED_LIMIT} รายการ` : `Latest ${REVIEW_FEED_LIMIT} reviews`}
                </h2>
              </div>
              {stats.total > 0 && (
                <div className="flex items-center gap-2">
                  <Stars rating={Math.round(stats.average)} size="h-5 w-5" />
                  <span className="text-sm font-semibold text-gold">{stats.average.toFixed(1)}</span>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <p className="mt-8 rounded-xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                {lang === "th" ? "ยังไม่มีรีวิว มาเป็นคนแรกกันเลย" : "No reviews yet — be the first."}
              </p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {reviews.map((review, index) => (
                  <Reveal key={review.id} delay={(index % 6) * 45}>
                    <article className="h-full rounded-xl border border-border bg-background p-5 transition hover:border-gold/50">
                      <div className="flex items-start justify-between gap-3">
                        <Stars rating={review.rating} />
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                            review.reviewer_type === "customer"
                              ? "border-gold/50 text-gold"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {reviewerTypeLabel(review.reviewer_type, lang)}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed">“{review.message}”</p>
                      <footer className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
                        <div>
                          <p className="text-sm font-bold text-gold">{review.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {[review.role, formatReviewDate(review.created_at)].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        {review.optimistic && (
                          <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                            Live
                          </span>
                        )}
                      </footer>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        </div>

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
