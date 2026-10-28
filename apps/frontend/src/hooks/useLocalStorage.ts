import { useCallback, useSyncExternalStore } from "react";

function subscribe(key: string, callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === key) {
      callback();
    }
  };
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("storage", handler);
  };
}

function readLocalStorage<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

function writeLocalStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full or unavailable
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => readLocalStorage(key, initialValue),
    () => initialValue,
  );

  const setValue = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      const current = readLocalStorage(key, initialValue);
      const next =
        typeof valueOrUpdater === "function"
          ? (valueOrUpdater as (prev: T) => T)(current)
          : valueOrUpdater;
      writeLocalStorage(key, next);
    },
    [key, initialValue],
  );

  return [value, setValue];
}
