import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Share2, Copy, ClipboardCheck, Lock } from "lucide-react";
import { useStore } from "../store/store.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { TagRow } from "../components/conversation/IdentifierTag.jsx";
import { ContextBadge, ConfidencePill } from "../components/conversation/bits.jsx";
import { AssignBar } from "../components/conversation/AssignBar.jsx";
import { SoapNotes, SummaryBlock } from "../components/conversation/SoapNotes.jsx";
import { ClinicalNotes } from "../components/conversation/ClinicalNotes.jsx";
import { TranscriptView } from "../components/conversation/TranscriptView.jsx";
import { TasksView } from "../components/conversation/TasksView.jsx";
import { CopySheet } from "../components/conversation/CopySheet.jsx";

const TABS = [
  { key: "summary", label: "Summary" },
  { key: "transcript", label: "Transcript" },
  { key: "tasks", label: "Tasks" },
];

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getConversation, getPatient } = useStore();
  const { show } = useToast();
  const [tab, setTab] = useState("summary");
  const [noteFormat, setNoteFormat] = useState("clinical");
  const [copyOpen, setCopyOpen] = useState(false);

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

  function handleCopyToRx() {
    if (!assigned) {
      show("Assign a patient first");
      return;
    }
    setCopyOpen(true);
  }

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="glass-strong sticky top-0 z-30">
        <div className="flex items-center gap-3 px-3 pt-6 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="glass-soft flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 text-slate-600 active:scale-90"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <ContextBadge context={c.context} />
            <span className="text-[12px] font-medium text-slate-400">
              {c.time} · {c.duration}
            </span>
          </div>
          <div className="ml-auto">
            <ConfidencePill value={c.confidence} />
          </div>
        </div>
      </div>

      {/* scroll body */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-40 pt-3">
        {/* title */}
        <h1 className="text-[19px] font-bold leading-snug text-slate-900">
          {c.title}
        </h1>
        <p className="mt-1 text-[11px] font-medium text-slate-400">
          Auto-titled by AI · {c.session}
        </p>

        {/* identifier tags */}
        <div className="mt-3">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Detected identifiers
          </p>
          <TagRow tags={c.tags} />
        </div>

        {/* assign bar */}
        <div className="mt-4">
          <AssignBar conversation={c} />
        </div>

        {/* tabs */}
        <div className="sticky top-0 z-10 mt-5 flex gap-1 rounded-2xl bg-slate-200/70 p-1">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="relative flex-1 rounded-xl py-2 text-[13px] font-semibold"
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm"
                    transition={{ type: "spring", damping: 28, stiffness: 340 }}
                  />
                )}
                <span
                  className={`relative ${
                    active ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {t.label}
                  {t.key === "tasks" && (
                    <span className="ml-1 text-[11px] text-slate-400">
                      {c.tasks.length}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* tab content */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {tab === "summary" && (
                <>
                  <SummaryBlock summary={c.summary} />

                  {/* note-format switch: EMR clinical notes vs SOAP */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Structured notes
                    </span>
                    <div className="flex gap-1 rounded-xl bg-slate-200/70 p-0.5">
                      {[
                        { key: "clinical", label: "Clinical notes" },
                        { key: "soap", label: "SOAP" },
                      ].map((f) => {
                        const active = noteFormat === f.key;
                        return (
                          <button
                            key={f.key}
                            onClick={() => setNoteFormat(f.key)}
                            className="relative rounded-lg px-3 py-1.5 text-[12px] font-semibold"
                          >
                            {active && (
                              <motion.span
                                layoutId="note-format-pill"
                                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                                transition={{ type: "spring", damping: 28, stiffness: 340 }}
                              />
                            )}
                            <span
                              className={`relative ${
                                active ? "text-slate-900" : "text-slate-500"
                              }`}
                            >
                              {f.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={noteFormat}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {noteFormat === "clinical" ? (
                        <ClinicalNotes clinical={c.clinical} />
                      ) : (
                        <SoapNotes soap={c.soap} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
              {tab === "transcript" && <TranscriptView transcript={c.transcript} />}
              {tab === "tasks" && <TasksView conversation={c} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* sticky action bar */}
      <div className="glass-strong absolute inset-x-0 bottom-0 z-30 border-t border-white/40 px-4 pb-5 pt-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => show("Share sheet opened")}
            className="glass-soft flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 text-slate-600 active:scale-95"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(c.summary);
              show("Summary copied to clipboard");
            }}
            className="glass-soft flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 text-slate-600 active:scale-95"
          >
            <Copy size={18} />
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyToRx}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold transition-all ${
              assigned
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_10px_26px_-8px_rgba(75,74,213,0.6)]"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {assigned ? (
              <>
                <ClipboardCheck size={17} />
                {c.status === "copied" ? "Copied — push again" : "Copy to RxPad"}
              </>
            ) : (
              <>
                <Lock size={15} />
                Assign a patient to copy
              </>
            )}
          </motion.button>
        </div>
      </div>

      {assigned && (
        <CopySheet
          open={copyOpen}
          onClose={() => setCopyOpen(false)}
          conversation={c}
          patient={assigned}
        />
      )}
    </div>
  );
}
