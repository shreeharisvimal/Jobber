import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100">
          <ShieldOff className="size-8 text-neutral-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Access denied</h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => window.history.back()}>
            Go back
          </Button>
          <Button asChild variant="ghost">
            <Link to={ROUTES.HOME}>Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
