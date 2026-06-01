import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Layers, UserCheck, Sparkles } from "lucide-react";
import { DeviceHero } from "../components/home/DeviceHero.jsx";
import { NumberTicker } from "../components/ui/NumberTicker.jsx";
import { ConversationCard } from "../components/conversation/ConversationCard.jsx";
import { Tilt } from "../components/ui/Tilt.jsx";
import { useStore } from "../store/store.jsx";
import { doctor, sessions } from "../data/mock.js";

function StatCard({ value, label, icon: Icon, tint, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex-1"
    >
      <Tilt max={10} className="group h-full">
        <div className="glass relative h-full overflow-hidden rounded-2xl p-3.5 shadow-[0_1px_2px_rgba(23,23,37,0.04),0_8px_22px_-12px_rgba(23,23,37,0.16)] transition-shadow duration-300 group-hover:shadow-[0_2px_6px_rgba(23,23,37,0.06),0_16px_36px_-16px_rgba(75,74,213,0.30)]">
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              padding: 1,
              background:
                "linear-gradient(150deg, rgba(255,255,255,0.95), rgba(226,226,234,0.85))",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <span
            className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl shadow-sm"
            style={{ background: tint.bg }}
          >
            <Icon size={16} style={{ color: tint.fg }} strokeWidth={2.4} />
          </span>
          <p className="text-[24px] font-bold leading-none text-slate-800">
            <NumberTicker value={value} />
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">{label}</p>
        </div>
      </Tilt>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { stats, conversations } = useStore();
  const latest = conversations.slice(0, 2);

  return (
    <div className="relative min-h-full pb-28">
      <div className="relative px-4 pt-7">
        {/* greeting / name bar */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium text-slate-500">Good morning</p>
            <h1 className="text-[21px] font-bold tracking-[-0.01em] text-slate-900">
              {doctor.name}
            </h1>
            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              {doctor.specialty} · {doctor.hospital}
            </p>
          </div>
          <button className="relative h-12 w-12 rounded-full p-[2px] shadow-[0_6px_18px_-6px_rgba(75,74,213,0.6)]" style={{ background: "var(--gradient-ai)" }}>
            <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-900/90 text-[14px] font-bold text-white backdrop-blur">
              {doctor.initials}
            </span>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 ring-2 ring-white" />
          </button>
        </div>

        <DeviceHero />

        {/* stats */}
        <div className="mt-4 flex gap-3">
          <StatCard
            value={stats.conversations}
            label="Conversations"
            icon={Layers}
            tint={{ bg: "var(--tp-blue-50)", fg: "var(--tp-blue-500)" }}
            delay={0.05}
          />
          <StatCard
            value={stats.pendingReview}
            label="Need review"
            icon={Sparkles}
            tint={{ bg: "var(--tp-warning-50)", fg: "var(--tp-warning-600)" }}
            delay={0.12}
          />
          <StatCard
            value={stats.assigned}
            label="Assigned"
            icon={UserCheck}
            tint={{ bg: "var(--tp-success-50)", fg: "var(--tp-success-600)" }}
            delay={0.19}
          />
        </div>

        {/* sessions strip */}
        <div className="mt-6">
          <h2 className="mb-2.5 text-[13px] font-semibold text-slate-700">
            Today's sessions
          </h2>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {sessions.map((s) => (
              <Tilt key={s.id} max={8} onClick={() => navigate("/conversations")} className="group min-w-[152px]">
                <div className="glass relative h-full overflow-hidden rounded-2xl p-3.5 text-left shadow-[0_1px_2px_rgba(23,23,37,0.04),0_8px_22px_-14px_rgba(23,23,37,0.18)] transition-shadow duration-300 group-hover:shadow-[0_2px_6px_rgba(23,23,37,0.06),0_16px_36px_-16px_rgba(75,74,213,0.26)]">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                      padding: 1,
                      background: "linear-gradient(150deg, rgba(255,255,255,0.95), rgba(226,226,234,0.85))",
                      WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                  <span
                    className={`mb-2 inline-flex w-fit items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      s.context === "IPD" ? "bg-blue-50 text-blue-600" : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {s.context}
                  </span>
                  <p className="text-[13px] font-semibold leading-tight text-slate-800">{s.name}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{s.window}</p>
                  <p className="mt-2 text-[12px] font-semibold text-slate-600">
                    {s.count} conversations
                  </p>
                </div>
              </Tilt>
            ))}
          </div>
        </div>

        {/* latest captures */}
        <div className="mt-6">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-slate-700">
              Latest captures
            </h2>
            <button
              onClick={() => navigate("/conversations")}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-500"
            >
              View all <ArrowRight size={13} strokeWidth={2.4} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {latest.map((c, i) => (
              <ConversationCard key={c.id} conversation={c} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
