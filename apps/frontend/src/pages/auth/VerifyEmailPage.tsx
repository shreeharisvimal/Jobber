import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useResendVerificationMutation } from "@/hooks/useAuthMutations";
import { apiClient } from "@/lib/api-client";
import { ROUTES } from "@/lib/constants";

type VerifyState = "loading" | "success" | "error";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<VerifyState>(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState<string>(
    token ? "Verifying your email..." : "No verification token provided.",
  );

  const resendMutation = useResendVerificationMutation();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verify() {
      try {
        await apiClient.get(`/auth/verify-email?token=${encodeURIComponent(token!)}`);
        if (!cancelled) setState("success");
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Verification failed. The link may have expired or already been used.";
          setErrorMessage(message);
          setState("error");
        }
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state === "loading") {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-4 py-8">
          <Spinner size="lg" color="primary" />
          <p className="text-sm text-neutral-500">Verifying your email...</p>
        </div>
      </AuthLayout>
    );
  }

  if (state === "success") {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-success-50">
            <CheckCircle2 className="size-8 text-success-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Email verified!
            </h1>
            <p className="text-sm text-neutral-500">
              Your email has been verified successfully.
            </p>
          </div>
          <Button asChild variant="primary" size="lg">
            <Link to={ROUTES.DASHBOARD}>Continue to dashboard</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-danger-50">
          <AlertCircle className="size-8 text-danger-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Verification failed
          </h1>
          <Alert variant="danger" description={errorMessage} />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            loading={resendMutation.isPending}
            onClick={() => resendMutation.mutate()}
          >
            Resend verification email
          </Button>
          <Link
            to={ROUTES.LOGIN}
            className="text-center text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export { VerifyEmailPage };
