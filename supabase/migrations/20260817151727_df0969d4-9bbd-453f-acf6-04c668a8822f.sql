CREATE TABLE public.barbers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name_th text,
  name_en text,
  role_th text,
  role_en text,
  bio_th text,
  bio_en text,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.barbers TO anon;
GRANT SELECT ON public.barbers TO authenticated;
GRANT ALL ON public.barbers TO service_role;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read barbers" ON public.barbers FOR SELECT USING (true);

CREATE TABLE public.gallery_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_th text NOT NULL,
  title_en text NOT NULL,
  category text NOT NULL,
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published gallery items" ON public.gallery_items FOR SELECT USING (is_published = true);

ALTER TABLE public.reviews ADD COLUMN reviewer_type text NOT NULL DEFAULT 'general';
ALTER TABLE public.reviews ADD CONSTRAINT reviews_reviewer_type_check CHECK (reviewer_type IN ('customer', 'general'));

CREATE TABLE public.review_stats (
  id boolean NOT NULL DEFAULT true PRIMARY KEY,
  total_reviews integer NOT NULL DEFAULT 0,
  rating_sum bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT review_stats_singleton CHECK (id = true)
);
GRANT SELECT ON public.review_stats TO anon;
GRANT SELECT ON public.review_stats TO authenticated;
GRANT ALL ON public.review_stats TO service_role;
ALTER TABLE public.review_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read review stats" ON public.review_stats FOR SELECT USING (true);

INSERT INTO public.review_stats (id, total_reviews, rating_sum)
SELECT true, count(*)::int, COALESCE(sum(rating), 0) FROM public.reviews WHERE approved = true;

CREATE OR REPLACE FUNCTION public.handle_new_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.review_stats (id, total_reviews, rating_sum, updated_at)
  VALUES (true, 1, NEW.rating, now())
  ON CONFLICT (id) DO UPDATE
    SET total_reviews = public.review_stats.total_reviews + 1,
        rating_sum = public.review_stats.rating_sum + NEW.rating,
        updated_at = now();

  DELETE FROM public.reviews
  WHERE id IN (
    SELECT id FROM public.reviews
    WHERE approved = true
    ORDER BY created_at DESC, id DESC
    OFFSET 10
  );

  RETURN NULL;
END;
$$;

CREATE TRIGGER reviews_after_insert
AFTER INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_new_review();

INSERT INTO public.barbers (slug, name_th, name_en, role_th, role_en, bio_th, bio_en, image_url, display_order, is_published)
VALUES
  ('captain', 'ช่างกัปตัน', 'Captain', 'เจ้าของร้าน / Master Barber', 'Owner / Master Barber',
   'ผู้ก่อตั้งร้านกัปตัน Barber เมื่อ 3-4 ปีที่แล้ว เชี่ยวชาญทรง Fade ทุกระดับ ตั้งแต่ Low, Mid, High, Skin Fade รวมถึง Pompadour, Undercut, Two-Block และทรงนักเรียน ให้คำแนะนำทรงผมตามรูปหน้าและไลฟ์สไตล์ของลูกค้าทุกครั้ง',
   'Founder of Captain Barber, opened 3-4 years ago. Specializes in every level of fade — low, mid, high and skin — plus pompadours, undercuts, two-blocks and school cuts, always with a personal consultation.',
   '/src/assets/owner.jpg', 1, true),
  ('barber-2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, false),
  ('barber-3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, false);

INSERT INTO public.gallery_items (title_th, title_en, category, before_image_url, after_image_url, display_order)
VALUES
  ('สกินเฟด + ปอมปาดัวร์', 'Skin Fade + Pompadour', 'fade',
   '/__l5e/assets-v1/7fb530bb-8085-4680-b2ed-93af0b195d96/ba-p1-before.jpg',
   '/__l5e/assets-v1/555080a4-3563-4e05-954f-347829394ba6/ba-p1-after.jpg', 1),
  ('มิดเฟด + แสกข้าง', 'Mid Fade + Side Part', 'fade',
   '/__l5e/assets-v1/04971f4f-8de3-447f-ab24-01e8605e69c0/ba-p2-before.jpg',
   '/__l5e/assets-v1/8ce6c086-943f-4034-9780-6fdca0715c6b/ba-p2-after.jpg', 2),
  ('ทรงนักเรียน / ทรงเด็ก', 'Kids School Cut', 'cut',
   '/__l5e/assets-v1/dd277978-cec7-470c-a0f8-e4e3cfda7c69/ba-p3-before.jpg',
   '/__l5e/assets-v1/3e17f246-baee-45be-817f-a5bd6ef798e9/ba-p3-after.jpg', 3),
  ('ย้อมสีบลอนด์แอช', 'Ash Blonde Color', 'color',
   '/__l5e/assets-v1/3e89b398-52a3-4fab-b622-4ab0612f4c0b/ba-p4-before.jpg',
   '/__l5e/assets-v1/5cc8312a-4f23-4115-8452-24ceaba52310/ba-p4-after.jpg', 4);