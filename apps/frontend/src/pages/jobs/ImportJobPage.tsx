import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  FileText,
  Link2,
  FileJson,
  FileImage,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface ImportHistory {
  id: string;
  method: string;
  source: string;
  status: "success" | "error" | "pending";
  jobTitle: string | null;
  company: string | null;
  errorMessage?: string;
  createdAt: string;
}

interface ImportPreview {
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  employmentType: string;
  remoteStatus: string;
  salaryMin: number | null;
  salaryMax: number | null;
}

const historyStatusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  success: "success",
  error: "default",
  pending: "warning",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export const ImportJobPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("text");
  const [pasteText, setPasteText] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [jsonValue, setJsonValue] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const analyzeTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiClient.post("/jobs/import/analyze", { text, method: "text" });
      return response.data?.data ?? response.data;
    },
    onSuccess: (data: ImportPreview) => {
      setPreview(data);
      setShowPreview(true);
      toast.success("Job data extracted");
    },
    onError: () => {
      toast.error("Failed to analyze job text");
    },
  });

  const fetchUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiClient.post("/jobs/import/analyze", { url, method: "url" });
      return response.data?.data ?? response.data;
    },
    onSuccess: (data: ImportPreview) => {
      setPreview(data);
      setShowPreview(true);
      toast.success("Job data fetched from URL");
    },
    onError: () => {
      toast.error("Failed to fetch job from URL");
    },
  });

  const analyzeJsonMutation = useMutation({
    mutationFn: async (json: string) => {
      const data = JSON.parse(json);
      const response = await apiClient.post("/jobs/import/analyze", { data, method: "json" });
      return response.data?.data ?? response.data;
    },
    onSuccess: (data: ImportPreview) => {
      setPreview(data);
      setShowPreview(true);
      toast.success("Job data imported from JSON");
    },
    onError: () => {
      toast.error("Failed to parse JSON");
    },
  });

  const importMutation = useMutation({
    mutationFn: async (previewData: ImportPreview) => {
      return apiClient.post("/jobs", previewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job imported successfully");
      setShowPreview(false);
      setPreview(null);
      setPasteText("");
      setUrlValue("");
      setJsonValue("");
    },
    onError: () => {
      toast.error("Failed to import job");
    },
  });

  const { data: history = [], isLoading: historyLoading } = useQuery<ImportHistory[]>({
    queryKey: ["jobs", "import-history"],
    queryFn: async () => {
      const response = await apiClient.get("/jobs/import-history");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleTextImport = () => {
    if (!pasteText.trim()) {
      toast.error("Please paste a job description");
      return;
    }
    analyzeTextMutation.mutate(pasteText);
  };

  const handleUrlImport = () => {
    if (!urlValue.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    fetchUrlMutation.mutate(urlValue);
  };

  const handleJsonImport = () => {
    if (!jsonValue.trim()) {
      toast.error("Please paste JSON data");
      return;
    }
    analyzeJsonMutation.mutate(jsonValue);
  };

  const handleConfirmImport = () => {
    if (!preview) return;
    importMutation.mutate(preview);
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Import Job"
          description="Import job listings from various sources"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="text">
              <FileText className="mr-1 size-4" />
              Paste Text
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link2 className="mr-1 size-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="json">
              <FileJson className="mr-1 size-4" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="pdf">
              <FileImage className="mr-1 size-4" />
              PDF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Paste Job Description</CardTitle>
                <CardDescription>
                  Paste the full job posting text and we'll extract the key details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Job Description" htmlFor="jobText" required>
                  <Textarea
                    id="jobText"
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    rows={12}
                    placeholder="Paste the complete job posting here..."
                  />
                </Field>
                <div className="flex justify-end">
                  <Button
                    leftIcon={<Upload className="size-4" />}
                    onClick={handleTextImport}
                    loading={analyzeTextMutation.isPending}
                  >
                    Analyze & Extract
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="url" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Import from URL</CardTitle>
                <CardDescription>
                  Enter the URL of a job listing and we'll fetch and parse it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Job URL" htmlFor="jobUrl" required>
                  <Input
                    id="jobUrl"
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    placeholder="https://linkedin.com/jobs/..."
                  />
                </Field>
                <div className="flex justify-end">
                  <Button
                    leftIcon={<Link2 className="size-4" />}
                    onClick={handleUrlImport}
                    loading={fetchUrlMutation.isPending}
                  >
                    Fetch & Extract
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Import from JSON</CardTitle>
                <CardDescription>
                  Paste JSON data containing job information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="JSON Data" htmlFor="jobJson" required>
                  <Textarea
                    id="jobJson"
                    value={jsonValue}
                    onChange={(e) => setJsonValue(e.target.value)}
                    rows={12}
                    placeholder='{"title": "Software Engineer", "company": "...", ...}'
                    className="font-mono text-sm"
                  />
                </Field>
                <div className="flex justify-end">
                  <Button
                    leftIcon={<FileJson className="size-4" />}
                    onClick={handleJsonImport}
                    loading={analyzeJsonMutation.isPending}
                  >
                    Parse & Extract
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdf" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Import from PDF</CardTitle>
                <CardDescription>
                  Upload a PDF file containing a job posting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center">
                  <Upload className="mx-auto mb-4 size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop a PDF file here, or click to browse</p>
                  <p className="text-xs text-muted-foreground/70">PDF files up to 10MB</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showPreview && preview && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Import Preview</CardTitle>
                  <CardDescription>Review the extracted data before saving</CardDescription>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => { setShowPreview(false); setPreview(null); }}>
                  <XCircle className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Title</p>
                  <p className="text-sm mt-1">{preview.title}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Company</p>
                  <p className="text-sm mt-1">{preview.company}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Location</p>
                  <p className="text-sm mt-1">{preview.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Employment Type</p>
                  <p className="text-sm mt-1">{preview.employmentType}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Remote Status</p>
                  <p className="text-sm mt-1">{preview.remoteStatus}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Salary</p>
                  <p className="text-sm mt-1">
                    {preview.salaryMin && preview.salaryMax
                      ? `$${(preview.salaryMin / 1000).toFixed(0)}k - $${(preview.salaryMax / 1000).toFixed(0)}k`
                      : "Not specified"}
                  </p>
                </div>
              </div>
              {preview.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {preview.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">{preview.description}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setShowPreview(false); setPreview(null); }}>Cancel</Button>
                <Button onClick={handleConfirmImport} loading={importMutation.isPending} leftIcon={<CheckCircle2 className="size-4" />}>
                  Confirm Import
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : history.length === 0 ? (
              <EmptyState
                icon={<Clock className="size-7" />}
                title="No import history"
                description="Your import history will appear here."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(record.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" size="sm">{record.method}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{record.source}</TableCell>
                      <TableCell className="text-sm">{record.jobTitle ?? "—"}</TableCell>
                      <TableCell className="text-sm">{record.company ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant={historyStatusVariant[record.status] ?? "default"} size="sm">
                          {record.status === "success" && <CheckCircle2 className="mr-1 size-3" />}
                          {record.status === "error" && <XCircle className="mr-1 size-3" />}
                          {record.status === "pending" && <Clock className="mr-1 size-3" />}
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
