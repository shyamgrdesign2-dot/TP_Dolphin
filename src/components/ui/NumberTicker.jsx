import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

/* Animated count-up that fires when scrolled into view. */
export function NumberTicker({ value, className = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 26, stiffness: 140 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsub = spring.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
    return unsub;
  }, [spring, decimals]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
