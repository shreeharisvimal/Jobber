import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ROUTES } from "@/lib/constants";

function AccountLockedPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        {/* Icon */}
        <div className="flex size-16 items-center justify-center rounded-full bg-warning-50">
          <Lock className="size-8 text-warning-600" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Account locked
          </h1>
          <p className="max-w-sm text-sm text-neutral-500">
            Too many failed login attempts. Please try again later or reset your
            password.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link to={ROUTES.FORGOT_PASSWORD}>Reset password</Link>
          </Button>
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export { AccountLockedPage };
