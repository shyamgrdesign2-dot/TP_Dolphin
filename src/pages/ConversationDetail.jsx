import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, ClipboardCheck, Printer, Monitor } from "lucide-react";
import { useStore } from "../store/store.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { NOTE_TYPES } from "../data/mock.js";
import { IdentifierTag, IdentityChip } from "../components/conversation/IdentifierTag.jsx";
import { ContextBadge } from "../components/conversation/bits.jsx";
import { AssignBar } from "../components/conversation/AssignBar.jsx";
import { SoapNotes, SummaryBlock } from "../components/conversation/SoapNotes.jsx";
import { ClinicalNotes } from "../components/conversation/ClinicalNotes.jsx";
import { TranscriptView } from "../components/conversation/TranscriptView.jsx";
import { TasksView } from "../components/conversation/TasksView.jsx";

/* ── plain-text serialisers for copy/print ── */
const clinicalText = (cl) => {
  if (!cl) return "";
  const out = [];
  if (cl.symptoms?.length) out.push("Symptoms: " + cl.symptoms.map((s) => s.name).join(", "));
  if (cl.examinations?.length) out.push("Examination: " + cl.examinations.map((e) => e.name).join("; "));
  if (cl.diagnosis?.length) out.push("Diagnosis: " + cl.diagnosis.map((d) => d.name).join(", "));
  if (cl.medication?.length)
    out.push("Medication: " + cl.medication.map((m) => [m.name, m.dose, m.freq, m.duration].filter((x) => x && x !== "—").join(" ")).join("; "));
  if (cl.advice?.length) out.push("Advice: " + cl.advice.join("; "));
  if (cl.lab?.length) out.push("Lab: " + cl.lab.map((l) => l.name).join(", "));
  if (cl.followUp) out.push("Follow-up: " + cl.followUp.when + " — " + cl.followUp.note);
  return out.join("\n");
};
const soapText = (s) =>
  [`S: ${s.subjective.join(" ")}`, `O: ${s.objective.join(" ")}`, `A: ${s.assessment.join(" ")}`, `P: ${s.plan.join(" ")}`].join("\n");
