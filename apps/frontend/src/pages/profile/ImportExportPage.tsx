import { type FC, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Upload,
  Download,
  FileJson,
  FileText,
  Linkedin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

type ImportSource = "linkedin" | "resume-json" | "resume-pdf" | "manual-json";
type ExportFormat = "json" | "structured" | "resume-engine";

interface ImportConflict {
  field: string;
  existingValue: string;
  incomingValue: string;
  resolution: "keep" | "replace" | "merge";
}

interface ImportResult {
  success: boolean;
  imported: number;
  conflicts: ImportConflict[];
  message: string;
}

const importSources: { value: ImportSource; label: string; icon: typeof Linkedin; description: string }[] = [
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, description: "Import from LinkedIn profile URL" },
  { value: "resume-json", label: "Resume JSON", icon: FileJson, description: "Import from a JSON file" },
  { value: "resume-pdf", label: "Resume PDF", icon: FileText, description: "Parse and import from PDF resume" },
  { value: "manual-json", label: "Paste JSON", icon: FileJson, description: "Paste JSON data directly" },
];

const exportFormats: { value: ExportFormat; label: string; description: string }[] = [
  { value: "json", label: "Raw JSON", description: "Complete profile data as JSON" },
  { value: "structured", label: "Structured Data", description: "Organized by section" },
  { value: "resume-engine", label: "Resume Engine", description: "Formatted for resume generation" },
];

