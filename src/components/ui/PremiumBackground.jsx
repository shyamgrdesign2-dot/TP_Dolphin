import { motion, useMotionValue, useTransform } from "framer-motion";

/* Ambient premium page backdrop — light mode. Layered: a soft vertical wash,
   three faint brand auroras that drift at different rates as the page scrolls
   (parallax depth), and a fine grain overlay. Sits fixed behind page content. */
export function PremiumBackground({ scrollY }) {
  const fallback = useMotionValue(0);
  const sy = scrollY || fallback;

  const yA = useTransform(sy, [0, 700], [0, 90]); // back layer — drifts most
  const yB = useTransform(sy, [0, 700], [0, -60]);
  const yC = useTransform(sy, [0, 700], [0, 50]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #FBFBFE 0%, #F5F6FB 42%, #F2F3F9 100%)",
        }}
      />
      {/* animated gradient (ported from VoiceRx Lite) — faint, gives glass
          surfaces colour to refract */}
      <motion.div
        style={{
          y: yA,
          backgroundImage: "url(/chat-bg.gif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute -inset-[10%] opacity-[0.10]"
      />
      {/* brand auroras (parallax) */}
      <motion.div
        style={{ y: yA, background: "radial-gradient(circle, rgba(164,97,216,0.16), transparent 70%)" }}
        className="absolute -top-24 -left-16 h-72 w-72 rounded-full blur-[80px]"
      />
      <motion.div
        style={{ y: yB, background: "radial-gradient(circle, rgba(75,74,213,0.14), transparent 70%)" }}
        className="absolute -top-10 -right-20 h-72 w-72 rounded-full blur-[80px]"
      />
      <motion.div
        style={{ y: yC, background: "radial-gradient(circle, rgba(213,101,234,0.08), transparent 70%)" }}
        className="absolute top-[40%] left-1/4 h-72 w-72 rounded-full blur-[90px]"
      />
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
