import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Mail,
  Briefcase,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useReferrals } from "@/hooks/useCRM";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { ReferralStatus } from "@/types/crm";

const statusLabels: Record<ReferralStatus, { label: string; variant: string }> = {
  pending: { label: "Pending", variant: "warning" },
  active: { label: "Active", variant: "success" },
  submitted: { label: "Submitted", variant: "info" },
  accepted: { label: "Accepted", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  expired: { label: "Expired", variant: "outline" },
};

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Skeleton variant="rectangular" className="size-10 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-5 w-40" />
            <Skeleton variant="text" className="h-4 w-28" />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReferralListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data: results, isLoading } = useReferrals({
    search,
    status: statusFilter,
    page,
  });

  const referrals = results?.items ?? [];
  const totalPages = results?.total_pages ?? 1;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Referrals"
          description="Manage your employee referrals and referral requests"
          icon={<Star className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/crm/referrals/create">New Referral</Link>
            </Button>
          }
        />

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search referrals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(["all", ...Object.keys(statusLabels)] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(s as ReferralStatus | "all")}
              >
                {s === "all" ? "All" : statusLabels[s as ReferralStatus].label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : referrals.length === 0 ? (
          <EmptyState
            icon={<Star className="size-7" />}
            title="No referrals found"
            description={search ? "Try adjusting your search or filters." : "Start tracking referrals to boost your job search."}
            action={
              !search
                ? { label: "New Referral", onClick: () => (window.location.href = "/crm/referrals/create") }
                : undefined
            }
          />
        ) : (
          <>
            <div className="grid gap-4">
              {referrals.map((referral) => (
                <Card key={referral.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Star className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/crm/referrals/${referral.id}`}
                              className="font-semibold hover:underline"
                            >
                              {referral.referred_person_name}
                            </Link>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Briefcase className="size-3" />
                              {referral.position}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Building2 className="size-3" />
                              {referral.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={statusLabels[referral.status]?.variant as any}>
                              {statusLabels[referral.status]?.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(referral.created_at), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        {referral.notes && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {referral.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ChevronLeft className="size-4" />}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ChevronRight className="size-4" />}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
