import { useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { BottomNav } from "./components/layout/BottomNav.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { PremiumBackground } from "./components/ui/PremiumBackground.jsx";
import Home from "./pages/Home.jsx";
import Conversations from "./pages/Conversations.jsx";
import ConversationDetail from "./pages/ConversationDetail.jsx";
import Settings from "./pages/Settings.jsx";

function AnimatedRoutes() {
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/conversations/");
  // Keyed enter-only animation: when the path changes React swaps the keyed
  // node, so the previous page unmounts immediately (no overlap) and the new
  // one animates in. Avoids AnimatePresence stacking translucent glass pages.
  return (
    <motion.div
      key={location.pathname}
      className="h-full"
      initial={{ opacity: 0, x: isDetail ? 22 : 0, y: isDetail ? 0 : 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/conversations/:id" element={<ConversationDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </motion.div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const hideNav = pathname.startsWith("/conversations/");
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-slate-200/60 p-0 sm:p-6">
      {/* Phone frame */}
      <div className="relative h-[100dvh] w-full max-w-[440px] overflow-hidden bg-[#F5F6FB] shadow-[0_40px_90px_rgba(23,23,37,0.30)] sm:h-[920px] sm:rounded-[44px] sm:border-[10px] sm:border-slate-900">
        <PremiumBackground scrollY={scrollY} />
        {/* notch (desktop frame only) */}
        <div className="absolute left-1/2 top-0 z-50 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900 sm:block" />
        <ToastProvider>
          <div ref={scrollRef} className="no-scrollbar relative h-full overflow-y-auto">
            <AnimatedRoutes />
          </div>
          {!hideNav && <BottomNav />}
        </ToastProvider>
      </div>
    </div>
  );
}
