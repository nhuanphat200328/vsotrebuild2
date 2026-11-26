"use client";

import { useEffect, useRef, useState } from "react";
import { afterLayoutStable } from "@/lib/utils/animation";

export function TypewriterSlogan({
  line1,
  line2,
}: {
  line1: string;
  line2: string;
}) {
  const [first, setFirst] = useState(line1);
  const [second, setSecond] = useState(line2);
  const [cursorLine, setCursorLine] = useState<0 | 1 | 2>(0);
  const [done, setDone] = useState(true);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const element = ref.current;
    if (!element) return;

    let cancelled = false;
    let started = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Keep the SSR text until hydration, then reserve the typed area.
    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        setFirst("");
        setSecond("");
        setDone(false);
        setCursorLine(1);
      }, 0),
    );

    let index = 0;
    const typeFirst = () => {
      if (cancelled) return;
      index += 1;
      setFirst(line1.slice(0, index));
      if (index < line1.length) {
        timers.push(setTimeout(typeFirst, 75));
      } else {
        timers.push(
          setTimeout(() => {
            setCursorLine(2);
            typeSecond(0);
          }, 320),
        );
      }
    };

    const typeSecond = (position: number) => {
      if (cancelled) return;
      const next = position + 1;
      setSecond(line2.slice(0, next));
      if (next < line2.length) {
        timers.push(setTimeout(() => typeSecond(next), 75));
      } else {
        timers.push(
          setTimeout(() => {
            setDone(true);
            setCursorLine(0);
          }, 1000),
        );
      }
    };

    let observer: IntersectionObserver | undefined;
    const cancelStable = afterLayoutStable(() => {
      if (cancelled || started) return;
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting || started) return;
          started = true;
          observer?.disconnect();
          setFirst("");
          setSecond("");
          setDone(false);
          setCursorLine(1);
          index = 0;
          typeFirst();
        },
        { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(element);
    });

    return () => {
      cancelled = true;
      cancelStable();
      observer?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [line1, line2]);

  return (
    <h1
      ref={ref}
      className="hero-slogan mt-5 font-extrabold tracking-tight text-ink-900"
      aria-label={`${line1} ${line2}`}
    >
      <span className="type-line">
        {first}
        {cursorLine === 1 ? <span className="type-cursor" aria-hidden /> : null}
      </span>
      <span className="type-line">
        {second}
        {cursorLine === 2 ? <span className="type-cursor" aria-hidden /> : null}
      </span>
      {done ? <span className="sr-only">{line1} {line2}</span> : null}
    </h1>
  );
}
