import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Layers, UserPlus, ClipboardCheck, ChevronRight } from "lucide-react";

/* First-run, one-time flow explainer. Persisted via localStorage per the TP
   coachmark pattern — bump the key suffix if the copy changes. */
const KEY = "tp_welcome_coach_v1";

const STEPS = [
  { icon: Layers, label: "Review", sub: "AI-segmented captures" },
  { icon: UserPlus, label: "Assign", sub: "Confirm the patient" },
  { icon: ClipboardCheck, label: "Push", sub: "Notes to RxPad" },
];

export function WelcomeCoachmark() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setOpen(!localStorage.getItem(KEY));
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-violet-200/60 bg-white p-4 shadow-[0_10px_30px_-16px_rgba(103,58,172,0.35)]">
            {/* AI sheen */}
            <div
              className="pointer-events-none absolute inset-0 opacity-60 animate-ai-pan"
              style={{
                background:
                  "linear-gradient(120deg, rgba(213,101,234,0.08), rgba(75,74,213,0.05), rgba(213,101,234,0.08))",
              }}
            />
            <button
              onClick={dismiss}
              className="absolute right-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 active:scale-90"
            >
              <X size={15} />
            </button>

            <div className="relative">
              <div className="mb-3 flex items-center gap-1.5">
                <Sparkles size={13} className="text-violet-600" />
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-violet-700">
                  How Tatva Scribe works
                </span>
              </div>

              <div className="flex items-stretch justify-between gap-1">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex flex-1 items-center gap-1">
                      <div className="flex flex-1 flex-col items-center text-center">
                        <span className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-violet-100 text-violet-600">
                          <Icon size={17} strokeWidth={2.2} />
                        </span>
                        <span className="text-[12px] font-semibold text-slate-800">
                          {s.label}
                        </span>
                        <span className="text-[10px] leading-tight text-slate-400">
                          {s.sub}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <ChevronRight size={14} className="mb-4 shrink-0 text-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
