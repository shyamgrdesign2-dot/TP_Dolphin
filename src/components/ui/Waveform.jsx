import { motion } from "framer-motion";

/* Siri-style live voice waveform. When `active`, bars breathe with a pseudo
   audio-reactive cadence; when idle they flatten to a calm baseline. */
export function Waveform({ active = true, bars = 28, className = "", color }) {
  const heights = [
    0.4, 0.7, 0.5, 0.9, 0.6, 1, 0.55, 0.8, 0.45, 0.95, 0.6, 0.75, 0.5, 0.85,
    0.65, 1, 0.5, 0.78, 0.42, 0.9, 0.58, 0.82, 0.48, 0.7, 0.6, 0.92, 0.52, 0.74,
  ];
  return (
    <div className={`flex items-center justify-center gap-[3px] ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const base = heights[i % heights.length];
        return (
          <motion.span
            key={i}
            className="w-[3px] rounded-full"
            style={{
              background:
                color ||
                "linear-gradient(180deg, var(--ai-pink), var(--ai-violet))",
            }}
            animate={
              active
                ? { height: [`${base * 40}%`, "100%", `${base * 55}%`] }
                : { height: "16%" }
            }
            transition={
              active
                ? {
                    duration: 0.9 + (i % 5) * 0.12,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: (i % 7) * 0.06,
                  }
                : { duration: 0.4 }
            }
          />
        );
      })}
    </div>
  );
}
