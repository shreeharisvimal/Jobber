import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { Spinner } from "@/components/ui/spinner";

interface GuestRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

function GuestRoute({
  children,
  redirectTo = ROUTES.HOME,
}: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export { GuestRoute };
export type { GuestRouteProps };
