import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function FloatingButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 400);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={SITE.lineUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="LINE"
        className="h-12 w-12 rounded-full bg-[#06C755] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href={`tel:${SITE.phoneTel}`}
        aria-label="Call"
        className="h-12 w-12 rounded-full bg-gold text-gold-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Phone className="h-5 w-5" />
      </a>
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="h-12 w-12 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-fade-in"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
