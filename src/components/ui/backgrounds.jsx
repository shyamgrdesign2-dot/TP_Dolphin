/* Ambient AI atmosphere layers. All are decorative + non-interactive. */

/* Soft animated gradient-mesh blobs behind the device hero. */
export function AIMesh({ className = "", active = true }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -top-16 -left-10 h-56 w-56 rounded-full blur-3xl opacity-60"
        style={{
          background: "radial-gradient(circle, var(--ai-pink), transparent 70%)",
          animation: active ? "blob-float 9s ease-in-out infinite" : "none",
        }}
      />
      <div
        className="absolute top-4 right-0 h-52 w-52 rounded-full blur-3xl opacity-50"
        style={{
          background: "radial-gradient(circle, var(--tp-blue-400), transparent 70%)",
          animation: active ? "blob-float 11s ease-in-out infinite reverse" : "none",
        }}
      />
      <div
        className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, var(--ai-violet), transparent 70%)",
          animation: active ? "blob-float 13s ease-in-out infinite" : "none",
        }}
      />
    </div>
  );
}

/* Faint dot grid texture. */
export function DotGrid({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(rgba(75,74,213,0.10) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
      }}
    />
  );
}
