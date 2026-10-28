import { type FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  DollarSign,
  Globe,
  Heart,
  Bookmark,
  Share2,
  Download,
  Trash2,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Star,
  FileText,
  BarChart3,
  History,
  Send,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  employmentType: string;
  remoteStatus: string;
  source: string;
  sourceUrl: string | null;
  description: string;
  summary: string;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
  isSaved: boolean;
  isFavorite: boolean;
  tags: string[];
  requirements: JobRequirement[];
  skills: JobSkill[];
  responsibilities: string[];
  qualifications: JobQualification[];
  benefits: JobBenefit[];
  compensation: JobCompensation;
  locationDetails: JobLocationDetails;
  application: JobApplication;
  versions: JobVersion[];
}

interface JobRequirement {
  category: "required" | "preferred" | "nice-to-have";
  text: string;
}

interface JobSkill {
  name: string;
  required: boolean;
  proficiency?: "beginner" | "intermediate" | "advanced" | "expert";
}

interface JobQualification {
  type: string;
  text: string;
}

interface JobBenefit {
  category: string;
  name: string;
  value?: string;
}

interface JobCompensation {
  baseSalary: string;
  bonus?: string;
  equity?: string;
  signingBonus?: string;
}

interface JobLocationDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  remoteDetails?: string;
  relocationAssistance?: boolean;
}

interface JobApplication {
  methods: string[];
  deadline?: string;
  questions?: string[];
  applyUrl?: string;
}

interface JobVersion {
  id: string;
  version: number;
  snapshot: Record<string, unknown>;
  createdAt: string;
}

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "requirements", label: "Requirements" },
  { value: "skills", label: "Skills" },
  { value: "responsibilities", label: "Responsibilities" },
  { value: "qualifications", label: "Qualifications" },
  { value: "benefits", label: "Benefits" },
  { value: "compensation", label: "Compensation" },
  { value: "location", label: "Location" },
  { value: "application", label: "Application" },
  { value: "analysis", label: "Analysis" },
  { value: "versions", label: "Versions" },
];

const employmentTypeVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  "full-time": "success",
  "part-time": "info",
  contract: "warning",
  internship: "brand",
  temporary: "default",
};

const remoteStatusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  remote: "success",
  hybrid: "info",
  "on-site": "default",
};

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return "Not specified";
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));
}

