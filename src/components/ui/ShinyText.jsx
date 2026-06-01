/* AI-gradient text with a continuous sheen sweep — used for AI-authored labels. */
export function ShinyText({ children, className = "" }) {
  return (
    <span
      className={`bg-clip-text text-transparent animate-[shiny-sweep_4s_linear_infinite] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--ai-violet) 0%, var(--ai-pink) 25%, #fff 50%, var(--ai-pink) 75%, var(--ai-violet) 100%)",
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </span>
  );
}

/* Static AI-gradient text (no animation) for headings. */
export function GradientText({ children, className = "" }) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{ backgroundImage: "var(--gradient-ai)" }}
    >
      {children}
    </span>
  );
}
