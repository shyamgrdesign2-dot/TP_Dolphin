import { useState } from "react";
import { motion } from "framer-motion";
import {
  Radio,
  BatteryMedium,
  ChevronRight,
  Mic,
  Languages,
  Stethoscope,
  ShieldCheck,
  Bell,
  FileText,
  LogOut,
  Cpu,
} from "lucide-react";
import { useStore } from "../store/store.jsx";
import { doctor } from "../data/mock.js";

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-10 rounded-full transition-colors ${
        on ? "bg-blue-500" : "bg-slate-300"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", damping: 26, stiffness: 400 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
        style={{ left: on ? 18 : 2 }}
      />
    </button>
  );
}

function Group({ title, children }) {
  return (
    <div className="mb-5">
      <h2 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl glass border border-slate-200/60">
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, sub, right, tint = "var(--tp-slate-500)", last }) {
  return (
    <div
      className={`flex items-center gap-3 px-3.5 py-3 ${
        last ? "" : "border-b border-slate-100"
      }`}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ background: "var(--tp-slate-50)" }}
      >
        <Icon size={16} style={{ color: tint }} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-slate-700">{label}</p>
        {sub && <p className="text-[12px] text-slate-400">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export default function Settings() {
  const { device } = useStore();
  const [prefs, setPrefs] = useState({
    autoSegment: true,
    diarisation: true,
    notify: true,
  });
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-full pb-28">
      <div className="px-4 pt-6">
        <h1 className="mb-4 text-[22px] font-bold tracking-[-0.01em] text-slate-900">
          Settings
        </h1>

        {/* profile */}
        <div className="relative mb-5 overflow-hidden rounded-2xl glass border border-slate-200/60 p-4">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-16"
            style={{ background: "linear-gradient(180deg, rgba(164,97,216,0.10), transparent)" }}
          />
          <div className="relative flex items-center gap-3">
            <div
              className="relative h-14 w-14 shrink-0 rounded-full p-[2px] shadow-[0_6px_18px_-6px_rgba(75,74,213,0.6)]"
              style={{ background: "var(--gradient-ai)" }}
            >
              <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-900/90 text-[16px] font-bold text-white">
                {doctor.initials}
              </span>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-bold text-slate-900">{doctor.name}</p>
              <p className="text-[12px] text-slate-500">
                {doctor.specialty} · {doctor.hospital}
              </p>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        </div>

        <Group title="Device">
          <Row
            icon={Radio}
            label={device.name}
            sub={`${device.model} · paired since ${device.pairedSince}`}
            tint="var(--tp-blue-500)"
            right={
              <span className="flex items-center gap-1 text-[12px] font-semibold text-success-600">
                <span className="h-2 w-2 rounded-full bg-success-500" />
                Online
              </span>
            }
          />
          <Row
            icon={BatteryMedium}
            label="Battery"
            sub="~5h recording remaining"
            right={
              <div className="flex items-center gap-2">
                <span className="block h-1.5 w-12 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className="block h-full rounded-full bg-success-500"
                    style={{ width: `${device.battery}%` }}
                  />
                </span>
                <span className="text-[13px] font-semibold text-slate-700">
                  {device.battery}%
                </span>
              </div>
            }
          />
          <Row
            icon={Cpu}
            label="Firmware"
            sub="v2.4.1 — up to date"
            right={<ChevronRight size={16} className="text-slate-300" />}
            last
          />
        </Group>

        <Group title="Capture & AI">
          <Row
            icon={Mic}
            label="Auto-segment conversations"
            sub="Split the day into per-patient chunks"
            tint="var(--tp-violet-600)"
            right={<Toggle on={prefs.autoSegment} onChange={set("autoSegment")} />}
          />
          <Row
            icon={Stethoscope}
            label="Speaker diarisation"
            sub="Label doctor vs patient turns"
            tint="var(--tp-violet-600)"
            right={<Toggle on={prefs.diarisation} onChange={set("diarisation")} />}
          />
          <Row
            icon={Languages}
            label="Languages"
            sub="English, Hindi, Marathi"
            right={<ChevronRight size={16} className="text-slate-300" />}
            last
          />
        </Group>

        <Group title="Notifications">
          <Row
            icon={Bell}
            label="Review reminders"
            sub="Notify when captures await assignment"
            tint="var(--tp-warning-600)"
            right={<Toggle on={prefs.notify} onChange={set("notify")} />}
            last
          />
        </Group>

        <Group title="Privacy & data">
          <Row
            icon={ShieldCheck}
            label="Data & encryption"
            sub="Audio encrypted at rest · auto-purge 30 days"
            tint="var(--tp-success-600)"
            right={<ChevronRight size={16} className="text-slate-300" />}
          />
          <Row
            icon={FileText}
            label="Consent & compliance"
            sub="ABDM · patient consent log"
            tint="var(--tp-success-600)"
            right={<ChevronRight size={16} className="text-slate-300" />}
            last
          />
        </Group>

        <button className="glass flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/60 py-3 text-[14px] font-semibold text-error-600">
          <LogOut size={16} /> Sign out
        </button>

        <p className="mt-5 text-center text-[11px] text-slate-400">
          Tatva Scribe · v0.1.0 POC
        </p>
      </div>
    </div>
  );
}
