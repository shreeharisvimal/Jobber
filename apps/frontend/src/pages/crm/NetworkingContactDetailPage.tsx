import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Network,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Calendar,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  Briefcase,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkingContact, useNetworkingInteractions } from "@/hooks/useCRM";
import { format } from "date-fns";

function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="rectangular" height={400} />
    </div>
  );
}

const categoryConfig: Record<string, { label: string; variant: string }> = {
  colleague: { label: "Colleague", variant: "info" },
  friend: { label: "Friend", variant: "success" },
  mentor: { label: "Mentor", variant: "warning" },
  industry_peer: { label: "Industry Peer", variant: "secondary" },
  alumni: { label: "Alumni", variant: "info" },
  recruiter: { label: "Recruiter", variant: "danger" },
  other: { label: "Other", variant: "outline" },
};

export default function NetworkingContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: contact, isLoading } = useNetworkingContact(id!);
  const { data: interactions = [] } = useNetworkingInteractions(id!);

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonDetail />
      </PageContainer>
    );
  }

  if (!contact) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <Network className="size-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold">Contact not found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This contact may have been removed.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/crm/networking/contacts">Back to Contacts</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const categoryInfo = categoryConfig[contact.category] ?? { label: contact.category, variant: "outline" };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/crm/networking/contacts">
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        <PageHeader
          title={contact.name}
          description={`${contact.title ?? ""}${contact.company ? ` at ${contact.company}` : ""}`}
          icon={<Network className="size-5" />}
          actions={
            <>
              <Button size="sm" variant="outline" leftIcon={<Plus className="size-4" />}>
                Log Interaction
              </Button>
              <Button size="sm" variant="outline" leftIcon={<Edit className="size-4" />} asChild>
                <Link to={`/crm/networking/contacts/${id}/edit`}>Edit</Link>
              </Button>
              <Button size="sm" variant="destructive" leftIcon={<Trash2 className="size-4" />}>
                Delete
              </Button>
            </>
          }
        />

        <div className="flex flex-wrap gap-2">
          <Badge variant={categoryInfo.variant as any}>{categoryInfo.label}</Badge>
          {contact.email && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="size-3" />
              {contact.email}
            </span>
          )}
          {contact.phone && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="size-3" />
              {contact.phone}
            </span>
          )}
          {contact.location && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3" />
              {contact.location}
            </span>
          )}
          {contact.last_contacted && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="size-3" />
              Last contacted: {format(new Date(contact.last_contacted), "MMM d, yyyy")}
            </span>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{contact.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{contact.company ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-medium">{contact.title ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant={categoryInfo.variant as any}>{categoryInfo.label}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Strength</span>
                    <span className="font-medium">{contact.relationship_strength ?? "—"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contact.email && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`mailto:${contact.email}`}>
                        <Mail className="mr-2 size-4" />
                        Send Email
                      </a>
                    </Button>
                  )}
                  {contact.linkedin_url && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 size-4" />
                        LinkedIn Profile
                      </a>
                    </Button>
                  )}
                  {contact.phone && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`tel:${contact.phone}`}>
                        <Phone className="mr-2 size-4" />
                        Call
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Interaction History</CardTitle>
                  <CardDescription>{interactions.length} interaction(s)</CardDescription>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Log Interaction
                </Button>
              </CardHeader>
              <CardContent>
                {interactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No interactions recorded. Log your first interaction.
                  </p>
                ) : (
                  <div className="relative ml-3 border-l-2 border-muted pl-6 space-y-6">
                    {interactions.map((interaction) => (
                      <div key={interaction.id} className="relative">
                        <div className="absolute -left-[31px] top-1 size-3 rounded-full bg-primary" />
                        <div>
                          <p className="text-sm font-medium">{interaction.type}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {format(new Date(interaction.date), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                          {interaction.summary && (
                            <p className="text-sm text-muted-foreground mt-1">{interaction.summary}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Notes</CardTitle>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Add Note
                </Button>
              </CardHeader>
              <CardContent>
                {contact.notes ? (
                  <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No notes yet. Add notes about this contact.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
