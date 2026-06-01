import { Sparkles, Clock, CircleCheck, CircleDashed } from "lucide-react";

/* IPD / OPD context badge. */
export function ContextBadge({ context, className = "" }) {
  const isIPD = context === "IPD";
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${
        isIPD
          ? "bg-blue-50 text-blue-600"
          : "bg-violet-100 text-violet-700"
      } ${className}`}
    >
      {context}
    </span>
  );
}

/* AI confidence as a compact meter. */
export function ConfidencePill({ value }) {
  const pct = Math.round(value * 100);
  const tone =
    pct >= 88
      ? "text-success-600"
      : pct >= 78
      ? "text-warning-600"
      : "text-slate-500";
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${tone}`}>
      <Sparkles size={11} strokeWidth={2.4} />
      {pct}%
    </span>
  );
}

/* Assignment status chip. */
export function StatusChip({ status }) {
  if (status === "unassigned") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-[11px] font-semibold text-warning-600">
        <CircleDashed size={11} strokeWidth={2.4} />
        Needs review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-600">
      <CircleCheck size={11} strokeWidth={2.4} />
      {status === "copied" ? "Copied to Rx" : "Assigned"}
    </span>
  );
}

export function MetaRow({ time, duration }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
      <Clock size={11} strokeWidth={2.2} />
      {time} · {duration}
    </span>
  );
}
