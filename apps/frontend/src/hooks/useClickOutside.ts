import { useEffect, useRef } from "react";

interface ClickOutsideOptions {
  enabled?: boolean;
}

export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  options?: ClickOutsideOptions,
): React.RefObject<T | null> {
  const ref = useRef<T>(null);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      if (!ref.current) return;
      if (!event.target) return;
      if (!ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handler, enabled]);

  return ref;
}
