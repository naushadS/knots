import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Runs `effect` once after mount, with its cleanup on unmount. The one sanctioned effect: for
 * starting and stopping things outside React (a WebGL viewer, a worker, a document listener).
 * Remount with a `key` to start over instead of adding dependencies.
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (effect: () => void | (() => void)) => useEffect(effect, []);

/** Calls `onClose` when Escape is pressed, keeping the listener mounted once. */
export function useEscapeKey(onClose: () => void) {
  const onCloseRef = useRef(onClose);
  // oxlint-disable-next-line react/refs
  onCloseRef.current = onClose;
  useMountEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });
}

const noop = () => () => {};
/** False while prerendering and hydrating, true after; for parts that only exist in the browser. */
export const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
