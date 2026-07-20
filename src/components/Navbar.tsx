import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Logo } from "./Logo";

export function Navbar() {
  const { tr, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    { to: "/", label: tr("nav_home") },
    { to: "/about", label: tr("nav_about") },
    { to: "/services", label: tr("nav_services") },
    { to: "/gallery", label: tr("nav_gallery") },
    { to: "/reviews", label: tr("nav_reviews") },
    { to: "/contact", label: tr("nav_contact") },
  ] as const;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors"
              activeProps={{ className: "text-gold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            className="hidden sm:inline-flex h-9 items-center rounded-md border border-border px-3 text-xs font-semibold uppercase tracking-wider hover:border-gold hover:text-gold transition-colors"
            aria-label="Switch language"
          >
            {lang === "th" ? "EN" : "TH"}
          </button>
          <button
            onClick={toggle}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:border-gold hover:text-gold transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/booking" className="hidden md:inline-flex btn-gold text-sm px-4 py-2">
            {tr("nav_booking")}
          </Link>
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                activeProps={{ className: "text-gold bg-muted" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 btn-gold text-sm"
            >
              {tr("nav_booking")}
            </Link>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setLang(lang === "th" ? "en" : "th")}
                className="flex-1 h-9 rounded-md border border-border text-xs font-semibold uppercase"
              >
                {lang === "th" ? "English" : "ภาษาไทย"}
              </button>
              <button
                onClick={toggle}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
