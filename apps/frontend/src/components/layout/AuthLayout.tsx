import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className={cn("flex w-full max-w-md flex-col items-center", className)}>
        {/* Brand */}
        <Link to={ROUTES.HOME} className="mb-8 flex flex-col items-center gap-1">
          <span className="text-2xl font-bold tracking-tight text-neutral-900">
            Jobber
          </span>
          <span className="text-sm text-neutral-500">AI Career OS</span>
        </Link>

        {/* Content */}
        <div className="w-full">{children}</div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} Jobber. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export { AuthLayout };
