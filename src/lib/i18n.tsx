import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "th" | "en";

type Dict = Record<string, { th: string; en: string }>;

export const t: Dict = {
  // nav
  nav_home: { th: "หน้าแรก", en: "Home" },
  nav_about: { th: "เกี่ยวกับร้าน", en: "About" },
  nav_services: { th: "บริการ", en: "Services" },
  nav_gallery: { th: "ผลงาน", en: "Gallery" },
  nav_reviews: { th: "รีวิว", en: "Reviews" },
  nav_contact: { th: "ติดต่อ", en: "Contact" },
  nav_booking: { th: "จองคิว", en: "Book" },

  // hero
  hero_kicker: { th: "CLASSIC BARBER · MODERN GENTLEMAN", en: "CLASSIC BARBER · MODERN GENTLEMAN" },
  hero_title: { th: "กัปตัน Barber", en: "Captain Barber" },
  hero_sub: {
    th: "กัปตันผู้นำเทรนด์ทรงผมเท่ ๆ ใกล้บ้านคุณ",
    en: "Your neighborhood captain of sharp, modern haircuts.",
  },
  hero_book: { th: "จองคิว", en: "Book Now" },
  hero_call: { th: "โทรเลย", en: "Call Us" },
  hero_line: { th: "แอด LINE", en: "LINE" },

  // sections
  usp_title: { th: "ทำไมต้อง กัปตัน Barber", en: "Why Captain Barber" },
  usp_1_t: { th: "เชี่ยวชาญ Fade", en: "Fade Specialist" },
  usp_1_d: { th: "โกน Fade ละเอียด เนี้ยบทุกเส้น ด้วยประสบการณ์ 3-4 ปี", en: "Precision fades, crisp lines, 3-4 years of craft." },
  usp_2_t: { th: "แนะนำทรงเฉพาะบุคคล", en: "Personal Style Advice" },
  usp_2_d: { th: "วิเคราะห์รูปหน้า จัดทรงที่ใช่กับคุณคนเดียว", en: "Face-shape analysis, one style tailored to you." },
  usp_3_t: { th: "บริการ VIP", en: "VIP Experience" },
  usp_3_d: { th: "ห้องแอร์เย็นสบาย สะอาด เครื่องมือฆ่าเชื้อทุกครั้ง", en: "Air-conditioned lounge, clean tools, every visit." },
  usp_4_t: { th: "ราคาเข้าถึงง่าย", en: "Fair Pricing" },
  usp_4_d: { th: "เริ่มต้น 80 บาท คุ้มค่าเกินราคา", en: "From ฿80 — premium cuts, honest prices." },

  services_title: { th: "บริการยอดนิยม", en: "Popular Services" },
  gallery_title: { th: "ผลงาน Before & After", en: "Before & After" },
  reviews_title: { th: "รีวิวจากลูกค้าจริง", en: "Real Customer Reviews" },
  promo_title: { th: "โปรโมชั่นเดือนนี้", en: "This Month's Promo" },
  promo_desc: {
    th: "นักเรียน-นักศึกษา แสดงบัตร รับส่วนลด 20 บาท ทุกวันจันทร์-พฤหัสบดี",
    en: "Students get ฿20 off Mon-Thu — just show your student ID.",
  },

  // footer
  footer_hours: { th: "เปิดทุกวัน 09:00 - 20:00", en: "Open daily 09:00 - 20:00" },
  footer_rights: { th: "สงวนลิขสิทธิ์", en: "All rights reserved" },

  // booking
  booking_title: { th: "จองคิวออนไลน์", en: "Book Your Appointment" },
  booking_sub: {
    th: "กรอกข้อมูลด้านล่าง ทีมงานจะยืนยันคิวทาง LINE / โทรกลับ ภายใน 15 นาที",
    en: "Fill in the form. We'll confirm via LINE or a callback within 15 minutes.",
  },
  f_name: { th: "ชื่อ - นามสกุล", en: "Full name" },
  f_phone: { th: "เบอร์โทร", en: "Phone number" },
  f_date: { th: "วันที่", en: "Date" },
  f_time: { th: "เวลา", en: "Time" },
  f_service: { th: "บริการ", en: "Service" },
  f_note: { th: "หมายเหตุ (ทรงที่ต้องการ, ช่างที่ชอบ)", en: "Notes (desired style, preferred barber)" },
  f_submit: { th: "ยืนยันจองคิว", en: "Confirm Booking" },
  f_success: { th: "จองคิวสำเร็จ! เราจะติดต่อกลับเพื่อยืนยันเวลา", en: "Booking received! We'll contact you to confirm." },

  contact_title: { th: "ติดต่อร้าน", en: "Contact Us" },
  about_title: { th: "เรื่องราวของกัปตัน", en: "Our Story" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (k: keyof typeof t) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("cb-lang") : null;
    if (stored === "th" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("cb-lang", l);
  };

  const tr = (k: keyof typeof t) => t[k]?.[lang] ?? String(k);

  return <Ctx.Provider value={{ lang, setLang, tr }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used within I18nProvider");
  return c;
}
