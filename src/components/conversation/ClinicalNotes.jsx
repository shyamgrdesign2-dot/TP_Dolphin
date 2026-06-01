import { motion } from "framer-motion";
import {
  Copy,
  Activity,
  Stethoscope,
  ClipboardList,
  Pill,
  Lightbulb,
  FlaskConical,
  CalendarClock,
} from "lucide-react";
import { useToast } from "../ui/Toast.jsx";

/* EMR clinical-note sections — mirrors the VoiceRx RxPad module order.
   Violet section icons follow the TP RxPad convention. */
const SECTIONS = [
  { key: "symptoms", label: "Symptoms", icon: Activity },
  { key: "examinations", label: "Examinations", icon: Stethoscope },
  { key: "diagnosis", label: "Diagnosis", icon: ClipboardList },
  { key: "medication", label: "Medication (Rx)", icon: Pill },
  { key: "advice", label: "Advices", icon: Lightbulb },
  { key: "lab", label: "Lab Investigation", icon: FlaskConical },
  { key: "followUp", label: "Follow-up", icon: CalendarClock },
];

const VIOLET = "var(--tp-violet-600)";

function SectionShell({ icon: Icon, label, onCopy, children, count }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="glass overflow-hidden rounded-2xl border border-slate-200/60"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-3.5 py-2.5">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-lg"
          style={{ background: "var(--tp-violet-50)" }}
        >
          <Icon size={14} style={{ color: VIOLET }} strokeWidth={2.2} />
        </span>
        <span className="text-[13px] font-semibold text-slate-800">{label}</span>
        {count != null && (
          <span className="rounded-full bg-slate-100 px-1.5 text-[11px] font-bold text-slate-500">
            {count}
          </span>
        )}
        <button
          onClick={onCopy}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 active:scale-90"
        >
          <Copy size={14} />
        </button>
      </div>
      <div className="px-3.5 py-3">{children}</div>
    </motion.div>
  );
}

/* Two-column "table" row, RxPad style. */
function TableRow({ primary, meta }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-50 py-1.5 last:border-0">
      <span className="text-[13px] font-medium text-slate-700">{primary}</span>
      {meta && (
        <span className="shrink-0 text-right text-[12px] text-slate-500">{meta}</span>
      )}
    </div>
  );
}

function Empty() {
  return <p className="text-[12px] italic text-slate-400">No entries.</p>;
}

export function ClinicalNotes({ clinical }) {
  const { show } = useToast();
  if (!clinical) return null;

  const copy = (label, text) => {
    navigator.clipboard?.writeText(text);
    show(`${label} copied`);
  };

  const render = (key) => {
    switch (key) {
      case "symptoms":
        return clinical.symptoms.length ? (
          clinical.symptoms.map((s, i) => (
            <TableRow
              key={i}
              primary={s.name}
              meta={[s.since, s.severity].filter((x) => x && x !== "—").join(" · ")}
            />
          ))
        ) : (
          <Empty />
        );
      case "examinations":
        return clinical.examinations.length ? (
          <ul className="flex flex-col gap-1.5">
            {clinical.examinations.map((e, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-slate-700">
                <span
                  className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                  style={{ background: VIOLET }}
                />
                {e.name}
              </li>
            ))}
          </ul>
        ) : (
          <Empty />
        );
      case "diagnosis":
        return clinical.diagnosis.length ? (
          clinical.diagnosis.map((d, i) => (
            <TableRow key={i} primary={d.name} meta={d.since !== "—" ? d.since : null} />
          ))
        ) : (
          <Empty />
        );
      case "medication":
        return clinical.medication.length ? (
          <div className="flex flex-col gap-2">
            {clinical.medication.map((m, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
              >
                <p className="text-[13px] font-semibold text-slate-800">{m.name}</p>
                <p className="mt-0.5 text-[12px] text-slate-500">
                  {[m.dose, m.freq, m.duration].filter((x) => x && x !== "—").join(" · ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Empty />
        );
      case "advice":
        return clinical.advice.length ? (
          <ul className="flex flex-col gap-1.5">
            {clinical.advice.map((a, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-slate-700">
                <span
                  className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                  style={{ background: VIOLET }}
                />
                {a}
              </li>
            ))}
          </ul>
        ) : (
          <Empty />
        );
      case "lab":
        return clinical.lab.length ? (
          <div className="flex flex-wrap gap-1.5">
            {clinical.lab.map((l, i) => (
              <span
                key={i}
                className="rounded-lg bg-violet-50 px-2.5 py-1 text-[12px] font-medium text-violet-700"
              >
                {l.name}
              </span>
            ))}
          </div>
        ) : (
          <Empty />
        );
      case "followUp":
        return (
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[12px] font-semibold text-violet-700">
              {clinical.followUp.when}
            </span>
            <span className="text-[13px] text-slate-600">{clinical.followUp.note}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const sectionText = (key) => {
    const data = clinical[key];
    if (key === "followUp") return `${data.when} — ${data.note}`;
    if (key === "medication")
      return data.map((m) => `${m.name} ${m.dose} ${m.freq} ${m.duration}`).join("\n");
    if (key === "symptoms" || key === "diagnosis")
      return data.map((d) => `${d.name}${d.since && d.since !== "—" ? ` (${d.since})` : ""}`).join("\n");
    if (key === "advice") return data.join("\n");
    return data.map((x) => x.name).join("\n");
  };

  return (
    <div className="flex flex-col gap-3">
      {SECTIONS.map((s) => {
        const data = clinical[s.key];
        const count = Array.isArray(data) ? data.length : null;
        return (
          <SectionShell
            key={s.key}
            icon={s.icon}
            label={s.label}
            count={count}
            onCopy={() => copy(s.label, sectionText(s.key))}
          >
            {render(s.key)}
          </SectionShell>
        );
      })}
    </div>
  );
}
