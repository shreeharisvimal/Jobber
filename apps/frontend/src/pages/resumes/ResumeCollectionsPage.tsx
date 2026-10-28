import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  Download,
  X,
  Folder,
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Modal } from "@/components/ui/modal";

interface Collection {
  id: string;
  name: string;
  description: string;
  resumeCount: number;
  resumes: CollectionResume[];
  createdAt: string;
  updatedAt: string;
}

interface CollectionResume {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  views: number;
  downloads: number;
  updatedAt: string;
}

interface CollectionFormData {
  name: string;
  description: string;
}

const emptyForm: CollectionFormData = {
  name: "",
  description: "",
};

const statusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  draft: "warning",
  published: "success",
  archived: "default",
};

export const ResumeCollectionsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<CollectionFormData>(emptyForm);
  const [addingResumeToCollection, setAddingResumeToCollection] = useState<string | null>(null);
  const [removeResumeId, setRemoveResumeId] = useState<{ collectionId: string; resumeId: string } | null>(null);

  const { data: collections = [], isLoading, error } = useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await apiClient.get("/resumes/collections");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: availableResumes = [] } = useQuery<{ id: string; title: string }[]>({
    queryKey: ["resumes", "available"],
    queryFn: async () => {
      const response = await apiClient.get("/resumes", { params: { available: true } });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createCollectionMutation = useMutation({
    mutationFn: async (data: CollectionFormData) => {
      const response = await apiClient.post("/resumes/collections", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection created");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => {
      toast.error("Failed to create collection");
    },
  });

  const updateCollectionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CollectionFormData }) => {
      const response = await apiClient.put(`/resumes/collections/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection updated");
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => {
      toast.error("Failed to update collection");
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/resumes/collections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection deleted");
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Failed to delete collection");
    },
  });

  const addResumeMutation = useMutation({
    mutationFn: async ({ collectionId, resumeId }: { collectionId: string; resumeId: string }) => {
      const response = await apiClient.post(`/resumes/collections/${collectionId}/resumes`, { resumeId });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Resume added to collection");
      setAddingResumeToCollection(null);
    },
    onError: () => {
      toast.error("Failed to add resume");
    },
  });

  const removeResumeMutation = useMutation({
    mutationFn: async ({ collectionId, resumeId }: { collectionId: string; resumeId: string }) => {
      await apiClient.delete(`/resumes/collections/${collectionId}/resumes/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Resume removed from collection");
      setRemoveResumeId(null);
    },
    onError: () => {
      toast.error("Failed to remove resume");
    },
  });

  const handleEdit = (collection: Collection) => {
    setEditingId(collection.id);
    setForm({ name: collection.name, description: collection.description });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateCollectionMutation.mutate({ id: editingId, data: form });
    } else {
      createCollectionMutation.mutate(form);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} />
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
          <PageHeader
            title="Collections"
            description="Organize your resumes into collections"
          />
          <Alert variant="danger" title="Failed to load collections" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Collections"
          description="Organize your resumes into named collections"
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setShowForm(true);
              }}
            >
              Create Collection
            </Button>
          }
        />

        {collections.length === 0 && !showForm ? (
          <EmptyState
            icon={<FolderOpen className="size-7" />}
            title="No collections yet"
            description="Create a collection to organize your resumes by purpose, target role, or any criteria."
            action={{
              label: "Create Collection",
              onClick: () => {
                setEditingId(null);
                setForm(emptyForm);
                setShowForm(true);
              },
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showForm && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>{editingId ? "Edit Collection" : "New Collection"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Collection Name" htmlFor="collectionName" required>
                    <Input
                      id="collectionName"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="My Collection"
                    />
                  </Field>
                  <Field label="Description" htmlFor="collectionDesc">
                    <Textarea
                      id="collectionDesc"
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="What is this collection for?"
                      rows={2}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmit}
                      loading={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                      disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                    >
                      {editingId ? "Update" : "Create"}
                    </Button>
                    <Button variant="ghost" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {collections.map((collection) => (
              <Card key={collection.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <Folder className="size-4" />
                      </span>
                      <div>
                        <CardTitle className="text-base">{collection.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {collection.resumeCount} {collection.resumeCount === 1 ? "resume" : "resumes"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setExpandedId(expandedId === collection.id ? null : collection.id)}
                      >
                        {expandedId === collection.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(collection)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(collection.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {collection.description && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{collection.description}</p>
                  </CardContent>
                )}
                {expandedId === collection.id && (
                  <CardContent className="space-y-3">
                    {collection.resumes.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No resumes in this collection
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {collection.resumes.map((resume) => (
                          <div
                            key={resume.id}
                            className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                          >
                            <Link
                              to={`/resumes/${resume.id}`}
                              className="flex-1 min-w-0"
                            >
                              <p className="text-sm font-medium truncate hover:underline">{resume.title}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <Badge variant={statusVariant[resume.status] ?? "default"} size="sm">
                                  {resume.status}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Eye className="size-3" />
                                  {resume.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="size-3" />
                                  {resume.downloads}
                                </span>
                              </div>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                setRemoveResumeId({ collectionId: collection.id, resumeId: resume.id })
                              }
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      leftIcon={<Plus className="size-3" />}
                      onClick={() => setAddingResumeToCollection(collection.id)}
                    >
                      Add Resume
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {addingResumeToCollection && (
          <Modal
            open={!!addingResumeToCollection}
            onOpenChange={(open) => !open && setAddingResumeToCollection(null)}
            title="Add Resume to Collection"
            size="md"
          >
            <div className="space-y-2">
              {availableResumes.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No resumes available</p>
              ) : (
                availableResumes.map((resume) => (
                  <button
                    key={resume.id}
                    type="button"
                    onClick={() =>
                      addResumeMutation.mutate({
                        collectionId: addingResumeToCollection,
                        resumeId: resume.id,
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent/50"
                  >
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{resume.title}</span>
                  </button>
                ))
              )}
            </div>
          </Modal>
        )}

        <ConfirmationDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Delete Collection"
          description="This will remove the collection but not the resumes within it. The resumes will remain in your account."
          confirmLabel="Delete Collection"
          onConfirm={() => deletingId && deleteCollectionMutation.mutate(deletingId)}
          loading={deleteCollectionMutation.isPending}
        />

        <ConfirmationDialog
          open={!!removeResumeId}
          onOpenChange={(open) => !open && setRemoveResumeId(null)}
          title="Remove Resume"
          description="Remove this resume from the collection? The resume will not be deleted."
          confirmLabel="Remove"
          onConfirm={() =>
            removeResumeId &&
            removeResumeMutation.mutate({
              collectionId: removeResumeId.collectionId,
              resumeId: removeResumeId.resumeId,
            })
          }
          loading={removeResumeMutation.isPending}
          variant="warning"
        />
      </div>
    </PageContainer>
  );
};
