import { useSyncExternalStore } from "react";

function getServerSnapshot(): boolean {
  return false;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};

      const mql = window.matchMedia(query);

      mql.addEventListener("change", callback);
      callback();

      return () => {
        mql.removeEventListener("change", callback);
      };
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia(query).matches;
    },
    getServerSnapshot,
  );
}
