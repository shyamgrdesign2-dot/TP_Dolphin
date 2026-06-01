import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardList,
  Stethoscope,
  Sparkles,
  ListChecks,
  Check,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { Sheet } from "../ui/Sheet.jsx";
import { useStore } from "../../store/store.jsx";
import { useToast } from "../ui/Toast.jsx";

const FORMATS = [
  {
    key: "clinical",
    label: "Clinical notes",
    sub: "Symptoms · Exam · Dx · Rx · Advice · Lab · Follow-up",
    icon: ClipboardList,
    recommended: true,
  },
  { key: "soap", label: "SOAP notes", sub: "Subjective · Objective · Assessment · Plan", icon: Stethoscope },
  { key: "summary", label: "Visit summary", sub: "The short AI narrative summary", icon: Sparkles },
  { key: "tasks", label: "Action items", sub: "Medications, labs, referrals & follow-ups", icon: ListChecks },
];

export function CopySheet({ open, onClose, conversation, patient }) {
  const { markCopied } = useStore();
  const { show } = useToast();
  const [selected, setSelected] = useState({ clinical: true, soap: false, summary: true, tasks: true });
  const [phase, setPhase] = useState("choose"); // choose | pushing | done

  const toggle = (k) => setSelected((s) => ({ ...s, [k]: !s[k] }));
  const count = Object.values(selected).filter(Boolean).length;

  function push() {
    setPhase("pushing");
    // simulate the desktop Rx pad receiving the payload
    window.setTimeout(() => setPhase("done"), 900);
    window.setTimeout(() => {
      markCopied(conversation.id);
      show(`Pushed to ${patient.name.split(" ")[0]}'s Rx pad`);
      onClose();
      setPhase("choose");
    }, 1800);
  }

  return (
    <Sheet open={open} onClose={phase === "choose" ? onClose : () => {}} title={phase === "choose" ? "Copy to Rx pad" : undefined}>
      <AnimatePresence mode="wait">
        {phase === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* patient target */}
            <div className="mb-3 flex items-center gap-2.5 rounded-2xl border border-success-500/30 bg-success-50 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success-500 text-[12px] font-bold text-white">
                {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-slate-800">
                  {patient.name}
                </p>
                <p className="text-[12px] text-slate-500">
                  {patient.age}/{patient.sex} · {patient.mrn} · {patient.bed}
                </p>
              </div>
            </div>

            <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
              What to copy
            </p>

            <div className="flex flex-col gap-2">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                const on = selected[f.key];
                return (
                  <button
                    key={f.key}
                    onClick={() => toggle(f.key)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                      on ? "border-blue-300 bg-blue-50/60" : "border-slate-200 bg-white"
                    }`}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ background: on ? "var(--tp-blue-100)" : "var(--tp-slate-100)" }}
                    >
                      <Icon size={17} className={on ? "text-blue-600" : "text-slate-500"} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[14px] font-semibold text-slate-800">{f.label}</p>
                        {f.recommended && (
                          <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
                            Suggested
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-slate-500">{f.sub}</p>
                    </div>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${
                        on ? "border-transparent bg-blue-500" : "border-slate-300"
                      }`}
                    >
                      {on && <Check size={12} strokeWidth={3} className="text-white" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
              <Monitor size={13} className="text-slate-400" />
              Opens live on your desktop Rx pad for {patient.name.split(" ")[0]}.
            </div>

            <button
              onClick={push}
              disabled={count === 0}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-[14px] font-semibold text-white disabled:opacity-40"
            >
              Push {count} section{count === 1 ? "" : "s"} to Rx pad
              <ArrowRight size={16} strokeWidth={2.6} />
            </button>
          </motion.div>
        )}

        {phase !== "choose" && (
          <motion.div
            key="pushing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <div className="relative flex h-20 w-20 items-center justify-center">
              {phase === "pushing" && (
                <span
                  className="absolute h-20 w-20 rounded-full border-2 border-blue-200 border-t-blue-500"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
              )}
              <motion.span
                initial={false}
                animate={{
                  scale: phase === "done" ? 1 : 0.6,
                  background: phase === "done" ? "var(--tp-success-500)" : "var(--tp-blue-50)",
                }}
                transition={{ type: "spring", damping: 18, stiffness: 260 }}
                className="flex h-14 w-14 items-center justify-center rounded-full"
              >
                {phase === "done" ? (
                  <Check size={26} strokeWidth={3} className="text-white" />
                ) : (
                  <Monitor size={22} className="text-blue-500" />
                )}
              </motion.span>
            </div>
            <p className="mt-4 text-[15px] font-semibold text-slate-800">
              {phase === "done" ? "Pushed to Rx pad" : "Sending to desktop…"}
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              {patient.name} · {patient.mrn}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
}
