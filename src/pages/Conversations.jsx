import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ConversationCard } from "../components/conversation/ConversationCard.jsx";
import { Segmented } from "../components/ui/Segmented.jsx";
import { useStore } from "../store/store.jsx";

// Top level: assignment status
const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "needreview", label: "Need review" },
  { key: "assigned", label: "Assigned" },
];

// Second level: care context
const CONTEXT_TABS = [
  { key: "both", label: "Both" },
  { key: "IPD", label: "IPD" },
  { key: "OPD", label: "OPD" },
];

export default function Conversations() {
  const { conversations, stats } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [context, setContext] = useState("both");
  const [query, setQuery] = useState("");

  // honour ?status= when arriving from Home stat cards
  useEffect(() => {
    const s = searchParams.get("status");
    if (s && ["all", "needreview", "assigned"].includes(s)) setStatus(s);
  }, [searchParams]);

  const setStatusFilter = (key) => {
    setStatus(key);
    setSearchParams(key === "all" ? {} : { status: key }, { replace: true });
  };

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      const matchStatus =
        status === "all"
          ? true
          : status === "needreview"
          ? c.status === "unassigned"
          : c.status !== "unassigned";
      const matchContext = context === "both" ? true : c.context === context;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.tags.some((t) => t.value.toLowerCase().includes(q));
      return matchStatus && matchContext && matchQuery;
    });
  }, [conversations, status, context, query]);

  return (
    <div className="min-h-full pb-28">
      {/* sticky header */}
      <div className="glass-strong sticky top-0 z-30 px-4 pb-3 pt-6">
        {/* title + context segmented (top-right) */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.01em] text-slate-900">
              Captures
            </h1>
            <p className="text-[12px] font-medium text-slate-500">
              {stats.pendingReview} of {conversations.length} need review
            </p>
          </div>
          <Segmented
            id="ctx"
            options={CONTEXT_TABS}
            value={context}
            onChange={setContext}
          />
        </div>

        {/* search */}
        <div className="glass-soft flex items-center gap-2 rounded-xl border border-slate-200/60 px-3 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, bed, MRN…"
            className="w-full bg-transparent text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* status chips */}
        <div className="mt-3 flex gap-2">
          {STATUS_FILTERS.map((f) => {
            const active = status === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  active ? "text-white" : "glass-soft border border-slate-200/60 text-slate-600"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="status-pill"
                    className="absolute inset-0 rounded-full bg-blue-500"
                    transition={{ type: "spring", damping: 26, stiffness: 320 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* flat list — no session segregation */}
      <div className="px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="mt-24 flex flex-col items-center gap-2 text-center">
            <p className="text-[14px] font-semibold text-slate-500">
              Nothing here yet
            </p>
            <p className="text-[12px] text-slate-400">
              No conversations match this filter.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((c, i) => (
              <ConversationCard key={c.id} conversation={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
