"use client";

import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab/Shift+Tab focus within a container while active, and moves
 * focus into it on activation — used by Modal and Drawer so keyboard
 * users can't silently tab into the (visually hidden) page behind them.
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    // Move focus in — prefer the first focusable element, fall back to the container itself.
    const initial = getFocusable()[0];
    if (initial) initial.focus();
    else container.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const els = getFocusable();
      if (els.length === 0) return;

      const first = els[0];
      const last = els[els.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);
}
