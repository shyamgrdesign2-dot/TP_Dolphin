import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { ConversationCard } from "../components/conversation/ConversationCard.jsx";
import { useStore } from "../store/store.jsx";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unassigned", label: "Needs review" },
  { key: "assigned", label: "Assigned" },
  { key: "IPD", label: "IPD" },
  { key: "OPD", label: "OPD" },
];

export default function Conversations() {
  const { conversations, stats } = useStore();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "unassigned"
          ? c.status === "unassigned"
          : filter === "assigned"
          ? c.status !== "unassigned"
          : c.context === filter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.tags.some((t) => t.value.toLowerCase().includes(q));
      return matchFilter && matchQuery;
    });
  }, [conversations, filter, query]);

  // group by session, preserving order
  const groups = useMemo(() => {
    const map = new Map();
    for (const c of filtered) {
      if (!map.has(c.session)) map.set(c.session, []);
      map.get(c.session).push(c);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="min-h-full pb-28">
      {/* sticky header */}
      <div className="glass-strong sticky top-0 z-30 px-4 pb-3 pt-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-slate-900">Captures</h1>
            <p className="text-[12px] font-medium text-slate-500">
              {stats.pendingReview} of {conversations.length} need review
            </p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl glass-soft border border-slate-200/60 text-slate-500">
            <SlidersHorizontal size={17} />
          </button>
        </div>

        {/* search */}
        <div className="flex items-center gap-2 rounded-xl glass-soft border border-slate-200/60 px-3 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, bed, MRN…"
            className="w-full bg-transparent text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* filter chips */}
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  active
                    ? "text-white"
                    : "glass-soft border border-slate-200/60 text-slate-600"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
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

      {/* list */}
      <div className="px-4 pt-3">
        {groups.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-[14px] font-medium text-slate-400">
              No conversations match.
            </p>
          </div>
        )}
        {groups.map(([session, items]) => (
          <div key={session} className="mb-5">
            <div className="mb-2.5 flex items-center gap-2 px-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                {session}
              </span>
              <span className="text-[10px] font-bold text-slate-300">
                {items.length}
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="flex flex-col gap-3">
              {items.map((c, i) => (
                <ConversationCard key={c.id} conversation={c} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
