"use client";

import { useEffect, useRef } from "react";

/** Returns a ref to attach to a sentinel element; calls onIntersect when it scrolls into view. */
export function useInfiniteScrollTrigger(onIntersect: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