export const ImportExportPage: FC = () => {
  const toast = useToast();
  const [selectedImportSource, setSelectedImportSource] = useState<ImportSource>("manual-json");
  const [importUrl, setImportUrl] = useState("");
  const [importJson, setImportJson] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>("json");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "experience", "education", "skills", "certifications", "projects",
    "languages", "volunteer", "publications", "patents", "awards",
    "recommendations", "goals", "custom",
  ]);
  const [conflicts, setConflicts] = useState<ImportConflict[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const allSections = [
    { id: "experience", label: "Work Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "certifications", label: "Certifications" },
    { id: "projects", label: "Projects" },
    { id: "languages", label: "Languages" },
    { id: "volunteer", label: "Volunteer" },
    { id: "publications", label: "Publications" },
    { id: "patents", label: "Patents" },
    { id: "awards", label: "Awards" },
    { id: "recommendations", label: "Recommendations" },
    { id: "goals", label: "Career Goals" },
    { id: "custom", label: "Custom Sections" },
  ];

  const importMutation = useMutation({
    mutationFn: async (payload: { source: ImportSource; data?: string; url?: string; file?: File }) => {
      const formData = new FormData();
      formData.append("source", payload.source);
      if (payload.data) formData.append("data", payload.data);
      if (payload.url) formData.append("url", payload.url);
      if (payload.file) formData.append("file", payload.file);
      const response = await apiClient.post("/career-profile/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.data ?? response.data as ImportResult;
    },
    onSuccess: (result: ImportResult) => {
      if (result.conflicts && result.conflicts.length > 0) {
        setConflicts(result.conflicts);
      }
      setImportResult(result);
      toast.success("Import completed", { description: result.message });
    },
    onError: () => {
      toast.error("Import failed", { description: "Please check your data and try again." });
    },
  });

  const resolveConflictMutation = useMutation({
    mutationFn: async (resolutions: ImportConflict[]) => {
      const response = await apiClient.post("/career-profile/import/resolve", { conflicts: resolutions });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      setConflicts([]);
      setImportResult(null);
      toast.success("Conflicts resolved", { description: "Your profile has been updated." });
    },
    onError: () => {
      toast.error("Failed to resolve conflicts");
    },
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImportFile(file);
  }, []);

  const handleImport = () => {
    if (selectedImportSource === "manual-json") {
      importMutation.mutate({ source: selectedImportSource, data: importJson });
    } else if (selectedImportSource === "linkedin" || selectedImportSource === "resume-json") {
      importMutation.mutate({ source: selectedImportSource, url: importUrl });
    } else if (selectedImportSource === "resume-pdf" && importFile) {
      importMutation.mutate({ source: selectedImportSource, file: importFile });
    }
  };

  const handleExport = async () => {
    try {
      const response = await apiClient.get("/career-profile/export", {
        params: { format: selectedExportFormat, sections: selectedSections.join(",") },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `career-profile.${selectedExportFormat === "json" ? "json" : selectedExportFormat === "resume-engine" ? "docx" : "json"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } catch {
      toast.error("Export failed");
    }
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    );
  };

  const updateConflictResolution = (index: number, resolution: "keep" | "replace" | "merge") => {
    setConflicts((prev) => prev.map((c, i) => i === index ? { ...c, resolution } : c));
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Import / Export"
          description="Import data from external sources or export your career profile"
          backHref="/profile"
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Upload className="size-5 text-brand-600" /> Import
            </h3>

            <Card>
              <CardHeader>
                <CardTitle>Select Source</CardTitle>
                <CardDescription>Choose where to import your data from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {importSources.map((source) => {
                    const Icon = source.icon;
                    return (
                      <button
                        key={source.value}
                        type="button"
                        onClick={() => {
                          setSelectedImportSource(source.value);
                          setImportUrl("");
                          setImportJson("");
                          setImportFile(null);
                          setConflicts([]);
                          setImportResult(null);
                        }}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                          selectedImportSource === source.value
                            ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200"
                            : "border-border hover:bg-accent/50"
                        )}
                      >
                        <Icon className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{source.label}</p>
                          <p className="text-xs text-muted-foreground">{source.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedImportSource === "linkedin" && (
                  <Field label="LinkedIn Profile URL" htmlFor="linkedin-url">
                    <Input
                      id="linkedin-url"
                      type="url"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </Field>
                )}
                {selectedImportSource === "resume-json" && (
                  <Field label="JSON File URL" htmlFor="json-url">
                    <Input
                      id="json-url"
                      type="url"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      placeholder="https://example.com/resume.json"
                    />
                  </Field>
                )}
                {selectedImportSource === "resume-pdf" && (
                  <Field label="Upload PDF Resume" htmlFor="pdf-upload">
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    {importFile && (
                      <p className="mt-1 text-xs text-muted-foreground">{importFile.name}</p>
                    )}
                  </Field>
                )}
                {selectedImportSource === "manual-json" && (
                  <Field label="Paste JSON Data" htmlFor="json-data">
                    <Textarea
                      id="json-data"
                      value={importJson}
                      onChange={(e) => setImportJson(e.target.value)}
                      rows={12}
                      placeholder={'{\n  "experience": [...],\n  "education": [...],\n  "skills": [...]\n}'}
                      className="font-mono text-xs"
                    />
                  </Field>
                )}
                <Button
                  onClick={handleImport}
                  loading={importMutation.isPending}
                  disabled={
                    importMutation.isPending ||
                    (selectedImportSource === "manual-json" && !importJson) ||
                    ((selectedImportSource === "linkedin" || selectedImportSource === "resume-json") && !importUrl) ||
                    (selectedImportSource === "resume-pdf" && !importFile)
                  }
                  leftIcon={<Upload className="size-4" />}
                >
                  Import Data
                </Button>
              </CardContent>
            </Card>

            {importResult && !importResult.conflicts?.length && (
              <Alert variant="success" title="Import Successful" description={importResult.message} />
            )}
          </div>

          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Download className="size-5 text-brand-600" /> Export
            </h3>

            <Card>
              <CardHeader>
                <CardTitle>Export Format</CardTitle>
                <CardDescription>Choose the format for your export</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exportFormats.map((format) => (
                    <button
                      key={format.value}
                      type="button"
                      onClick={() => setSelectedExportFormat(format.value)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                        selectedExportFormat === format.value
                          ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200"
                          : "border-border hover:bg-accent/50"
                      )}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{format.label}</p>
                        <p className="text-xs text-muted-foreground">{format.description}</p>
                      </div>
                      {selectedExportFormat === format.value && (
                        <CheckCircle2 className="size-4 text-brand-600" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Sections</CardTitle>
                <CardDescription>Choose which sections to include in the export</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSections(selectedSections.length === allSections.length ? [] : allSections.map((s) => s.id))}
                    className="text-xs font-medium text-brand-600 hover:underline"
                  >
                    {selectedSections.length === allSections.length ? "Deselect All" : "Select All"}
                  </button>
                  <span className="text-xs text-muted-foreground">({selectedSections.length}/{allSections.length})</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {allSections.map((section) => (
                    <label
                      key={section.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                        selectedSections.includes(section.id)
                          ? "border-brand-200 bg-brand-50"
                          : "border-border hover:bg-accent/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(section.id)}
                        onChange={() => toggleSection(section.id)}
                        className="size-3.5 rounded border-neutral-300"
                      />
                      {section.label}
                    </label>
                  ))}
                </div>
                <Button
                  onClick={handleExport}
                  disabled={selectedSections.length === 0}
                  leftIcon={<Download className="size-4" />}
                >
                  Export Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {conflicts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-5 text-warning-500" />
                Import Conflicts
              </CardTitle>
              <CardDescription>
                Review and resolve {conflicts.length} conflict(s) found during import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conflicts.map((conflict, index) => (
                <div key={index} className="rounded-lg border border-border p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{conflict.field}</p>
                    <div className="mt-1 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="text-[10px] font-medium uppercase text-muted-foreground">Existing</p>
                        <p className="text-sm">{conflict.existingValue || "(empty)"}</p>
                      </div>
                      <div className="rounded-md bg-brand-50/50 p-2">
                        <p className="text-[10px] font-medium uppercase text-brand-600">Incoming</p>
                        <p className="text-sm">{conflict.incomingValue || "(empty)"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(["keep", "replace", "merge"] as const).map((resolution) => (
                      <Button
                        key={resolution}
                        variant={conflict.resolution === resolution ? "primary" : "outline"}
                        size="xs"
                        onClick={() => updateConflictResolution(index, resolution)}
                      >
                        {resolution.charAt(0).toUpperCase() + resolution.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                onClick={() => resolveConflictMutation.mutate(conflicts)}
                loading={resolveConflictMutation.isPending}
              >
                Resolve All Conflicts
              </Button>
              <Button variant="ghost" onClick={() => { setConflicts([]); setImportResult(null); }}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
