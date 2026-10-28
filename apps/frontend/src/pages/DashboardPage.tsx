import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const modules = [
  { title: "Career Profile", description: "Manage your master career profile" },
  { title: "Resume Generator", description: "Generate tailored resumes" },
  { title: "ATS Optimizer", description: "Optimize for applicant tracking systems" },
  { title: "Job Analysis", description: "Analyze job descriptions" },
  { title: "Company Research", description: "Research potential employers" },
  { title: "Recruiter CRM", description: "Manage recruiter relationships" },
  { title: "Email Intelligence", description: "Smart email management" },
  { title: "Interview Prep", description: "Prepare for interviews" },
  { title: "Portfolio", description: "Generate your portfolio" },
  { title: "Analytics", description: "Career analytics dashboard" },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your AI Career Operating System</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Card key={mod.title} className="cursor-pointer transition-colors hover:bg-accent/50">
            <CardHeader>
              <CardTitle className="text-lg">{mod.title}</CardTitle>
              <CardDescription>{mod.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
