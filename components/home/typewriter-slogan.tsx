"use client";

import { useEffect, useRef, useState } from "react";

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
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    let index = 0;
    const typeFirst = () => {
      if (cancelled) return;
      index += 1;
      setFirst(line1.slice(0, index));
      if (index < line1.length) {
        timers.push(setTimeout(typeFirst, 55));
      } else {
        timers.push(setTimeout(() => {
          setCursorLine(2);
          typeSecond(0);
        }, 260));
      }
    };
    const typeSecond = (position: number) => {
      if (cancelled) return;
      const next = position + 1;
      setSecond(line2.slice(0, next));
      if (next < line2.length) {
        timers.push(setTimeout(() => typeSecond(next), 55));
      } else {
        timers.push(setTimeout(() => {
          setDone(true);
          setCursorLine(0);
        }, 900));
      }
    };

    timers.push(setTimeout(() => {
      setFirst("");
      setSecond("");
      setDone(false);
      setCursorLine(1);
      typeFirst();
    }, 0));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [line1, line2]);

  return (
    <h1
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
