import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Facebook, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "จองคิว — กัปตัน Barber" },
      { name: "description", content: "จองคิวตัดผมที่ Captain Barber ออนไลน์ สะดวก รวดเร็ว ยืนยันคิวภายใน 15 นาที" },
      { property: "og:title", content: "จองคิว — กัปตัน Barber" },
      { property: "og:url", content: "/booking" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: Booking,
});

const schema = z.object({
  name: z.string().trim().min(2, "กรุณากรอกชื่อ").max(80),
  phone: z.string().trim().regex(/^[0-9\-+\s()]{8,20}$/, "เบอร์โทรไม่ถูกต้อง"),
  date: z.string().min(1, "เลือกวันที่"),
  time: z.string().min(1, "เลือกเวลา"),
  service: z.string().min(1, "เลือกบริการ"),
  note: z.string().max(500).optional(),
});

function Booking() {
  const { tr, lang } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  const services = lang === "th"
    ? ["ตัดผมเด็ก (฿80)", "ตัดผมผู้ใหญ่ / Fade (฿100)", "โกนหนวด (฿80)", "เซ็ตผม (฿100)", "ย้อมสี (฿100-300)"]
    : ["Kids Haircut (฿80)", "Adult / Fade (฿100)", "Hot-Towel Shave (฿80)", "Hair Styling (฿100)", "Hair Color (฿100-300)"];

  const timeSlots: string[] = [];
  for (let h = 9; h <= 19; h++) {
    timeSlots.push(`${String(h).padStart(2, "0")}:00`);
    timeSlots.push(`${String(h).padStart(2, "0")}:30`);
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setOk(true);
    e.currentTarget.reset();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="section">
      <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Booking</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">{tr("booking_title")}</h1>
            <p className="mt-4 text-muted-foreground max-w-lg">{tr("booking_sub")}</p>

            {ok && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/60 bg-gold/10 p-4 text-sm">
                <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gold">{tr("f_success")}</p>
                </div>
              </div>
            )}

            <form onSubmit={submit} noValidate className="mt-8 grid gap-4 md:grid-cols-2 rounded-2xl border border-border bg-card p-6 md:p-8">
              <Field label={tr("f_name")} name="name" error={errors.name} required />
              <Field label={tr("f_phone")} name="phone" type="tel" placeholder="099-999-9999" error={errors.phone} required />
              <Field label={tr("f_date")} name="date" type="date" min={today} error={errors.date} required />
              <div>
                <label className="mb-1.5 block text-sm font-medium">{tr("f_time")} *</label>
                <select name="time" required className="input" defaultValue="">
                  <option value="" disabled>{lang === "th" ? "เลือกเวลา" : "Select time"}</option>
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.time && <p className="mt-1 text-xs text-destructive">{errors.time}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">{tr("f_service")} *</label>
                <select name="service" required className="input" defaultValue="">
                  <option value="" disabled>{lang === "th" ? "เลือกบริการ" : "Select service"}</option>
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className="mt-1 text-xs text-destructive">{errors.service}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">{tr("f_note")}</label>
                <textarea name="note" rows={4} maxLength={500} className="input resize-none" />
              </div>
              <button type="submit" className="btn-gold md:col-span-2 mt-2">{tr("f_submit")}</button>
            </form>

            <style>{`
              .input {
                width: 100%;
                border-radius: 0.5rem;
                border: 1px solid var(--color-border);
                background: var(--color-background);
                padding: 0.65rem 0.85rem;
                font-size: 0.95rem;
                outline: none;
                transition: border-color .15s, box-shadow .15s;
              }
              .input:focus {
                border-color: var(--color-gold);
                box-shadow: 0 0 0 3px oklch(0.75 0.14 82 / 0.2);
              }
            `}</style>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <aside className="rounded-2xl border border-border bg-card p-6 md:p-8 h-fit">
            <h3 className="text-lg font-semibold">
              {lang === "th" ? "หรือติดต่อโดยตรง" : "Or reach us directly"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "th" ? "ตอบเร็วที่สุดใน 15 นาที" : "We reply within 15 minutes."}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a href={SITE.lineUrl} className="flex items-center gap-3 rounded-lg bg-[#06C755] px-4 py-3 font-semibold text-white hover:brightness-110">
                <MessageCircle className="h-5 w-5" /> LINE {SITE.line}
              </a>
              <a href={`tel:${SITE.phoneTel}`} className="btn-gold justify-start">
                <Phone className="h-5 w-5" /> {SITE.phone}
              </a>
              <a href={SITE.messenger} className="btn-outline-gold justify-start">
                <Facebook className="h-5 w-5" /> Messenger
              </a>
            </div>
            <div className="mt-6 rounded-lg bg-background p-4 text-sm">
              <p className="font-semibold text-gold">{tr("footer_hours")}</p>
              <p className="mt-1 text-muted-foreground">{lang === "th" ? "ไม่มีวันหยุด" : "Open every day"}</p>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", error, required, placeholder, min }: {
  label: string; name: string; type?: string; error?: string; required?: boolean; placeholder?: string; min?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}{required && " *"}</label>
      <input name={name} type={type} className="input" required={required} placeholder={placeholder} min={min} />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
