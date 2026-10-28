import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/lib/constants";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    full_name: string;
    is_active: boolean;
    is_verified: boolean;
    role: "user" | "admin" | "superadmin";
    avatar_url: string | null;
    created_at: string;
  };
}

export function OAuthCallbackPage() {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setError("Invalid callback parameters. Missing code or state.");
      return;
    }

    if (!provider) {
      setError("Invalid OAuth provider.");
      return;
    }

    let cancelled = false;

    async function handleCallback() {
      try {
        const response = await apiClient.post(
          `/auth/oauth/${provider}/callback`,
          { code, state },
        );

        if (cancelled) return;

        const data: OAuthTokenResponse =
          response.data?.data ?? response.data;

        login(data.user, {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
          expires_in: data.expires_in,
        });

        window.location.href = "/";
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong during sign in.";
        setError(message);
      }
    }

    handleCallback();

    return () => {
      cancelled = true;
    };
  }, [provider, searchParams, login]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <AlertCircle className="mx-auto size-10 text-danger-500" />
          <Alert variant="danger" title="Sign in failed" description={error} />
          <Button asChild variant="primary">
            <Link to={ROUTES.LOGIN}>Back to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-sm text-muted-foreground">Completing sign in…</p>
      </div>
    </div>
  );
}
