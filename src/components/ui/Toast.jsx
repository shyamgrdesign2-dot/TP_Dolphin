import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, icon = "check") => {
    setToast({ message, icon, id: Math.random() });
    window.clearTimeout(window.__tpToastTimer);
    window.__tpToastTimer = window.setTimeout(() => setToast(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="pointer-events-none absolute inset-x-0 bottom-[92px] z-[60] flex justify-center px-6"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
          >
            <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-[0_8px_30px_rgba(23,23,37,0.32)]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-500">
                <Check size={11} strokeWidth={3} className="text-white" />
              </span>
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
