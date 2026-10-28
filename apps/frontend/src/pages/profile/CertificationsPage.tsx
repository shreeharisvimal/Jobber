import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
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
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  isActive: boolean;
  order: number;
}

interface CertFormData {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
}

const emptyForm: CertFormData = {
  name: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

export const CertificationsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<CertFormData>(emptyForm);

  const { data: certs = [], isLoading, error } = useQuery<Certification[]>({
    queryKey: ["career-profile", "certifications"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/certifications");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CertFormData) => {
      const response = await apiClient.post("/career-profile/certifications", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "certifications"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Certification added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add certification"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CertFormData }) => {
      const response = await apiClient.put(`/career-profile/certifications/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "certifications"] });
      toast.success("Certification updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update certification"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/career-profile/certifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "certifications"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Certification deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete certification"); },
  });

  const handleEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate ?? "",
      credentialId: cert.credentialId ?? "",
      credentialUrl: cert.credentialUrl ?? "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader title="Certifications" description="Manage your professional certifications" backHref="/profile" />
          <Alert variant="danger" title="Failed to load certifications" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Certifications"
          description="Manage your professional certifications"
          backHref="/profile"
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>
              Add Certification
            </Button>
          }
        />

        {certs.length === 0 && !showForm && (
          <EmptyState
            icon={<Award className="size-7" />}
            title="No certifications yet"
            description="Add your professional certifications to validate your expertise."
            action={{ label: "Add Certification", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }}
          />
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Certification" : "New Certification"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Certification Name" htmlFor="name" required>
                  <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="AWS Solutions Architect" />
                </Field>
                <Field label="Issuing Organization" htmlFor="issuer" required>
                  <Input id="issuer" value={form.issuer} onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))} placeholder="Amazon Web Services" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Issue Date" htmlFor="issueDate" required>
                  <Input id="issueDate" type="date" value={form.issueDate} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))} />
                </Field>
                <Field label="Expiry Date" htmlFor="expiryDate" hint="Leave blank if no expiry">
                  <Input id="expiryDate" type="date" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Credential ID" htmlFor="credentialId">
                  <Input id="credentialId" value={form.credentialId} onChange={(e) => setForm((p) => ({ ...p, credentialId: e.target.value }))} placeholder="ABC123XYZ" />
                </Field>
                <Field label="Credential URL" htmlFor="credentialUrl">
                  <Input id="credentialUrl" type="url" value={form.credentialUrl} onChange={(e) => setForm((p) => ({ ...p, credentialUrl: e.target.value }))} placeholder="https://..." />
                </Field>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                {editingId ? "Update" : "Add"} Certification
              </Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {certs.map((cert) => {
            const expired = isExpired(cert.expiryDate);
            return (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 cursor-grab text-muted-foreground"><GripVertical className="size-4" /></span>
                      <div>
                        <CardTitle className="text-base">{cert.name}</CardTitle>
                        <CardDescription>{cert.issuer}</CardDescription>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(cert.issueDate)}
                            {cert.expiryDate ? ` - ${formatDate(cert.expiryDate)}` : ""}
                          </span>
                          <Badge variant={expired ? "danger" : "success"} size="sm">
                            {expired ? "Expired" : "Active"}
                          </Badge>
                          {cert.credentialId && (
                            <span className="text-xs text-muted-foreground">ID: {cert.credentialId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {cert.credentialUrl && (
                        <Button variant="ghost" size="icon-sm" asChild>
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(cert)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(cert.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <ConfirmationDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Delete Certification"
          description="Are you sure you want to delete this certification?"
          confirmLabel="Delete"
          onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
          loading={deleteMutation.isPending}
        />
      </div>
    </PageContainer>
  );
};
