import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  X,
  Save,
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
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";

interface Collection {
  id: string;
  name: string;
  description: string;
  jobCount: number;
  createdAt: string;
  updatedAt: string;
}

export const JobCollectionsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [newCollection, setNewCollection] = useState({ name: "", description: "" });
  const [editValues, setEditValues] = useState({ name: "", description: "" });

  const { data: collections = [], isLoading, error } = useQuery<Collection[]>({
    queryKey: ["jobs", "collections"],
    queryFn: async () => {
      const response = await apiClient.get("/jobs/collections");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return apiClient.post("/jobs/collections", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "collections"] });
      toast.success("Collection created");
      setIsCreating(false);
      setNewCollection({ name: "", description: "" });
    },
    onError: () => {
      toast.error("Failed to create collection");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; description: string } }) => {
      return apiClient.patch(`/jobs/collections/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "collections"] });
      toast.success("Collection updated");
      setEditingId(null);
    },
    onError: () => {
      toast.error("Failed to update collection");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/jobs/collections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "collections"] });
      toast.success("Collection deleted");
      setShowDeleteDialog(null);
    },
    onError: () => {
      toast.error("Failed to delete collection");
    },
  });

  const handleCreate = () => {
    if (!newCollection.name.trim()) {
      toast.error("Collection name is required");
      return;
    }
    createMutation.mutate(newCollection);
  };

  const handleUpdate = (id: string) => {
    if (!editValues.name.trim()) {
      toast.error("Collection name is required");
      return;
    }
    updateMutation.mutate({ id, data: editValues });
  };

  const startEditing = (collection: Collection) => {
    setEditingId(collection.id);
    setEditValues({ name: collection.name, description: collection.description });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={180} />
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
            title="Job Collections"
            description="Organize your saved jobs into collections"
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
          title="Job Collections"
          description="Organize your saved jobs into collections"
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => setIsCreating(true)}
            >
              New Collection
            </Button>
          }
        />

        {isCreating && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create Collection</CardTitle>
                  <CardDescription>Add a new job collection</CardDescription>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => setIsCreating(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Collection Name" htmlFor="collectionName" required>
                <Input
                  id="collectionName"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Dream Companies"
                />
              </Field>
              <Field label="Description" htmlFor="collectionDescription">
                <Textarea
                  id="collectionDescription"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe this collection..."
                />
              </Field>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button leftIcon={<Save className="size-4" />} onClick={handleCreate} loading={createMutation.isPending}>
                  Create Collection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {collections.length === 0 && !isCreating ? (
          <EmptyState
            icon={<FolderGit2 className="size-7" />}
            title="No collections yet"
            description="Create collections to organize your saved jobs by category, priority, or theme."
            action={{
              label: "Create Collection",
              onClick: () => setIsCreating(true),
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Card key={collection.id} className="h-full">
                <CardHeader>
                  {editingId === collection.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editValues.name}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Collection name"
                      />
                      <Textarea
                        value={editValues.description}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        placeholder="Description"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(collection.id)} loading={updateMutation.isPending}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <Link to={`/jobs/collections/${collection.id}`} className="flex-1">
                        <CardTitle className="text-base hover:underline">{collection.name}</CardTitle>
                        {collection.description && (
                          <CardDescription className="mt-1">{collection.description}</CardDescription>
                        )}
                      </Link>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => startEditing(collection)}
                        >
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setShowDeleteDialog(collection.id)}
                          className="text-danger-600 hover:text-danger-700"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Link to={`/jobs/collections/${collection.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Briefcase className="size-4" />
                    {collection.jobCount} job{collection.jobCount !== 1 ? "s" : ""}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {showDeleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Delete Collection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this collection? Jobs in this collection will not be deleted.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>Cancel</Button>
                  <Button
                    variant="outline"
                    onClick={() => deleteMutation.mutate(showDeleteDialog)}
                    loading={deleteMutation.isPending}
                    className="border-danger-200 text-danger-600 hover:bg-danger-50"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
