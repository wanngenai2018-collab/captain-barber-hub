import { z } from "zod";

export const reviewInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  role: z.string().trim().max(80).nullable().optional(),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(5).max(500),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;

export type ReviewItem = {
  n: string;
  role: string;
  r: string;
  rating: number;
  created_at?: string;
};