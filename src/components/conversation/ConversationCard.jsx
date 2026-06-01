import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, UserCheck } from "lucide-react";
import { TagRow } from "./IdentifierTag.jsx";
import { ContextBadge, ConfidencePill, StatusChip, MetaRow } from "./bits.jsx";
import { Tilt } from "../ui/Tilt.jsx";
import { useStore } from "../../store/store.jsx";

export function ConversationCard({ conversation, index = 0 }) {
  const navigate = useNavigate();
  const { getPatient } = useStore();
  const assigned = conversation.assignedPatientId
    ? getPatient(conversation.assignedPatientId)
    : null;
  const unassigned = conversation.status === "unassigned";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
    >
      <Tilt
        max={6}
        onClick={() => navigate(`/conversations/${conversation.id}`)}
        className="group"
      >
        <div className="glass relative overflow-hidden rounded-[20px] p-4 shadow-[0_1px_2px_rgba(23,23,37,0.04),0_10px_28px_-12px_rgba(23,23,37,0.18)] transition-shadow duration-300 group-hover:shadow-[0_2px_6px_rgba(23,23,37,0.06),0_20px_44px_-16px_rgba(75,74,213,0.30)]">
          {/* gradient hairline border */}
          <span
            className="pointer-events-none absolute inset-0 rounded-[20px]"
            style={{
              padding: 1,
              background:
                "linear-gradient(150deg, rgba(255,255,255,0.9), rgba(226,226,234,0.9) 35%, rgba(213,101,234,0.18) 100%)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          {/* top sheen */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-[20px] bg-gradient-to-b from-slate-50/70 to-transparent" />

          {/* left status accent */}
          <span
            className="absolute inset-y-3 left-0 w-[3px] rounded-full"
            style={{
              background: unassigned
                ? "linear-gradient(180deg, var(--tp-warning-400, #FBBF24), var(--tp-warning-500))"
                : "linear-gradient(180deg, var(--tp-success-400, #34D399), var(--tp-success-600))",
            }}
          />

          <div className="relative">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ContextBadge context={conversation.context} />
                {conversation.isNew && (
                  <span className="inline-flex items-center rounded-md bg-gradient-to-r from-ai-pink to-ai-indigo px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                    NEW
                  </span>
                )}
                <MetaRow time={conversation.time} duration={conversation.duration} />
              </div>
              <ConfidencePill value={conversation.confidence} />
            </div>

            <h3 className="mb-1.5 pr-5 text-[15px] font-semibold leading-snug text-slate-800">
              {conversation.title}
            </h3>

            <p className="mb-3 line-clamp-3 text-[13px] leading-relaxed text-slate-500">
              {conversation.summary}
            </p>

            <TagRow tags={conversation.tags} size="sm" max={3} />

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
              {assigned ? (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-success-600">
                  <UserCheck size={13} strokeWidth={2.4} />
                  {assigned.name}
                </span>
              ) : (
                <StatusChip status={conversation.status} />
              )}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 transition-all duration-300 group-hover:bg-blue-50">
                <ChevronRight
                  size={16}
                  className="text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-blue-500"
                />
              </span>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}
