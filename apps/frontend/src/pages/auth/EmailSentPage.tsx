import { Link, useSearchParams } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ROUTES } from "@/lib/constants";

function EmailSentPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "your email address";

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        {/* Icon */}
        <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100">
          <Mail className="size-8 text-neutral-400" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Check your email
          </h1>
          <p className="text-sm text-neutral-500">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-neutral-700">{email}</span>
          </p>
        </div>

        {/* Action */}
        <Button type="button" variant="secondary" size="lg">
          Open email app
        </Button>

        {/* Secondary links */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-neutral-500">
            Didn&apos;t receive it?{" "}
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="font-medium text-neutral-900 hover:underline"
            >
              Check spam or try again
            </Link>
          </p>
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

export { EmailSentPage };