const transcriptText = (t) => t.map((l) => `${l.speaker} (${l.t}): ${l.text}`).join("\n");
const tasksText = (t) => t.map((x) => `[${x.done ? "x" : " "}] ${x.label}`).join("\n");

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getConversation, getPatient, markCopied } = useStore();
  const { show } = useToast();
  const [tab, setTab] = useState(null);

  const c = getConversation(id);
  if (!c) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
        <p className="text-[14px] text-slate-500">Conversation not found.</p>
        <button
          onClick={() => navigate("/conversations")}
          className="rounded-xl bg-blue-500 px-4 py-2 text-[14px] font-semibold text-white"
        >
          Back to captures
        </button>
      </div>
    );
  }

  const assigned = c.assignedPatientId ? getPatient(c.assignedPatientId) : null;
  const nameTag = c.tags.find((t) => t.type === "name");
  const supportTags = c.tags.filter((t) => t.type !== "name");
  const copy = (text, label) => {
    navigator.clipboard?.writeText(text);
    show(label);
  };

  // Tabs are context-driven. OPD → Clinical notes + SOAP. IPD → one tab per
  // note type (Initial assessment / OT note / Progress note / Consultation /
  // Cross referral) — never "clinical notes" or "SOAP".
  const isOPD = c.context === "OPD";
  const noteTabs = isOPD
    ? [
        { key: "clinical", label: "Clinical notes", kind: "note", clinical: c.clinical },
        { key: "soap", label: "SOAP", kind: "soap" },
      ]
    : (c.notes || []).map((n, i) => ({
        key: `note-${i}`,
        label: NOTE_TYPES[n.type]?.label || "Note",
        kind: "note",
        clinical: n.clinical,
      }));
  const tabs = [
    ...noteTabs,
    { key: "transcript", label: "Transcript", kind: "transcript" },
    { key: "tasks", label: "Tasks", kind: "tasks" },
  ];
  const activeKey = tab ?? tabs[0].key;
  const activeTab = tabs.find((t) => t.key === activeKey) || tabs[0];

  const primaryRx =
    "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-[14px] font-semibold text-white shadow-[0_10px_26px_-8px_rgba(75,74,213,0.6)]";
  const primaryFlat =
    "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 text-[14px] font-semibold text-white";
  const secondaryIcon =
    "flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 active:scale-95";

  // bottom CTA changes with the active tab
  function ActionBar() {
    if (activeTab.kind === "note") {
      return (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            markCopied(c.id);
            show(`${activeTab.label} pushed to ${assigned.name.split(" ")[0]}'s RxPad`);
          }}
          className={primaryRx}
        >
          <ClipboardCheck size={17} />
          {c.status === "copied" ? "Pushed — push again" : `Copy ${activeTab.label} to RxPad`}
        </motion.button>
      );
    }
    if (activeTab.kind === "soap") {
      return (
        <>
          <button onClick={() => show("Preparing print preview…")} className={secondaryIcon}>
            <Printer size={18} />
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => copy(soapText(c.soap), "SOAP notes copied to clipboard")}
            className={primaryFlat}
          >
            <Copy size={17} /> Copy SOAP to clipboard
          </motion.button>
        </>
      );
    }
    if (activeTab.kind === "transcript") {
      return (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => copy(transcriptText(c.transcript), "Transcript copied to clipboard")}
          className={primaryFlat}
        >
          <Copy size={17} /> Copy transcript
        </motion.button>
      );
    }
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => copy(tasksText(c.tasks), "Tasks copied to clipboard")}
        className={primaryFlat}
      >
        <Copy size={17} /> Copy tasks
      </motion.button>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* header — once assigned, the patient name becomes the heading so it
          stays visible while the notes tabs are sticky */}
      <div className="glass-strong sticky top-0 z-30">
        <div className="flex items-center gap-3 px-3 pb-3 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="glass-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/50 text-slate-600 active:scale-90"
          >
            <ArrowLeft size={18} />
          </button>
          {assigned ? (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-[15px] font-bold leading-tight text-slate-900">
                  {assigned.name}
                </p>
                <ContextBadge context={c.context} />
              </div>
              <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                {c.time} · {c.duration}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ContextBadge context={c.context} />
              <span className="text-[12px] font-medium text-slate-400">
                {c.time} · {c.duration}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* scroll body */}
      <div className="no-scrollbar flex-1 overflow-y-auto pb-40">
        <div className="px-4 pt-3">
          <h1 className="text-[19px] font-bold leading-snug text-slate-900">{c.title}</h1>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            Auto-titled by AI · {c.session}
          </p>

          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
              Detected identifiers
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {nameTag && (
                <IdentityChip
                  name={assigned ? assigned.name : nameTag.value}
                  tone={assigned ? "assigned" : "nomatch"}
                />
              )}
              {supportTags.map((t, i) => (
                <IdentifierTag key={i} type={t.type} value={t.value} />
              ))}
            </div>
          </div>

          {/* AI summary — at the top, shown in both states */}
          <div className="mt-4">
            <SummaryBlock summary={c.summary} />
          </div>

          {/* assign to patient — below the summary */}
          <div className="mt-4">
            <AssignBar conversation={c} />
          </div>

          {assigned ? (
            <div className="mt-3 flex w-full items-center gap-2 rounded-xl bg-warning-50 px-3 py-2.5 text-[12px] font-semibold text-warning-600">
              <Monitor size={14} className="shrink-0" />
              Synced to {assigned.name}'s desktop RxPad · {c.context}
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-warning-50 px-3 py-2.5 text-[12px] font-medium leading-relaxed text-warning-600">
              <Monitor size={14} className="mt-0.5 shrink-0" />
              <span>
                Assign a patient to review the structured notes, transcript &amp;
                tasks — once assigned, you can also view them on your desktop RxPad.
              </span>
            </div>
          )}
        </div>

        {assigned && (
          <>
            {/* sticky tabs */}
            <div className="glass-strong sticky top-0 z-20 mt-1 px-4">
              <div className="no-scrollbar flex gap-5 overflow-x-auto border-b border-slate-200/70">
                {tabs.map((t) => {
                  const active = activeKey === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className="relative whitespace-nowrap pb-2.5 pt-2 text-[13px] font-semibold"
                    >
                      <span className={active ? "text-slate-900" : "text-slate-400"}>
                        {t.label}
                        {t.kind === "tasks" && (
                          <span className="ml-1 text-[11px] text-slate-400">{c.tasks.length}</span>
                        )}
                      </span>
                      {active && (
                        <motion.span
                          layoutId="detail-tab-underline"
                          className="absolute inset-x-0 -bottom-px h-[2.5px] rounded-full bg-blue-500"
                          transition={{ type: "spring", damping: 28, stiffness: 340 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* tab content — keyed so switching tabs remounts cleanly */}
            <div className="px-4 pt-4">
              <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
              >
                {activeTab.kind === "note" && <ClinicalNotes clinical={activeTab.clinical} />}
                {activeTab.kind === "soap" && <SoapNotes soap={c.soap} />}
                {activeTab.kind === "transcript" && (
                  <TranscriptView transcript={c.transcript} />
                )}
                {activeTab.kind === "tasks" && <TasksView conversation={c} />}
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* action bar — solid white, pinned, contextual to the active tab */}
      {assigned && (
        <div className="absolute inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-4 pb-6 pt-3">
          <div className="flex items-center gap-2.5">
            <ActionBar />
          </div>
        </div>
      )}
    </div>
  );
}
