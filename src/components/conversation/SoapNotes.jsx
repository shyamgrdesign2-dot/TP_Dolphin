import { motion } from "framer-motion";
import { Copy, Sparkles } from "lucide-react";
import { useToast } from "../ui/Toast.jsx";

const SECTIONS = [
  { key: "subjective", label: "Subjective", letter: "S", tint: "var(--tp-blue-500)", bg: "var(--tp-blue-50)" },
  { key: "objective", label: "Objective", letter: "O", tint: "var(--tp-violet-600)", bg: "var(--tp-violet-100)" },
  { key: "assessment", label: "Assessment", letter: "A", tint: "var(--tp-warning-600)", bg: "var(--tp-warning-50)" },
  { key: "plan", label: "Plan", letter: "P", tint: "var(--tp-success-600)", bg: "var(--tp-success-50)" },
];

export function SoapNotes({ soap }) {
  const { show } = useToast();
  return (
    <div className="flex flex-col gap-3">
      {SECTIONS.map((s, idx) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06, duration: 0.3 }}
          className="glass overflow-hidden rounded-2xl border border-slate-200/60"
        >
          {/* section header */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ background: s.bg }}>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-lg text-[12px] font-bold text-white"
              style={{ background: s.tint }}
            >
              {s.letter}
            </span>
            <span className="text-[13px] font-semibold text-slate-800">
              {s.label}
            </span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(soap[s.key].join("\n"));
                show(`${s.label} copied`);
              }}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 active:scale-90"
            >
              <Copy size={14} />
            </button>
          </div>
          {/* bullets */}
          <ul className="flex flex-col gap-1.5 px-4 py-3">
            {soap[s.key].map((line, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-slate-600">
                <span
                  className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                  style={{ background: s.tint }}
                />
                {line}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

export function SummaryBlock({ summary }) {
  return (
    <div className="relative mb-3 overflow-hidden rounded-2xl border border-violet-200/70 bg-gradient-to-br from-violet-50 to-blue-50/40 p-4">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Sparkles size={13} className="text-violet-600" />
        <span className="text-[11px] font-bold uppercase tracking-wide text-violet-700">
          AI summary
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-slate-700">{summary}</p>
    </div>
  );
}
