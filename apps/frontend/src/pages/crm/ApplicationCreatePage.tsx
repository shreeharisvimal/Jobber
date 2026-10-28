import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  ArrowLeft,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { useCreateApplication } from "@/hooks/useCRM";
import type { ApplicationStage } from "@/types/crm";

const stageOptions: { value: ApplicationStage; label: string }[] = [
  { value: "application", label: "Application" },
  { value: "screening", label: "Screening" },
  { value: "first_round", label: "First Round" },
  { value: "second_round", label: "Second Round" },
  { value: "final_round", label: "Final Round" },
  { value: "offer", label: "Offer" },
];

export default function ApplicationCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateApplication();

  const [form, setForm] = useState({
    job_title: "",
    company: "",
    location: "",
    job_url: "",
    salary_range: "",
    employment_type: "full_time",
    stage: "application" as ApplicationStage,
    notes: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form, {
      onSuccess: (data) => {
        navigate(`/crm/applications/${data.id}`);
      },
    });
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/crm/applications">
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        <PageHeader
          title="New Application"
          description="Track a new job application"
          icon={<Briefcase className="size-5" />}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Job Title" required>
                <Input
                  placeholder="e.g. Senior Frontend Engineer"
                  value={form.job_title}
                  onChange={(e) => updateField("job_title", e.target.value)}
                  required
                />
              </Field>

              <Field label="Company" required>
                <Input
                  placeholder="e.g. Acme Corp"
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Location">
                  <Input
                    placeholder="e.g. San Francisco, CA"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </Field>

                <Field label="Salary Range">
                  <Input
                    placeholder="e.g. $120k - $150k"
                    value={form.salary_range}
                    onChange={(e) => updateField("salary_range", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Job URL">
                <Input
                  placeholder="https://..."
                  value={form.job_url}
                  onChange={(e) => updateField("job_url", e.target.value)}
                  leftIcon={<LinkIcon className="size-4 text-muted-foreground" />}
                />
              </Field>

              <Field label="Employment Type">
                <select
                  className="flex h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
                  value={form.employment_type}
                  onChange={(e) => updateField("employment_type", e.target.value)}
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </Field>

              <Field label="Stage">
                <select
                  className="flex h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
                  value={form.stage}
                  onChange={(e) => updateField("stage", e.target.value)}
                >
                  {stageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any additional notes about this application..."
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link to="/crm/applications">Cancel</Link>
            </Button>
            <Button type="submit" leftIcon={<Plus className="size-4" />} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Application"}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
