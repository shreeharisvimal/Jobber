import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  MessageSquare,
  CheckSquare,
  FileText,
  Activity,
  Edit,
  Trash2,
  Plus,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecruiter, useRecruiterContacts, useRecruiterConversations, useRecruiterTasks } from "@/hooks/useCRM";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="rectangular" height={400} />
    </div>
  );
}

export default function RecruiterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: recruiter, isLoading } = useRecruiter(id!);
  const { data: contacts = [] } = useRecruiterContacts(id!);
  const { data: conversations = [] } = useRecruiterConversations(id!);
  const { data: tasks = [] } = useRecruiterTasks(id!);

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonDetail />
      </PageContainer>
    );
  }

  if (!recruiter) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="size-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold">Recruiter not found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This recruiter may have been removed.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/crm/recruiters">Back to Recruiters</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/crm/recruiters">
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        <PageHeader
          title={recruiter.name}
          description={`${recruiter.company} — ${recruiter.title ?? "Recruiter"}`}
          icon={<Users className="size-5" />}
          actions={
            <>
              <Button size="sm" variant="outline" leftIcon={<Edit className="size-4" />} asChild>
                <Link to={`/crm/recruiters/${id}/edit`}>Edit</Link>
              </Button>
              <Button size="sm" variant="destructive" leftIcon={<Trash2 className="size-4" />}>
                Delete
              </Button>
            </>
          }
        />

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{recruiter.status}</Badge>
          <Badge variant="outline">{recruiter.priority}</Badge>
          {recruiter.email && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="size-3" />
              {recruiter.email}
            </span>
          )}
          {recruiter.phone && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="size-3" />
              {recruiter.phone}
            </span>
          )}
          {recruiter.location && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3" />
              {recruiter.location}
            </span>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Company</h4>
                    <p className="text-sm">{recruiter.company}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
                    <p className="text-sm">{recruiter.title ?? "—"}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                    <p className="text-sm">{recruiter.department ?? "—"}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">LinkedIn</h4>
                    {recruiter.linkedin_url ? (
                      <a
                        href={recruiter.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Globe className="size-3" />
                        Profile
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
                {recruiter.notes && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <p className="text-sm whitespace-pre-wrap">{recruiter.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Contacts</CardTitle>
                  <CardDescription>{contacts.length} contact(s)</CardDescription>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Add Contact
                </Button>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No contacts yet. Add a contact person for this recruiter.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.role}</p>
                        </div>
                        <div className="flex gap-2">
                          {contact.email && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`mailto:${contact.email}`}>
                                <Mail className="size-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Conversations</CardTitle>
                  <CardDescription>{conversations.length} conversation(s)</CardDescription>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Log Conversation
                </Button>
              </CardHeader>
              <CardContent>
                {conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No conversations recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {conversations.map((conv) => (
                      <div key={conv.id} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{conv.type}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(conv.date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{conv.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Tasks</CardTitle>
                  <CardDescription>{tasks.length} task(s)</CardDescription>
                </div>
                <Button size="sm" leftIcon={<Plus className="size-4" />}>
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tasks. Create a task to follow up with this recruiter.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <CheckSquare className={cn("size-4", task.completed ? "text-success-600" : "text-muted-foreground")} />
                        <div className="flex-1">
                          <p className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                            {task.title}
                          </p>
                          {task.due_date && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Calendar className="size-3" />
                              {format(new Date(task.due_date), "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                        <Badge variant={task.completed ? "success" : "outline"}>
                          {task.completed ? "Done" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Activity tracking will appear here.
                </p>
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
                {recruiter.notes ? (
                  <p className="text-sm whitespace-pre-wrap">{recruiter.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No notes yet. Add notes to remember key details.
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
