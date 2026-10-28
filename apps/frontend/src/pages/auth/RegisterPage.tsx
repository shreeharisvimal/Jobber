import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useRegisterMutation } from "@/hooks/useAuthMutations";
import { ROUTES } from "@/lib/constants";

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One digit", test: (pw) => /\d/.test(pw) },
  { label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    full_name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const registerMutation = useRegisterMutation();

  const passwordResults = useMemo(
    () => passwordRules.map((rule) => ({ ...rule, met: rule.test(password) })),
    [password],
  );

  const allPasswordMet = passwordResults.every((r) => r.met);

  function validate() {
    const next: typeof errors = {};
    if (!fullName.trim()) next.full_name = "Full name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    else if (!allPasswordMet) next.password = "Password does not meet all requirements";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    registerMutation.mutate({
      full_name: fullName.trim(),
      email: email.trim(),
      password,
    });
  }

  const serverError =
    registerMutation.error instanceof Error ? registerMutation.error.message : null;

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Get started with Jobber
          </p>
        </div>

        {/* Error */}
        {serverError && (
          <Alert variant="danger" title="Registration failed" description={serverError} />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="Full name" htmlFor="reg-name" required error={errors.full_name}>
            <Input
              id="reg-name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.full_name) setErrors((prev) => ({ ...prev, full_name: undefined }));
              }}
              variant={errors.full_name ? "error" : "default"}
            />
          </Field>

          <Field label="Email" htmlFor="reg-email" required error={errors.email}>
            <Input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              variant={errors.email ? "error" : "default"}
            />
          </Field>

          <Field label="Password" htmlFor="reg-password" required error={errors.password}>
            <PasswordInput
              id="reg-password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
          </Field>

          {/* Password strength */}
          {password.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {passwordResults.map((rule) => (
                <li key={rule.label} className="flex items-center gap-2 text-xs">
                  {rule.met ? (
                    <Check className="size-3.5 shrink-0 text-success-600" />
                  ) : (
                    <X className="size-3.5 shrink-0 text-neutral-400" />
                  )}
                  <span
                    className={cn(
                      rule.met ? "text-success-700" : "text-neutral-500",
                    )}
                  >
                    {rule.label}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Field
            label="Confirm password"
            htmlFor="reg-confirm"
            required
            error={errors.confirmPassword}
          >
            <PasswordInput
              id="reg-confirm"
              placeholder="Re-enter your password"
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
            loading={registerMutation.isPending}
          >
            Create account
          </Button>
        </form>

        {/* Separator */}
        <Separator label="or" color="muted" />

        {/* OAuth */}
        <div className="flex flex-col gap-3">
          <Button type="button" variant="outline" size="lg" className="w-full" leftIcon={<GoogleIcon />}>
            Continue with Google
          </Button>
          <Button type="button" variant="outline" size="lg" className="w-full" leftIcon={<GithubIcon />}>
            Continue with GitHub
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-neutral-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export { RegisterPage };
