import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Network,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  MapPin,
  Briefcase,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useNetworkingContacts } from "@/hooks/useCRM";
import { format } from "date-fns";
import type { NetworkingContactCategory } from "@/types/crm";

const categoryLabels: Record<NetworkingContactCategory, { label: string; variant: string }> = {
  colleague: { label: "Colleague", variant: "info" },
  friend: { label: "Friend", variant: "success" },
  mentor: { label: "Mentor", variant: "warning" },
  industry_peer: { label: "Industry Peer", variant: "secondary" },
  alumni: { label: "Alumni", variant: "info" },
  recruiter: { label: "Recruiter", variant: "danger" },
  other: { label: "Other", variant: "outline" },
};

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Skeleton variant="rectangular" className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-5 w-40" />
            <Skeleton variant="text" className="h-4 w-28" />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NetworkingContactListPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<NetworkingContactCategory | "all">("all");
  const [page, setPage] = useState(1);

  const { data: results, isLoading } = useNetworkingContacts({
    search,
    category: categoryFilter,
    page,
  });

  const contacts = results?.items ?? [];
  const totalPages = results?.total_pages ?? 1;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Networking Contacts"
          description="Your professional network at a glance"
          icon={<Network className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/crm/networking/contacts/create">Add Contact</Link>
            </Button>
          }
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["all", ...Object.keys(categoryLabels)] as const).map((c) => (
              <Button
                key={c}
                variant={categoryFilter === c ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCategoryFilter(c as NetworkingContactCategory | "all")}
              >
                {c === "all" ? "All" : categoryLabels[c as NetworkingContactCategory].label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={<Network className="size-7" />}
            title="No contacts found"
            description={search ? "Try adjusting your search or filters." : "Start building your professional network."}
            action={
              !search
                ? { label: "Add Contact", onClick: () => (window.location.href = "/crm/networking/contacts/create") }
                : undefined
            }
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/crm/networking/contacts/${contact.id}`}
                          className="font-semibold hover:underline text-sm"
                        >
                          {contact.name}
                        </Link>
                        {contact.company && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="size-3" />
                            {contact.company}
                          </p>
                        )}
                        {contact.title && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Briefcase className="size-3" />
                            {contact.title}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {contact.category && (
                            <Badge variant={categoryLabels[contact.category]?.variant as any}>
                              {categoryLabels[contact.category]?.label}
                            </Badge>
                          )}
                          {contact.last_contacted && (
                            <span className="text-xs text-muted-foreground">
                              Last: {format(new Date(contact.last_contacted), "MMM d")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
      </div>
    </PageContainer>
  );
}
