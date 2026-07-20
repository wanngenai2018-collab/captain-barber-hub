import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, MapPin, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "ติดต่อร้าน — กัปตัน Barber" },
      { name: "description", content: "ติดต่อ Captain Barber โทร 099-999-9999, LINE @captainbarber, เปิดทุกวัน 09:00-20:00" },
      { property: "og:title", content: "ติดต่อร้าน — กัปตัน Barber" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const { tr, lang } = useI18n();

  const cards = [
    { icon: Phone, label: lang === "th" ? "โทร" : "Phone", value: SITE.phone, href: `tel:${SITE.phoneTel}` },
    { icon: MessageCircle, label: "LINE", value: SITE.line, href: SITE.lineUrl },
    { icon: Facebook, label: "Facebook", value: "Captain Barber", href: SITE.facebook },
    { icon: Clock, label: lang === "th" ? "เวลาเปิด" : "Hours", value: `${lang === "th" ? "ทุกวัน" : "Daily"} ${SITE.hours}` },
  ];

  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Contact</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">{tr("contact_title")}</h1>
            <p className="mt-4 text-muted-foreground">
              {lang === "th" ? "ติดต่อเราได้ตลอดเวลาทำการ ยินดีให้คำปรึกษาทรงผมและจองคิว" : "Reach us any time during business hours."}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => {
            const inner = (
              <div className="h-full rounded-xl border border-border bg-card p-6 transition hover:border-gold hover:shadow-[var(--shadow-gold)]">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                  <c.icon className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-1 font-semibold">{c.value}</p>
              </div>
            );
            return (
              <Reveal key={i} delay={i * 60}>
                {c.href ? <a href={c.href}>{inner}</a> : inner}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 rounded-xl border border-border bg-card p-6 flex gap-4">
            <MapPin className="h-6 w-6 text-gold shrink-0" />
            <div>
              <p className="font-semibold">{lang === "th" ? "ที่อยู่ร้าน" : "Address"}</p>
              <p className="mt-1 text-muted-foreground text-sm">{lang === "th" ? SITE.address : SITE.addressEn}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <iframe
              title="Captain Barber location"
              src="https://www.google.com/maps?q=Sukhumvit+Bangkok&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
