สาเหตุที่เห็นตอนนี้: หน้า `/reviews` ยังเรียก backend client จากฝั่ง browser โดยตรง และ console ยืนยันว่า browser bundle หา `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` ไม่เจอ จึงพังก่อนส่งหรือโหลดรีวิวได้

แผนแก้:
1. ย้ายการโหลดและส่งรีวิวออกจาก browser client ไปเป็น TanStack server functions
   - สร้างฟังก์ชัน `getApprovedReviews` สำหรับอ่านรีวิวที่อนุมัติแล้ว
   - สร้างฟังก์ชัน `submitReview` สำหรับส่งรีวิวใหม่ พร้อม validate ชื่อ/ข้อความ/rating
   - อ่านค่า backend env เฉพาะใน server function เท่านั้น

2. ปรับหน้า `/reviews` ให้ไม่ import backend browser client โดยตรง
   - โหลดรีวิวผ่าน route loader + TanStack Query เพื่อให้หน้าเปิดมาเสถียรกว่า
   - ส่งรีวิวผ่าน server function และแสดงรีวิวใหม่แบบ optimistic หลังส่งสำเร็จ
   - ถ้าส่งไม่ผ่าน ให้หยุดหมุนและโชว์ข้อความ error ชัดเจน

3. ตรวจสิทธิ์ตาราง `reviews` ในฐานข้อมูล
   - ตรวจว่า public read/insert policy และ GRANT ยังอยู่ครบ
   - ถ้าขาด จะเพิ่ม migration เฉพาะสิทธิ์ที่จำเป็น ไม่เปลี่ยนโครงสร้างข้อมูล

4. ตรวจ metadata และ route boundary ของหน้ารีวิวหลังเพิ่ม loader
   - เพิ่ม error boundary / not found boundary ตาม pattern ของ TanStack Start
   - เติม metadata ที่จำเป็นของหน้า `/reviews` ให้ครบโดยไม่เปลี่ยนหน้าตาเว็บ

5. ทดสอบหลังแก้
   - เปิด `/reviews` ให้ไม่เกิด blank/error
   - ส่งรีวิวทดสอบแล้วต้องหยุดหมุน แสดงผลบนหน้า และบันทึกลงฐานข้อมูล