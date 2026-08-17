import { createServerFn } from "@tanstack/react-start";
import { createPublicReviewsClient } from "./reviews.server";

export type Barber = {
  id: string;
  slug: string;
  name_th: string | null;
  name_en: string | null;
  role_th: string | null;
  role_en: string | null;
  bio_th: string | null;
  bio_en: string | null;
  image_url: string | null;
  is_published: boolean;
};

export type GalleryItem = {
  id: string;
  title_th: string;
  title_en: string;
  category: string;
  before_image_url: string;
  after_image_url: string;
};

export const getBarbers = createServerFn({ method: "GET" }).handler(async (): Promise<Barber[]> => {
  const supabase = createPublicReviewsClient();
  const { data, error } = await supabase
    .from("barbers")
    .select("id, slug, name_th, name_en, role_th, role_en, bio_th, bio_en, image_url, is_published")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load barbers", error);
    throw new Error("Could not load barbers.");
  }

  return data ?? [];
});

export const getGalleryItems = createServerFn({ method: "GET" }).handler(async (): Promise<GalleryItem[]> => {
  const supabase = createPublicReviewsClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, title_th, title_en, category, before_image_url, after_image_url")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load gallery items", error);
    throw new Error("Could not load gallery.");
  }

  return data ?? [];
});
