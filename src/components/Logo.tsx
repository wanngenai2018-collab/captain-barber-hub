export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-[oklch(0.85_0.14_85)] to-[oklch(0.6_0.15_75)] font-display text-lg font-bold text-black shadow-[0_4px_14px_-4px_oklch(0.72_0.14_82_/_0.7)]">
        CB
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-base font-bold tracking-wide">Captain</span>
        <span className="-mt-1 font-display text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold">
          Barber
        </span>
      </div>
    </div>
  );
}
