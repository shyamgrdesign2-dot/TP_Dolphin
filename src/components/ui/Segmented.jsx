import { motion } from "framer-motion";

/* Compact segmented control (iOS-style) with a sliding active pill.
   Pass a unique `id` so the layout animation doesn't collide with others. */
export function Segmented({ id, options, value, onChange, className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/60 bg-slate-200/60 p-0.5 ${className}`}
    >
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className="relative rounded-full px-3 py-1.5 text-[12px] font-semibold"
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(23,23,37,0.16)]"
                transition={{ type: "spring", damping: 30, stiffness: 360 }}
              />
            )}
            <span className={`relative ${active ? "text-slate-900" : "text-slate-500"}`}>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
