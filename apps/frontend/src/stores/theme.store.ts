import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "jobber-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyThemeToDOM(resolved: "light" | "dark") {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function loadPersistedTheme(): Theme {
  try {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return "system";
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable
  }
}

let mediaQueryCleanup: (() => void) | null = null;

function setupSystemListener(updateFn: (resolved: "light" | "dark") => void) {
  if (mediaQueryCleanup) {
    mediaQueryCleanup();
    mediaQueryCleanup = null;
  }

  if (typeof window === "undefined") return;

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = (e: MediaQueryListEvent) => {
    updateFn(e.matches ? "dark" : "light");
  };
  mql.addEventListener("change", listener);

  mediaQueryCleanup = () => {
    mql.removeEventListener("change", listener);
    mediaQueryCleanup = null;
  };
}

const initialPersisted = loadPersistedTheme();
const initialResolved = resolveTheme(initialPersisted);

// Apply immediately to avoid flash
applyThemeToDOM(initialResolved);

export function initializeTheme() {
  const stored = loadPersistedTheme();
  const resolved = resolveTheme(stored);
  applyThemeToDOM(resolved);

  if (stored === "system") {
    setupSystemListener((newResolved) => {
      const current = useThemeStore.getState();
      if (current.theme === "system") {
        applyThemeToDOM(newResolved);
        useThemeStore.setState({ resolvedTheme: newResolved });
      }
    });
  }
}

export type { Theme };

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialPersisted,
  resolvedTheme: initialResolved,

  setTheme: (theme) => {
    const resolved = resolveTheme(theme);
    persistTheme(theme);
    applyThemeToDOM(resolved);

    if (theme === "system") {
      setupSystemListener((newResolved) => {
        const current = get();
        if (current.theme === "system") {
          applyThemeToDOM(newResolved);
          set({ resolvedTheme: newResolved });
        }
      });
    } else {
      if (mediaQueryCleanup) {
        mediaQueryCleanup();
        mediaQueryCleanup = null;
      }
    }

    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const { theme } = get();
    const cycle: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    get().setTheme(cycle);
  },
}));

// Initialize system listener if needed
if (initialPersisted === "system") {
  setupSystemListener((newResolved) => {
    const current = useThemeStore.getState();
    if (current.theme === "system") {
      applyThemeToDOM(newResolved);
      useThemeStore.setState({ resolvedTheme: newResolved });
    }
  });
}
