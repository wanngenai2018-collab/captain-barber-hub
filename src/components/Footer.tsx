import { Link } from "@tanstack/react-router";
import { Facebook, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const { tr, lang } = useI18n();
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {lang === "th"
              ? "กัปตัน Barber — ร้านตัดผมชายสไตล์ Classic × Modern เชี่ยวชาญ Fade, ทรงผมสมัยใหม่, และบริการโกนหนวดคลาสสิก"
              : "Captain Barber — Classic × Modern men's barbershop. Fade specialist, contemporary cuts, classic hot-towel shaves."}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
            {tr("nav_contact")}
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />{lang === "th" ? SITE.address : SITE.addressEn}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-gold" />{SITE.phone}</li>
            <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5 shrink-0 text-gold" />{tr("footer_hours")}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
            {lang === "th" ? "ลิงก์" : "Links"}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-gold">{tr("nav_services")}</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">{tr("nav_gallery")}</Link></li>
            <li><a href={SITE.bookingUrl} target="_blank" rel="noreferrer" className="hover:text-gold">{tr("nav_booking")}</a></li>
            <li className="flex gap-3 pt-2">
              <a href={SITE.lineUrl} aria-label="LINE" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold"><MessageCircle className="h-4 w-4" /></a>
              <a href={SITE.facebook} aria-label="Facebook" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold"><Facebook className="h-4 w-4" /></a>
              <a href={`tel:${SITE.phoneTel}`} aria-label="Call" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold"><Phone className="h-4 w-4" /></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-5 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} {SITE.nameEn}. {tr("footer_rights")}.
        </div>
      </div>
    </footer>
  );
}
