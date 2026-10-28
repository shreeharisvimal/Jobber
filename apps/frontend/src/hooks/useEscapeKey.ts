import { useEffect } from "react";

interface EscapeKeyOptions {
  enabled?: boolean;
}

export function useEscapeKey(
  handler: () => void,
  options?: EscapeKeyOptions,
): void {
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handler();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handler, enabled]);
}
