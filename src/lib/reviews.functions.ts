import { createServerFn } from "@tanstack/react-start";
import { createPublicReviewsClient } from "./reviews.server";
import { reviewInputSchema, type ReviewItem } from "./reviews.schema";

export const getApprovedReviews = createServerFn({ method: "GET" }).handler(async (): Promise<ReviewItem[]> => {
  const supabase = createPublicReviewsClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, role, rating, message, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load reviews", error);
    throw new Error("Could not load reviews.");
  }

  return (data ?? []).map((review) => ({
    id: review.id,
    n: review.name,
    role: review.role ?? "",
    r: review.message,
    rating: review.rating,
    created_at: review.created_at,
  }));
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
        approved: true,
      })
      .select("id, name, role, rating, message, created_at")
      .single();

    if (error) {
      console.error("Failed to submit review", error);
      throw new Error("Could not submit review.");
    }

    return {
      id: review.id,
      n: review.name,
      role: review.role ?? "",
      r: review.message,
      rating: review.rating,
      created_at: review.created_at,
    };
  });