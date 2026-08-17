import { z } from "zod";

export const reviewerTypes = ["customer", "general"] as const;
export type ReviewerType = (typeof reviewerTypes)[number];

export const reviewInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  role: z.string().trim().max(80).nullable().optional(),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(5).max(500),
  reviewer_type: z.enum(reviewerTypes),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;

export type ReviewItem = {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  reviewer_type: ReviewerType;
  created_at?: string;
  optimistic?: boolean;
};

export type ReviewStats = {
  total: number;
  average: number;
};

export type ReviewsPayload = {
  reviews: ReviewItem[];
  stats: ReviewStats;
};

export const REVIEW_FEED_LIMIT = 10;
