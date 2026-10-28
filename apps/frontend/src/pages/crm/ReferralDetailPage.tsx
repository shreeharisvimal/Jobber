import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ArrowLeft,
  Building2,
  Briefcase,
  Mail,
  Phone,
  User,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useReferral, useReferralActivity } from "@/hooks/useCRM";
import { format } from "date-fns";

function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="rectangular" height={400} />
    </div>
  );
}

const statusConfig: Record<string, { label: string; variant: string }> = {
  pending: { label: "Pending", variant: "warning" },
  active: { label: "Active", variant: "success" },
  submitted: { label: "Submitted", variant: "info" },
  accepted: { label: "Accepted", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  expired: { label: "Expired", variant: "outline" },
};

export default function ReferralDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: referral, isLoading } = useReferral(id!);
  const { data: activity = [] } = useReferralActivity(id!);

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonDetail />
      </PageContainer>
    );
  }

  if (!referral) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <Star className="size-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold">Referral not found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This referral may have been removed.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/crm/referrals">Back to Referrals</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const statusInfo = statusConfig[referral.status] ?? { label: referral.status, variant: "outline" };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/crm/referrals">
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        <PageHeader
          title={referral.referred_person_name}
          description={`${referral.position} at ${referral.company}`}
          icon={<Star className="size-5" />}
          actions={
            <>
              <Button size="sm" variant="outline" leftIcon={<Edit className="size-4" />} asChild>
                <Link to={`/crm/referrals/${id}/edit`}>Edit</Link>
              </Button>
              <Button size="sm" variant="destructive" leftIcon={<Trash2 className="size-4" />}>
                Delete
              </Button>
            </>
          }
        />

        <div className="flex flex-wrap gap-2">
          <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Building2 className="size-3" />
            {referral.company}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Briefcase className="size-3" />
            {referral.position}
          </span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Referral Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Referred Person</span>
                    <span className="font-medium">{referral.referred_person_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Position</span>
                    <span className="font-medium">{referral.position}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{referral.company}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    {referral.email ? (
                      <a href={`mailto:${referral.email}`} className="font-medium text-primary hover:underline flex items-center gap-1">
                        <Mail className="size-3" />
                        {referral.email}
                      </a>
                    ) : (
                      <span className="font-medium">—</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{referral.phone ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Relationship</span>
                    <span className="font-medium">{referral.relationship ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {format(new Date(referral.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Activity</CardTitle>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Log Activity
                </Button>
              </CardHeader>
              <CardContent>
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No activity recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activity.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <MessageSquare className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {format(new Date(item.date), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Notes</CardTitle>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Add Note
                </Button>
              </CardHeader>
              <CardContent>
                {referral.notes ? (
                  <p className="text-sm whitespace-pre-wrap">{referral.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No notes yet. Add notes about this referral.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
