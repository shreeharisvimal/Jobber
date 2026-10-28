import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useResetPasswordMutation } from "@/hooks/useAuthMutations";
import { ROUTES } from "@/lib/constants";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const resetPasswordMutation = useResetPasswordMutation();

  function validate() {
    const next: typeof errors = {};
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !validate()) return;
    resetPasswordMutation.mutate({ token, password });
  }

  const serverError =
    resetPasswordMutation.error instanceof Error
      ? resetPasswordMutation.error.message
      : null;

  if (!token) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-6 text-center">
          <Alert
            variant="danger"
            title="Invalid reset link"
            description="This password reset link is invalid or has expired. Please request a new one."
          />
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-medium text-neutral-900 hover:underline"
          >
            Request a new reset link
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Enter your new password
          </p>
        </div>

        {/* Error */}
        {serverError && (
          <Alert variant="danger" title="Reset failed" description={serverError} />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="New password" htmlFor="reset-password" required error={errors.password}>
            <PasswordInput
              id="reset-password"
              placeholder="Enter new password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
          </Field>

          <Field
            label="Confirm password"
            htmlFor="reset-confirm"
            required
            error={errors.confirmPassword}
          >
            <PasswordInput
              id="reset-confirm"
              placeholder="Re-enter new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={resetPasswordMutation.isPending}
          >
            Reset password
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

export { ResetPasswordPage };
