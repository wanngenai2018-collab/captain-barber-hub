import { createServerFn } from "@tanstack/react-start";
import { createPublicReviewsClient } from "./reviews.server";
import {
  REVIEW_FEED_LIMIT,
  reviewInputSchema,
  type ReviewItem,
  type ReviewStats,
  type ReviewerType,
  type ReviewsPayload,
} from "./reviews.schema";

type ReviewRow = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  message: string;
  reviewer_type: string;
  created_at: string;
};

function toReviewItem(row: ReviewRow): ReviewItem {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? "",
    message: row.message,
    rating: row.rating,
    reviewer_type: (row.reviewer_type === "customer" ? "customer" : "general") as ReviewerType,
    created_at: row.created_at,
  };
}

export const getReviewsPayload = createServerFn({ method: "GET" }).handler(async (): Promise<ReviewsPayload> => {
  const supabase = createPublicReviewsClient();

  const [reviewsResult, statsResult] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, name, role, rating, message, reviewer_type, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(REVIEW_FEED_LIMIT),
    supabase.from("review_stats").select("total_reviews, rating_sum").maybeSingle(),
  ]);

  if (reviewsResult.error) {
    console.error("Failed to load reviews", reviewsResult.error);
    throw new Error("Could not load reviews.");
  }
  if (statsResult.error) {
    console.error("Failed to load review stats", statsResult.error);
    throw new Error("Could not load review stats.");
  }

  const total = statsResult.data?.total_reviews ?? 0;
  const ratingSum = Number(statsResult.data?.rating_sum ?? 0);
  const stats: ReviewStats = {
    total,
    average: total > 0 ? Math.round((ratingSum / total) * 10) / 10 : 0,
  };

  return { reviews: (reviewsResult.data ?? []).map(toReviewItem), stats };
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data) => reviewInputSchema.parse(data))
  .handler(async ({ data }): Promise<ReviewItem> => {
    const supabase = createPublicReviewsClient();
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        name: data.name,
        role: data.role || null,
        rating: data.rating,
        message: data.message,
        reviewer_type: data.reviewer_type,
        approved: true,
      })
      .select("id, name, role, rating, message, reviewer_type, created_at")
      .single();

    if (error) {
      console.error("Failed to submit review", error);
      throw new Error("Could not submit review.");
    }

    return toReviewItem(review as ReviewRow);
  });
