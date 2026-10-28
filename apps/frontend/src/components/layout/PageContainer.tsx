import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  fullWidth?: boolean;
  padding?: boolean;
}

function PageContainer({
  children,
  className,
  narrow = false,
  fullWidth = false,
  padding = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        !fullWidth && !narrow && "max-w-[1200px]",
        narrow && "max-w-[768px]",
        padding && "px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { PageContainer };
export type { PageContainerProps };
