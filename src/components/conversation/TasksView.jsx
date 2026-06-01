import { motion } from "framer-motion";
import { Check, Pill, FlaskConical, CalendarClock, ClipboardList, Stethoscope } from "lucide-react";
import { useStore } from "../../store/store.jsx";

const KIND = {
  med: { icon: Pill, label: "Medication", color: "var(--tp-blue-500)" },
  lab: { icon: FlaskConical, label: "Lab", color: "var(--tp-violet-600)" },
  followup: { icon: CalendarClock, label: "Follow-up", color: "var(--tp-warning-600)" },
  referral: { icon: Stethoscope, label: "Referral", color: "var(--tp-success-600)" },
  order: { icon: ClipboardList, label: "Order", color: "var(--tp-slate-500)" },
};

export function TasksView({ conversation }) {
  const { toggleTask } = useStore();
  const tasks = conversation.tasks;
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-[11px] font-medium text-slate-400">
          Action items extracted from the conversation
        </p>
        <span className="text-[12px] font-semibold text-slate-600">
          {doneCount}/{tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {tasks.map((task, i) => {
          const kind = KIND[task.kind] || KIND.order;
          const Icon = kind.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.26 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleTask(conversation.id, i)}
              className="glass flex w-full items-center gap-3 rounded-2xl border border-slate-200/50 p-3 text-left"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  task.done
                    ? "border-transparent bg-success-500"
                    : "border-slate-300 bg-white"
                }`}
              >
                {task.done && <Check size={14} strokeWidth={3} className="text-white" />}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13px] font-medium ${
                    task.done ? "text-slate-400 line-through" : "text-slate-700"
                  }`}
                >
                  {task.label}
                </p>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                style={{ background: "var(--tp-slate-50)", color: kind.color }}
              >
                <Icon size={11} strokeWidth={2.4} />
                {kind.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
