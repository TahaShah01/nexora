"use client";

import { useEffect, useState } from "react";

/** Returns `value`, but only after it hasn't changed for `delayMs` — the standard debounce pattern for search-as-you-type. */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
