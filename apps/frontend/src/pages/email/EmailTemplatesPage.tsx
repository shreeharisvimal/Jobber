import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Copy,
  FileText,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmailTemplates, useCreateEmailTemplate, useDeleteEmailTemplate, useCloneEmailTemplate } from "@/hooks/useEmail";
import { useEmailStore } from "@/stores/email.store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const templateCategories = [
  { value: "all", label: "All Categories" },
  { value: "cold_outreach", label: "Cold Outreach" },
  { value: "follow_up", label: "Follow Up" },
  { value: "networking", label: "Networking" },
  { value: "thank_you", label: "Thank You" },
  { value: "interview_prep", label: "Interview Prep" },
  { value: "custom", label: "Custom" },
];

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="text" className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" className="h-4 w-48" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Skeleton variant="rectangular" className="h-8 w-16" />
          <Skeleton variant="rectangular" className="h-8 w-16" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function EmailTemplatesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body: "",
    category: "custom",
  });

  const { templateFilters } = useEmailStore();
  const { data: results, isLoading } = useEmailTemplates({
    search,
    category: categoryFilter,
    page,
  });
  const createMutation = useCreateEmailTemplate();
  const deleteMutation = useDeleteEmailTemplate();
  const cloneMutation = useCloneEmailTemplate();

  const templates = results?.items ?? [];
  const totalPages = results?.total_pages ?? 1;

  const handleCreate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) return;
    createMutation.mutate(newTemplate, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewTemplate({ name: "", subject: "", body: "", category: "custom" });
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleClone = (id: string) => {
    cloneMutation.mutate(id);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Email Templates"
          description="Create and manage email templates for your outreach"
          icon={<Mail className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => setIsCreateDialogOpen(true)}>
              New Template
            </Button>
          }
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {templateCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="size-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex gap-2 flex-wrap">
                      {templateCategories.map((cat) => (
                        <Button
                          key={cat.value}
                          variant={categoryFilter === cat.value ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setCategoryFilter(cat.value)}
                        >
                          {cat.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {isLoading ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : templates.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-7" />}
            title="No templates found"
            description={search ? "Try adjusting your search or filters." : "Create your first email template to get started."}
            action={
              !search
                ? { label: "New Template", onClick: () => setIsCreateDialogOpen(true) }
                : undefined
            }
          />
        ) : (
          <>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <Link
                          to={`/email/templates/${template.id}`}
                          className="font-medium hover:underline"
                        >
                          {template.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {template.subject}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {templateCategories.find((c) => c.value === template.category)?.label || template.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {template.usage_count}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Copy className="size-4" />}
                            onClick={() => handleClone(template.id)}
                          >
                            Clone
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Trash2 className="size-4" />}
                            onClick={() => handleDelete(template.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ChevronLeft className="size-4" />}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ChevronRight className="size-4" />}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {isCreateDialogOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Create New Template</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        placeholder="Template name"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        placeholder="Email subject"
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={newTemplate.category}
                        onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {templateCategories.filter((c) => c.value !== "all").map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Body</label>
                      <textarea
                        placeholder="Email body..."
                        className="w-full h-32 px-3 py-2 border rounded-md text-sm"
                        value={newTemplate.body}
                        onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.body}
                    >
                      Create Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
}