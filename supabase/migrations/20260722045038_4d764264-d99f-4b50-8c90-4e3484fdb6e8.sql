GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;

CREATE POLICY "Anyone can read approved reviews"
ON public.reviews
FOR SELECT
TO public
USING (approved = true);

CREATE POLICY "Anyone can submit a review"
ON public.reviews
FOR INSERT
TO public
WITH CHECK (
  approved = true
  AND length(trim(name)) >= 2
  AND length(trim(message)) >= 5
  AND rating BETWEEN 1 AND 5
);