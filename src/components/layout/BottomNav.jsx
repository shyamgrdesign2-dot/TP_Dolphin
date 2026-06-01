import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Layers, Settings } from "lucide-react";
import { useStore } from "../../store/store.jsx";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/conversations", icon: Layers, label: "Captures" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { stats, device } = useStore();
  const listening = device.status === "listening";

  return (
    <nav className="absolute inset-x-0 bottom-0 z-40 px-4 pb-3 pt-2">
      <div
        className="relative mx-auto flex max-w-[420px] items-center justify-around overflow-hidden rounded-[24px] px-2 py-2"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          boxShadow:
            "0 10px 34px -6px rgba(23,23,37,0.18), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(255,255,255,0.25)",
        }}
      >
        {/* gradient hairline border */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[24px]"
          style={{
            padding: 1,
            background:
              "linear-gradient(150deg, rgba(255,255,255,0.95), rgba(255,255,255,0.2) 40%, rgba(164,97,216,0.25) 100%)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        {/* specular top highlight */}
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        {items.map(({ to, icon: Icon, label }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          const showBadge = to === "/conversations" && stats.pendingReview > 0;
          return (
            <NavLink
              key={to}
              to={to}
              className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-2.5 inset-y-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(238,238,255,0.95), rgba(245,239,254,0.9))",
                    boxShadow:
                      "0 6px 16px -6px rgba(75,74,213,0.45), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                  transition={{ type: "spring", damping: 26, stiffness: 300 }}
                />
              )}
              <span className="relative">
                <Icon
                  size={21}
                  strokeWidth={active ? 2.5 : 2}
                  className={active ? "text-blue-600" : "text-slate-500"}
                />
                {showBadge && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white shadow-[0_2px_6px_rgba(225,29,72,0.5)]">
                    {stats.pendingReview}
                  </span>
                )}
                {to === "/" && listening && (
                  <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-success-500 ring-2 ring-white" />
                )}
              </span>
              <span
                className={`relative text-[10px] font-semibold tracking-wide ${
                  active ? "text-blue-700" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
