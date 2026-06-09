import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { IdentifierTag, IdentityChip } from "./IdentifierTag.jsx";
import { StatusChip, MetaRow } from "./bits.jsx";
import { Tilt } from "../ui/Tilt.jsx";
import { useStore } from "../../store/store.jsx";

export function ConversationCard({ conversation, index = 0 }) {
  const navigate = useNavigate();
  const { getPatient } = useStore();
  const assigned = conversation.assignedPatientId
    ? getPatient(conversation.assignedPatientId)
    : null;
  const unassigned = conversation.status === "unassigned";

  // lead with the patient identity, then supportive tags
  const nameTag = conversation.tags.find((t) => t.type === "name");
  const supportTags = conversation.tags.filter((t) => t.type !== "name");
  const isMatch = !!conversation.suggestedPatientId;
  const isIPD = conversation.context === "IPD";

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
            {/* context as text + time */}
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <span
                className={`text-[13px] font-bold tracking-wide ${
                  isIPD ? "text-blue-600" : "text-violet-600"
                }`}
              >
                {conversation.context}
              </span>
              <MetaRow time={conversation.time} duration={conversation.duration} />
            </div>

            {/* identity-first tags — at the top, under the context line */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {assigned ? (
                <IdentityChip name={assigned.name} tone="assigned" size="sm" />
              ) : (
                <IdentityChip
                  name={nameTag ? nameTag.value : "Unidentified"}
                  tone={isMatch ? "match" : "nomatch"}
                  size="sm"
                />
              )}
              {supportTags.slice(0, 2).map((t, i) => (
                <IdentifierTag key={i} type={t.type} value={t.value} size="sm" />
              ))}
              {supportTags.length > 2 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  +{supportTags.length - 2}
                </span>
              )}
            </div>

            <h3 className="mb-1.5 pr-5 text-[15px] font-semibold leading-snug text-slate-800">
              {conversation.title}
            </h3>

            <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-500">
              {conversation.summary}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
              <StatusChip status={conversation.status} />
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
