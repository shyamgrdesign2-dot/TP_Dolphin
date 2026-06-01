import { motion } from "framer-motion";
import { BatteryMedium, Bluetooth, Pause, Play, Radio } from "lucide-react";
import { SiriWaveform } from "../ui/SiriWaveform.jsx";
import { AIMesh } from "../ui/backgrounds.jsx";
import { ShinyText } from "../ui/ShinyText.jsx";
import { useStore } from "../../store/store.jsx";

const STATUS = {
  listening: { label: "Listening", tone: "live" },
  paused: { label: "Paused", tone: "idle" },
  offline: { label: "Offline", tone: "off" },
};

export function DeviceHero() {
  const { device, setDeviceStatus, stats } = useStore();
  const active = device.status === "listening";
  const status = STATUS[device.status];

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 text-white shadow-[0_24px_60px_-12px_rgba(23,23,37,0.45),0_2px_8px_rgba(23,23,37,0.20)]"
      style={{
        background:
          "radial-gradient(120% 140% at 80% -10%, #2A2952 0%, #1B1B33 45%, #14132A 100%)",
      }}
    >
      <AIMesh active={active} className="opacity-90" />
      {/* glass specular edge highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px]"
        style={{
          padding: 1,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.30), rgba(255,255,255,0.04) 30%, transparent 60%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div
        className="pointer-events-none absolute -top-1/2 left-0 h-full w-full rounded-[28px] opacity-40"
        style={{ background: "radial-gradient(60% 50% at 50% 100%, rgba(255,255,255,0.10), transparent)" }}
      />
      {/* slow specular sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div
          className="absolute -inset-y-8 left-0 w-1/3 animate-hero-sheen"
          style={{
            background:
              "linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent)",
        }}
      />

      <div className="relative">
        {/* top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <Radio size={16} className="text-white" />
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold">{device.name}</p>
              <p className="text-[11px] text-white/55">{device.model}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-white/70">
            <span className="flex items-center gap-1 text-[11px] font-medium">
              <Bluetooth size={13} /> {device.signal}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium">
              <BatteryMedium size={15} /> {device.battery}%
            </span>
          </div>
        </div>

        {/* status pill */}
        <div className="mt-5 flex items-center gap-2">
          <span
            className={`relative flex h-2.5 w-2.5 items-center justify-center`}
          >
            {active && (
              <span className="absolute h-2.5 w-2.5 rounded-full bg-success-400 [animation:pulse-ring_1.6s_ease-out_infinite]" style={{ background: "var(--tp-success-500)" }} />
            )}
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status.tone === "live"
                  ? "bg-success-500"
                  : status.tone === "idle"
                  ? "bg-warning-500"
                  : "bg-slate-400"
              }`}
            />
          </span>
          <span className="text-[13px] font-semibold tracking-wide">
            {active ? <ShinyText>Capturing live</ShinyText> : status.label}
          </span>
          <span className="ml-auto text-[11px] text-white/50">
            since {device.pairedSince}
          </span>
        </div>

        {/* siri waveform */}
        <div className="my-3 h-20">
          <SiriWaveform active={active} className="h-full w-full" />
        </div>

        {/* footer: today line + toggle */}
        <div className="flex items-center justify-between">
          <div className="leading-tight">
            <p className="text-[22px] font-bold tabular-nums">
              {Math.floor(stats.capturedMinutes / 60)}h {stats.capturedMinutes % 60}m
            </p>
            <p className="text-[11px] text-white/55">captured today</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() =>
              setDeviceStatus(active ? "paused" : "listening")
            }
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 shadow-lg"
          >
            {active ? (
              <>
                <Pause size={15} fill="currentColor" /> Pause
              </>
            ) : (
              <>
                <Play size={15} fill="currentColor" /> Resume
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
