import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* Subtle 3D parallax tilt that tracks the pointer. Touch-safe: on touch
   devices pointer-move doesn't fire hover, so it gracefully stays flat and
   relies on the press scale. Wrap any card to give it depth. */
export function Tilt({ children, className = "", max = 8, scale = 1, glare = false, onClick }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 18 });
  const sy = useSpring(py, { stiffness: 220, damping: 18 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d", scale }}
      className={`relative ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.5), transparent 45%)`
            ),
          }}
        />
      )}
    </motion.div>
  );
}
