import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  UserCheck,
  ChevronRight,
  Search,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { Sheet } from "../ui/Sheet.jsx";
import { useStore } from "../../store/store.jsx";
import { useToast } from "../ui/Toast.jsx";

function PatientRow({ patient, suggested, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(patient.id)}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
        selected
          ? "border-blue-300 bg-blue-50"
          : "border-slate-200 bg-white active:bg-slate-50"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[13px] font-bold text-slate-600">
        {patient.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14px] font-semibold text-slate-800">
            {patient.name}
          </p>
          {suggested && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
              <Sparkles size={9} /> AI match
            </span>
          )}
        </div>
        <p className="truncate text-[12px] text-slate-500">
          {patient.age}/{patient.sex} · {patient.mrn} · {patient.bed}
        </p>
      </div>
      {selected && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
          <Check size={12} strokeWidth={3} className="text-white" />
        </span>
      )}
    </button>
  );
}

export function AssignBar({ conversation }) {
  const { patientDB, assignPatient, unassignPatient, getPatient } = useStore();
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(conversation.assignedPatientId);

  const assigned = conversation.assignedPatientId
    ? getPatient(conversation.assignedPatientId)
    : null;
  const suggestedId = conversation.suggestedPatientId;

  const ordered = [...patientDB].sort((a, b) => {
    if (a.id === suggestedId) return -1;
    if (b.id === suggestedId) return 1;
    return 0;
  });
  const filtered = ordered.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mrn.toLowerCase().includes(query.toLowerCase()) ||
      p.bed.toLowerCase().includes(query.toLowerCase())
  );

  function confirm() {
    if (pending) {
      assignPatient(conversation.id, pending);
      show("Patient assigned to this conversation");
    }
    setOpen(false);
  }

  const suggestion = suggestedId ? getPatient(suggestedId) : null;

  const openSheet = () => {
    setPending(conversation.assignedPatientId || suggestedId);
    setOpen(true);
  };

  return (
    <>
      {assigned ? (
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={openSheet}
          className="flex w-full items-center gap-3 rounded-2xl border border-success-500/30 bg-success-50 p-3 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-500 text-white">
            <UserCheck size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-success-600">
              Assigned to
            </p>
            <p className="truncate text-[14px] font-semibold text-slate-800">
              {assigned.name} · {assigned.mrn}
            </p>
          </div>
          <span className="text-[12px] font-semibold text-blue-500">Change</span>
          <ChevronRight size={16} className="text-slate-300" />
        </motion.button>
      ) : (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-600">
            <UserPlus size={12} strokeWidth={2.6} /> Assign a patient
          </p>
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={openSheet}
            className="flex w-full items-center gap-2.5 rounded-2xl border border-blue-300 bg-white/70 px-3.5 py-3 text-left shadow-[0_8px_22px_-14px_rgba(75,74,213,0.5)]"
          >
            <Search size={17} className="text-blue-500" />
            <span className="flex-1 text-[14px] text-slate-400">
              Search name, MRN or bed…
            </span>
            {suggestion && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-[11px] font-bold text-violet-700">
                <Sparkles size={10} /> {suggestion.name.split(" ")[0]}
              </span>
            )}
          </motion.button>
        </div>
      )}

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Assign to patient"
        footer={
          <div className="flex gap-2.5">
            {assigned && (
              <button
                onClick={() => {
                  unassignPatient(conversation.id);
                  show("Assignment removed");
                  setOpen(false);
                }}
                className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 text-[14px] font-semibold text-slate-600"
              >
                <X size={15} /> Unassign
              </button>
            )}
            <button
              onClick={confirm}
              disabled={!pending}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 text-[14px] font-semibold text-white disabled:opacity-40"
            >
              <Check size={16} strokeWidth={2.6} /> Confirm assignment
            </button>
          </div>
        }
      >
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients by name, MRN, bed…"
            className="w-full bg-transparent text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <PatientRow
              key={p.id}
              patient={p}
              suggested={p.id === suggestedId}
              selected={pending === p.id}
              onSelect={setPending}
            />
          ))}
        </div>
      </Sheet>
    </>
  );
}
