/* A traveling gradient beam around a rounded container — Magic-UI style.
   Parent must be position:relative + overflow:hidden + rounded. */
export function BorderBeam({ duration = 6, size = 90, delay = 0, className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
      style={{
        // Mask so only the 1px border ring shows the moving beam.
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "1.5px",
      }}
    >
      <div
        className="absolute aspect-square rounded-full animate-[border-beam_linear_infinite]"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background:
            "linear-gradient(90deg, transparent, var(--ai-pink), var(--ai-violet), var(--tp-blue-400), transparent)",
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`,
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}