export const JobDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: job, isLoading, error } = useQuery<JobDetail>({
    queryKey: ["jobs", id],
    queryFn: async () => {
      const response = await apiClient.get(`/jobs/${id}`);
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: async (isSaved: boolean) => {
      return apiClient.patch(`/jobs/${id}`, { isSaved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      toast.success("Job saved");
    },
    onError: () => {
      toast.error("Failed to save job");
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (isFavorite: boolean) => {
      return apiClient.patch(`/jobs/${id}`, { isFavorite });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      toast.success("Job favorited");
    },
    onError: () => {
      toast.error("Failed to update favorite status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiClient.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      toast.success("Job deleted");
      window.location.href = "/jobs";
    },
    onError: () => {
      toast.error("Failed to delete job");
    },
  });

  const createVersionMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post(`/jobs/${id}/versions`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      toast.success("Version created");
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleExport = async () => {
    try {
      const response = await apiClient.get(`/jobs/${id}/export`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${job?.title ?? "job"}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Failed to export job");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={400} />
        </div>
      </PageContainer>
    );
  }

  if (error || !job) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Job Details"
            description="View job information"
            backHref="/jobs"
          />
          <Alert variant="danger" title="Failed to load job" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title={job.title}
          description={job.company}
          backHref="/jobs"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant={job.isSaved ? "primary" : "outline"}
                size="sm"
                leftIcon={<Bookmark className="size-4" />}
                onClick={() => saveMutation.mutate(!job.isSaved)}
              >
                {job.isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant={job.isFavorite ? "primary" : "outline"}
                size="sm"
                leftIcon={<Heart className="size-4" />}
                onClick={() => favoriteMutation.mutate(!job.isFavorite)}
              >
                {job.isFavorite ? "Favorited" : "Favorite"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Share2 className="size-4" />}
                onClick={handleShare}
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="size-4" />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="size-4" />}
                onClick={() => createVersionMutation.mutate()}
                loading={createVersionMutation.isPending}
              >
                Create Version
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Trash2 className="size-4" />}
                onClick={() => deleteMutation.mutate()}
                loading={deleteMutation.isPending}
                className="border-danger-200 text-danger-600 hover:bg-danger-50"
              >
                Delete
              </Button>
            </div>
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={employmentTypeVariant[job.employmentType] ?? "default"} size="sm">
            {job.employmentType}
          </Badge>
          <Badge variant={remoteStatusVariant[job.remoteStatus] ?? "default"} size="sm">
            <Globe className="mr-1 size-3" />
            {job.remoteStatus}
          </Badge>
          <Badge variant="secondary" size="sm">
            <MapPin className="mr-1 size-3" />
            {job.location}
          </Badge>
          <Badge variant="secondary" size="sm">
            <DollarSign className="mr-1 size-3" />
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </Badge>
          <Badge variant="secondary" size="sm">
            {job.source}
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.summary && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground">{job.summary}</p>
                  </div>
                )}
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Posted</p>
                    <p className="text-sm">{formatDate(job.postedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Source</p>
                    <p className="text-sm flex items-center gap-1">
                      {job.source}
                      {job.sourceUrl && (
                        <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </p>
                  </div>
                </div>
                {job.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(["required", "preferred", "nice-to-have"] as const).map((category) => {
                  const items = job.requirements.filter((r) => r.category === category);
                  if (items.length === 0) return null;
                  return (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-foreground mb-3 capitalize flex items-center gap-2">
                        {category === "required" && <CheckCircle2 className="size-4 text-success-500" />}
                        {category === "preferred" && <Star className="size-4 text-warning-500" />}
                        {category === "nice-to-have" && <AlertCircle className="size-4 text-info-500" />}
                        {category}
                      </h4>
                      <ul className="space-y-2">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 size-1.5 rounded-full bg-foreground shrink-0" />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.filter((s) => s.required).map((skill) => (
                      <Badge key={skill.name} variant="default" size="sm">
                        {skill.name}
                        {skill.proficiency && <span className="ml-1 text-xs opacity-70">({skill.proficiency})</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Preferred Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.filter((s) => !s.required).map((skill) => (
                      <Badge key={skill.name} variant="secondary" size="sm">
                        {skill.name}
                        {skill.proficiency && <span className="ml-1 text-xs opacity-70">({skill.proficiency})</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responsibilities" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-medium text-brand-700">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qualifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(
                  job.qualifications.reduce<Record<string, string[]>>((acc, q) => {
                    (acc[q.type] ??= []).push(q.text);
                    return acc;
                  }, {})
                ).map(([type, items]) => (
                  <div key={type}>
                    <h4 className="text-sm font-semibold text-foreground mb-2">{type}</h4>
                    <ul className="space-y-1.5">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 size-1.5 rounded-full bg-foreground shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(
                  job.benefits.reduce<Record<string, Array<{ name: string; value?: string }>>>((acc, b) => {
                    (acc[b.category] ??= []).push({ name: b.name, value: b.value });
                    return acc;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-foreground mb-2 capitalize">{category}</h4>
                    <ul className="space-y-1.5">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="size-3 text-success-500" />
                            {item.name}
                          </span>
                          {item.value && <span className="text-xs font-medium">{item.value}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compensation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Base Salary</p>
                    <p className="text-lg font-semibold text-foreground mt-1">{job.compensation.baseSalary}</p>
                  </div>
                  {job.compensation.bonus && (
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Bonus</p>
                      <p className="text-lg font-semibold text-foreground mt-1">{job.compensation.bonus}</p>
                    </div>
                  )}
                  {job.compensation.equity && (
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Equity</p>
                      <p className="text-lg font-semibold text-foreground mt-1">{job.compensation.equity}</p>
                    </div>
                  )}
                  {job.compensation.signingBonus && (
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Signing Bonus</p>
                      <p className="text-lg font-semibold text-foreground mt-1">{job.compensation.signingBonus}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium text-foreground">{job.locationDetails.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {[job.locationDetails.city, job.locationDetails.state, job.locationDetails.country].filter(Boolean).join(", ")}
                  </p>
                  {job.locationDetails.postalCode && (
                    <p className="text-xs text-muted-foreground mt-1">{job.locationDetails.postalCode}</p>
                  )}
                </div>
                {job.locationDetails.remoteDetails && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Remote Details</p>
                    <p className="text-sm text-muted-foreground">{job.locationDetails.remoteDetails}</p>
                  </div>
                )}
                {job.locationDetails.relocationAssistance !== undefined && (
                  <div className="flex items-center gap-2">
                    {job.locationDetails.relocationAssistance ? (
                      <CheckCircle2 className="size-4 text-success-500" />
                    ) : (
                      <AlertCircle className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      Relocation assistance {job.locationDetails.relocationAssistance ? "available" : "not available"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="application" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Methods</p>
                  <div className="flex flex-wrap gap-2">
                    {job.application.methods.map((method) => (
                      <Badge key={method} variant="secondary" size="sm">{method}</Badge>
                    ))}
                  </div>
                </div>
                {job.application.deadline && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Deadline</p>
                    <p className="text-sm mt-1">{formatDate(job.application.deadline)}</p>
                  </div>
                )}
                {job.application.questions && job.application.questions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Application Questions</p>
                    <ul className="space-y-1.5">
                      {job.application.questions.map((q, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {job.application.applyUrl && (
                  <Button asChild>
                    <a href={job.application.applyUrl} target="_blank" rel="noopener noreferrer">
                      <Send className="mr-2 size-4" />
                      Apply Now
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                  <BarChart3 className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Analysis features coming soon</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link to={`/jobs/${id}/analysis`}>
                      View Full Analysis
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Version History</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="size-4" />}
                  onClick={() => createVersionMutation.mutate()}
                  loading={createVersionMutation.isPending}
                >
                  Create Version
                </Button>
              </CardHeader>
              <CardContent>
                {job.versions.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                    <History className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No versions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {job.versions.map((version) => (
                      <div key={version.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="info" size="sm">v{version.version}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(version.createdAt)}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/jobs/${id}/versions`}>
                            <FileText className="mr-1 size-3" />
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};
