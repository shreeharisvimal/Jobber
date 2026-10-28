import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Monitor, Smartphone, Tablet, Globe } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import type { Session } from "@/types/auth";

function getDeviceIcon(session: Session) {
  const info = (session.device_info ?? "").toLowerCase();
  const os = (session.os ?? "").toLowerCase();
  const browser = (session.browser ?? "").toLowerCase();

  if (
    info.includes("mobile") ||
    os.includes("android") ||
    os.includes("iphone")
  ) {
    return Smartphone;
  }
  if (info.includes("tablet") || info.includes("ipad")) {
    return Tablet;
  }
  if (browser.includes("chrome") || browser.includes("firefox") || browser.includes("safari") || browser.includes("edge")) {
    return Monitor;
  }
  return Globe;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

export function SessionsPage() {
  const queryClient = useQueryClient();
  const [confirmRevokeAllOpen, setConfirmRevokeAllOpen] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);

  const {
    data: sessions,
    isLoading,
    error,
  } = useQuery<Session[]>({
    queryKey: ["auth", "sessions"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/sessions");
      return response.data?.data ?? response.data;
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete("/auth/sessions", {
        data: { revoke_all: true },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
      setConfirmRevokeAllOpen(false);
    },
  });

  const currentSession = sessions?.find((s) => s.is_active);
  const otherSessions = sessions?.filter((s) => !s.is_active) ?? [];

  return (
    <PageContainer narrow>
      <div className="space-y-8">
        <PageHeader
          title="Sessions"
          description="Manage your active sessions"
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" color="primary" />
          </div>
        ) : error ? (
          <Alert
            variant="danger"
            title="Failed to load sessions"
            description="Please try again later."
          />
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Devices and browsers where you are currently signed in.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-0 divide-y divide-border">
                {sessions && sessions.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No active sessions found.
                  </p>
                )}

                {currentSession && (
                  <SessionRow
                    session={currentSession}
                    isCurrent
                    onRevoke={() => setSessionToRevoke(currentSession.id)}
                  />
                )}

                {otherSessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onRevoke={() => setSessionToRevoke(session.id)}
                  />
                ))}
              </CardContent>
              {otherSessions.length > 0 && (
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmRevokeAllOpen(true)}
                    disabled={revokeAllMutation.isPending}
                  >
                    Revoke all other sessions
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Revoke single session confirmation */}
            <ConfirmationDialog
              open={sessionToRevoke !== null}
              onOpenChange={(open) => {
                if (!open) setSessionToRevoke(null);
              }}
              title="Revoke session"
              description="This will immediately sign out this session. Are you sure?"
              confirmLabel="Revoke"
              variant="danger"
              loading={revokeMutation.isPending}
              onConfirm={() => {
                if (sessionToRevoke) {
                  revokeMutation.mutate(sessionToRevoke, {
                    onSettled: () => setSessionToRevoke(null),
                  });
                }
              }}
            />

            {/* Revoke all confirmation */}
            <ConfirmationDialog
              open={confirmRevokeAllOpen}
              onOpenChange={setConfirmRevokeAllOpen}
              title="Revoke all other sessions"
              description="This will immediately sign out all other sessions. You will remain signed in on this device."
              confirmLabel="Revoke all"
              variant="danger"
              loading={revokeAllMutation.isPending}
              onConfirm={() => revokeAllMutation.mutate()}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
}

interface SessionRowProps {
  session: Session;
  isCurrent?: boolean;
  onRevoke: () => void;
}

function SessionRow({ session, isCurrent = false, onRevoke }: SessionRowProps) {
  const DeviceIcon = getDeviceIcon(session);
  const browserName = session.browser ?? "Unknown browser";
  const osName = session.os ?? "Unknown OS";
  const ip = session.ip_address ?? "Unknown IP";

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
        <DeviceIcon className="size-5 text-neutral-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {browserName} on {osName}
          </span>
          {isCurrent && (
            <Badge variant="success" size="sm">
              Current
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{ip}</span>
          {session.location && (
            <>
              <span>·</span>
              <span>{session.location}</span>
            </>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Last active: {formatRelativeTime(session.last_activity_at)}
        </p>
      </div>

      {!isCurrent && (
        <Button
          variant="ghost"
          size="sm"
          className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
          onClick={onRevoke}
        >
          Revoke
        </Button>
      )}
    </div>
  );
}
