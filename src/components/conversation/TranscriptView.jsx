import { motion } from "framer-motion";

export function TranscriptView({ transcript }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 text-[11px] font-medium text-slate-400">
        Diarised transcript · speaker labels inferred by AI
      </p>
      {transcript.map((line, i) => {
        const isDoctor = line.speaker === "Doctor";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.26 }}
            className={`flex ${isDoctor ? "justify-start" : "justify-end"}`}
          >
            <div className={`max-w-[84%] ${isDoctor ? "" : "items-end"}`}>
              <div
                className={`mb-1 flex items-center gap-1.5 px-1 ${
                  isDoctor ? "" : "flex-row-reverse"
                }`}
              >
                <span
                  className={`text-[11px] font-semibold ${
                    isDoctor ? "text-blue-600" : "text-violet-600"
                  }`}
                >
                  {line.speaker}
                </span>
                <span className="text-[10px] font-medium text-slate-300">
                  {line.t}
                </span>
              </div>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  isDoctor
                    ? "rounded-tl-md glass text-slate-700 border border-white/50"
                    : "rounded-tr-md bg-blue-500 text-white"
                }`}
              >
                {line.text}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
