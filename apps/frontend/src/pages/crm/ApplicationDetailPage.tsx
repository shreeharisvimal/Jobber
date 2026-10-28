import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Briefcase,
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Plus,
  FileText,
  Clock,
  MessageSquare,
  Star,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplication, useApplicationTimeline, useApplicationDocuments } from "@/hooks/useCRM";
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
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "info" },
  interviewing: { label: "Interviewing", variant: "warning" },
  offer: { label: "Offer", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  withdrawn: { label: "Withdrawn", variant: "outline" },
  accepted: { label: "Accepted", variant: "success" },
};

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: application, isLoading } = useApplication(id!);
  const { data: timeline = [] } = useApplicationTimeline(id!);
  const { data: documents = [] } = useApplicationDocuments(id!);

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonDetail />
      </PageContainer>
    );
  }

  if (!application) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <Briefcase className="size-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold">Application not found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This application may have been removed.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/crm/applications">Back to Applications</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const statusInfo = statusConfig[application.status] ?? { label: application.status, variant: "outline" };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/crm/applications">
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        <PageHeader
          title={application.job_title}
          description={`${application.company} — ${application.location ?? "Remote"}`}
          icon={<Briefcase className="size-5" />}
          actions={
            <>
              {application.job_url && (
                <Button size="sm" variant="outline" leftIcon={<ExternalLink className="size-4" />} asChild>
                  <a href={application.job_url} target="_blank" rel="noopener noreferrer">
                    View Listing
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outline" leftIcon={<Edit className="size-4" />} asChild>
                <Link to={`/crm/applications/${id}/edit`}>Edit</Link>
              </Button>
              <Button size="sm" variant="destructive" leftIcon={<Trash2 className="size-4" />}>
                Delete
              </Button>
            </>
          }
        />

        <div className="flex flex-wrap gap-2">
          <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
          {application.salary_range && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="size-3" />
              {application.salary_range}
            </span>
          )}
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="size-3" />
            Applied {format(new Date(application.created_at), "MMM d, yyyy")}
          </span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{application.company}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Position</span>
                    <span className="font-medium">{application.job_title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{application.location ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Salary</span>
                    <span className="font-medium">{application.salary_range ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employment Type</span>
                    <span className="font-medium">{application.employment_type ?? "—"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Application Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stage</span>
                    <span className="font-medium">{application.stage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Applied Date</span>
                    <span className="font-medium">
                      {format(new Date(application.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recruiter</span>
                    <span className="font-medium">
                      {application.recruiter_name ?? "—"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Timeline</CardTitle>
                  <CardDescription>Key milestones in this application</CardDescription>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Add Event
                </Button>
              </CardHeader>
              <CardContent>
                {timeline.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No timeline events yet. Track your application progress here.
                  </p>
                ) : (
                  <div className="relative ml-3 border-l-2 border-muted pl-6 space-y-6">
                    {timeline.map((event) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-[31px] top-1 size-3 rounded-full bg-primary" />
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Documents</CardTitle>
                  <CardDescription>Resume, cover letter, and other files</CardDescription>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Upload
                </Button>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No documents uploaded. Attach your resume or cover letter.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <FileText className="size-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  No offers yet. Offers will appear here when received.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Interview Feedback</CardTitle>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Add Feedback
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  No interview feedback recorded. Add feedback after interviews.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Status changes and updates will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
