import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

/* Bottom sheet modal, mobile-native feel. Drag handle + scrim. */
export function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="glass-strong relative max-h-[82%] w-full overflow-hidden rounded-t-[24px] shadow-[0_-8px_40px_rgba(23,23,37,0.22)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
          >
            {/* specular top edge */}
            <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-slate-300/70" />
            </div>
            {title && (
              <div className="px-5 pb-3 pt-1 text-[16px] font-semibold text-slate-800">
                {title}
              </div>
            )}
            <div className="no-scrollbar overflow-y-auto px-5 pb-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
