import { type FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FolderOpen,
  Plus,
  FileText,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCoverLetterCollections,
  useCoverLetterCollectionDetail,
  useCreateCoverLetterCollection,
  useUpdateCoverLetterCollection,
  useDeleteCoverLetterCollection,
  useRemoveFromCoverLetterCollection,
} from "@/hooks/useCoverLetter";
import type { CoverLetterCollectionCreate } from "@/types/cover-letter";

function CollectionDialog({
  open,
  onClose,
  collectionId,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  collectionId?: string;
  initialData?: CoverLetterCollectionCreate;
}) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [color, setColor] = useState(initialData?.color ?? "#3b82f6");
  const createMutation = useCreateCoverLetterCollection();
  const updateMutation = useUpdateCoverLetterCollection();

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (collectionId) {
      updateMutation.mutate(
        { id: collectionId, data: { name, description, color } },
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
            {collectionId ? "Edit Collection" : "Create Collection"}
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
              {collectionId ? "Save Changes" : "Create"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CollectionDetail({ collectionId }: { collectionId: string }) {
  const { data: collection, isLoading } = useCoverLetterCollectionDetail(collectionId);
  const removeMutation = useRemoveFromCoverLetterCollection();

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

      {collection.letters && collection.letters.length > 0 ? (
        <div className="space-y-2">
          {collection.letters.map((letter) => (
            <Card key={letter.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <Link
                  to={`/cover-letter/${letter.id}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{letter.title}</p>
                    <p className="text-xs text-muted-foreground">{letter.job_title} at {letter.company_name}</p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    removeMutation.mutate({
                      collectionId: collection.id,
                      coverLetterId: letter.id,
                    })
                  }
                >
                  <Trash2 className="size-3.5 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No cover letters in this collection</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const CoverLetterCollectionsPage: FC = () => {
  const { id: selectedId } = useParams<{ id: string }>();
  const { data: collections = [], isLoading } = useCoverLetterCollections();
  const deleteMutation = useDeleteCoverLetterCollection();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Cover Letter Collections"
          description="Organize and manage your cover letters into collections"
          icon={<FolderOpen className="size-5" />}
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => {
                setEditingId(undefined);
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
            setEditingId(undefined);
          }}
          collectionId={editingId}
        />

        {selectedId ? (
          <div>
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <Link to="/cover-letter/collections">← Back to Collections</Link>
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
                <Link to={`/cover-letter/collections/${col.id}`} className="block p-5">
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
                        {col.letter_count} {col.letter_count === 1 ? "letter" : "letters"}
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
                      setEditingId(col.id);
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
                Create a collection to organize your cover letters
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
