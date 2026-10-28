import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useForgotPasswordMutation } from "@/hooks/useAuthMutations";
import { ROUTES } from "@/lib/constants";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  const forgotPasswordMutation = useForgotPasswordMutation();

  function validate() {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    forgotPasswordMutation.mutate({ email: email.trim() });
  }

  const serverError =
    forgotPasswordMutation.error instanceof Error
      ? forgotPasswordMutation.error.message
      : null;

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Forgot your password?
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Error */}
        {serverError && (
          <Alert variant="danger" title="Something went wrong" description={serverError} />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="Email" htmlFor="forgot-email" required error={error}>
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(undefined);
              }}
              variant={error ? "error" : "default"}
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={forgotPasswordMutation.isPending}
          >
            Send reset link
          </Button>
        </form>

        {/* Back link */}
        <Link
          to={ROUTES.LOGIN}
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

export { ForgotPasswordPage };
