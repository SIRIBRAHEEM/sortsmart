// Small design-system primitives in the shadcn/ui spirit: plain React
// components styled with Tailwind, owned by this project, no extra deps.
// SortSmart theme: bold eco-poster. Thick forest borders, hard offset
// shadows, chunky type, bin-colour accents.

import { cn } from "../lib/utils.js";

export function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-forest-900 px-5 py-2.5 text-[15px] font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-pop/60 disabled:pointer-events-none disabled:opacity-50";
  const styles = {
    primary:
      "bg-forest-900 text-white shadow-sticker-sm hover:-translate-y-0.5 hover:shadow-sticker active:translate-y-0 active:shadow-none",
    lime: "bg-lime-pop text-forest-950 shadow-sticker-sm hover:-translate-y-0.5 hover:shadow-sticker active:translate-y-0 active:shadow-none",
    outline:
      "bg-white text-forest-900 hover:bg-lime-soft active:translate-y-0.5",
    danger:
      "border-red-700 bg-white text-red-700 px-3 py-1.5 text-[13px] rounded-lg hover:bg-red-50",
  };
  return <button className={cn(base, styles[variant], className)} {...props} />;
}

export function Card({ className = "", sticker = true, ...props }) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 border-forest-900 bg-white",
        sticker && "shadow-sticker",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ className = "", style, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-0.5 text-[12.5px] font-extrabold tracking-wide uppercase",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border-2 border-forest-900 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:outline-none focus:ring-4 focus:ring-lime-pop/60",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className = "", ...props }) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border-2 border-forest-900 bg-white px-3 py-2.5 text-[15px] text-ink focus:outline-none focus:ring-4 focus:ring-lime-pop/60",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className = "", ...props }) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[13px] font-extrabold tracking-wide text-forest-900 uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Progress({ value = 0, className = "" }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-3.5 w-full overflow-hidden rounded-full border-2 border-forest-900 bg-cream",
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="h-full rounded-full bg-lime-pop transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
