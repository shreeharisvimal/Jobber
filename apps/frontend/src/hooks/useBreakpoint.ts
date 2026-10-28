import { useSyncExternalStore } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  width: number;
}

function getWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
}

export function useBreakpoint(): BreakpointState {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isLaptop = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1279px)",
  );
  const isDesktop = useMediaQuery(
    "(min-width: 1280px) and (max-width: 1535px)",
  );
  const isLarge = useMediaQuery("(min-width: 1536px)");

  const width = useSyncExternalStore(subscribe, getWidth, () => 0);

  return { isMobile, isTablet, isLaptop, isDesktop, isLarge, width };
}
