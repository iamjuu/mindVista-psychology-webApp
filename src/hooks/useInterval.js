import { useEffect, useRef } from "react";

/** Run callback on an interval while enabled. */
export function useInterval(callback, delayMs, enabled = true) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled || delayMs == null || delayMs <= 0) return undefined;
    const id = setInterval(() => callbackRef.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs, enabled]);
}
