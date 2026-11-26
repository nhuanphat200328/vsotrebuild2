/**
 * Run a callback only after the browser has had a chance to settle layout and
 * fonts. This prevents observers from firing on a transient state while a
 * large image or swapped font is still changing the page height.
 */
export function afterLayoutStable(callback: () => void, delay = 80) {
  let cancelled = false;
  let timer = 0;
  let firstFrame = 0;
  let secondFrame = 0;

  firstFrame = requestAnimationFrame(() => {
    if (cancelled) return;
    secondFrame = requestAnimationFrame(() => {
      if (cancelled) return;
      const fontsReady =
        typeof document !== "undefined" && "fonts" in document
          ? document.fonts.ready
          : Promise.resolve();
      Promise.resolve(fontsReady).then(() => {
        if (cancelled) return;
        timer = window.setTimeout(callback, delay);
      });
    });
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(firstFrame);
    cancelAnimationFrame(secondFrame);
    clearTimeout(timer);
  };
}
