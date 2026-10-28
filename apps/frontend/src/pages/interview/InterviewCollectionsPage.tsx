import { type FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FolderOpen,
  Plus,
  Video,
  ChevronRight,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInterviewCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "@/hooks/useInterview";
import type { InterviewCollection } from "@/types/interview";

function CollectionDialog({
  open,
  onClose,
  collection,
}: {
  open: boolean;
  onClose: () => void;
  collection?: InterviewCollection;
}) {
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [color, setColor] = useState(collection?.color ?? "#3b82f6");
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (collection) {
      updateMutation.mutate(
        { id: collection.id, data: { name, description, color } },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        { name, description, color },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">
            {collection ? "Edit Collection" : "Create Collection"}
          </CardTitle>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Collection name" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="size-8 cursor-pointer rounded border-0" />
              <span className="text-xs text-muted-foreground">{color}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} disabled={!name.trim()}>
              {collection ? "Save Changes" : "Create"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CollectionDetail({ collectionId }: { collectionId: string }) {
  const { data: collections = [], isLoading } = useInterviewCollections();
  const collection = collections.find((c) => c.id === collectionId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={80} />
        ))}
      </div>
    );
  }

  if (!collection) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FolderOpen className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">Collection not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="size-10 rounded-lg"
          style={{ backgroundColor: collection.color ?? "#e5e7eb" }}
        />
        <div>
          <h3 className="text-lg font-semibold">{collection.name}</h3>
          {collection.description && (
            <p className="text-sm text-muted-foreground">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" size="sm">{collection.item_count} sessions</Badge>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Video className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">Session list coming soon</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add sessions to this collection from the session list
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export const InterviewCollectionsPage: FC = () => {
  const { id: selectedId } = useParams<{ id: string }>();
  const { data: collections = [], isLoading } = useInterviewCollections();
  const deleteMutation = useDeleteCollection();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<InterviewCollection | undefined>();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Interview Collections"
          description="Organize and manage your interview sessions into collections"
          icon={<FolderOpen className="size-5" />}
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => {
                setEditingCollection(undefined);
                setDialogOpen(true);
              }}
            >
              New Collection
            </Button>
          }
        />

        <CollectionDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingCollection(undefined);
          }}
          collection={editingCollection}
        />

        {selectedId ? (
          <div>
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <Link to="/interview/collections">← Back to Collections</Link>
            </Button>
            <CollectionDetail collectionId={selectedId} />
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={140} />
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((col) => (
              <Card key={col.id} className="group relative overflow-hidden transition-shadow hover:shadow-md">
                <Link to={`/interview/collections/${col.id}`} className="block p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="size-10 shrink-0 rounded-lg"
                      style={{ backgroundColor: col.color ?? "#e5e7eb" }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">{col.name}</h3>
                      {col.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {col.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {col.item_count} {col.item_count === 1 ? "session" : "sessions"}
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingCollection(col);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteMutation.mutate(col.id);
                    }}
                  >
                    <Trash2 className="size-3.5 text-danger-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">No collections yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a collection to organize your interview sessions
              </p>
              <Button
                size="sm"
                leftIcon={<Plus className="size-4" />}
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                Create Collection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
