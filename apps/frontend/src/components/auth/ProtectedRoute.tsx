import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  if (requiredRole && user && !hasRole(requiredRole)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

export { ProtectedRoute };
export type { ProtectedRouteProps };
