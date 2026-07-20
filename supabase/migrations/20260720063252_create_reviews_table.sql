/*
# Create reviews table (single-tenant, no auth)

1. Purpose
- ให้ลูกค้าสามารถพิมพ์รีวิวและส่งขึ้นเว็บได้จริง รีวิวจะแสดงบนหน้า /reviews

2. New Tables
- `reviews`
  - `id` (uuid, primary key)
  - `name` (text, not null) — ชื่อผู้รีวิว
  - `role` (text, nullable) — อาชีพ/ตำแหน่ง (optional)
  - `rating` (int, not null, 1-5) — คะแนนดาว
  - `message` (text, not null) — เนื้อรีวิว
  - `approved` (boolean, default false) — รอแอดมินอนุมัติก่อนแสดงบนเว็บ (ป้องกันสแปม)
  - `created_at` (timestamptz, default now())

3. Security
- Enable RLS on `reviews`.
- SELECT: ใครก็อ่านรีวิวที่ approved ได้ (anon + authenticated)
- INSERT: ใครก็เขียนรีวิวใหม่ได้ (anon + authenticated) — แต่ approved เริ่มต้นเป็น false
- ไม่อนุญาต UPDATE / DELETE ผ่าน anon (ป้องกันการแก้ไข/ลบจาก frontend)

4. Notes
- แอดมินสามารถเข้า Supabase dashboard เพื่ออนุมัติรีวิว (set approved=true) ผ่าน service role
- รีวิวที่ยังไม่ approved จะไม่แสดงบนเว็บ
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  message text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_approved_reviews" ON reviews;
CREATE POLICY "anon_read_approved_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (approved = true);

DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS reviews_approved_created_idx ON reviews (approved, created_at DESC);
