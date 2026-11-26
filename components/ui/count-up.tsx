"use client";

import { useEffect, useRef, useState } from "react";
import { afterLayoutStable } from "@/lib/utils/animation";

export function CountUp({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(value);
  const [emphasis, setEmphasis] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reduced = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(reduced);
    }

    let frame = 0;
    let completeTimer: ReturnType<typeof setTimeout> | undefined;
    let observer: IntersectionObserver | undefined;

    const cancelStable = afterLayoutStable(() => {
      if (started.current) return;
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting || started.current) return;
          started.current = true;
          setDisplay(0);
          const duration = 3600;
          const start = performance.now();

          const step = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) {
              frame = requestAnimationFrame(step);
            } else {
              setDisplay(value);
              setEmphasis(true);
              completeTimer = setTimeout(() => setEmphasis(false), 800);
            }
          };
          frame = requestAnimationFrame(step);
          observer?.disconnect();
        },
        { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(element);
    });

    return () => {
      cancelStable();
      observer?.disconnect();
      cancelAnimationFrame(frame);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [value]);

  return (
    <span
      ref={ref}
      aria-label={`${value}${suffix} ${label}`}
      className="inline-block tabular-nums transition-[transform,color] duration-700 ease-out"
      style={{
        transform: emphasis ? "scale(1.08)" : "scale(1)",
        color: emphasis ? "#d9480f" : undefined,
        transformOrigin: "center",
        willChange: "transform",
      }}
    >
      {display}
      {suffix}
    </span>
  );
}
