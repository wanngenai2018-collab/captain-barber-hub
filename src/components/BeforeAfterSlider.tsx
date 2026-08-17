import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspect?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  aspect = "aspect-[4/5]",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [updateFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((v) => Math.max(0, v - 4));
    if (e.key === "ArrowRight") setPos((v) => Math.min(100, v + 4));
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspect} select-none overflow-hidden rounded-xl border border-border bg-card touch-none`}
      onPointerDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
    >
      <img
        src={afterSrc}
        alt={`${alt} — ${afterLabel}`}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={beforeSrc}
          alt={`${alt} — ${beforeLabel}`}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
        {afterLabel}
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold" style={{ left: `${pos}%` }} />
      <button
        type="button"
        role="slider"
        aria-label={`${alt} before after slider`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.stopPropagation();
          dragging.current = true;
        }}
        className="absolute top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-gold bg-background text-gold shadow-[var(--shadow-gold)]"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
}
