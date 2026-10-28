import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Save } from "lucide-react";
import { useCareerSettings, useUpdateCareerSettings } from "@/hooks/useCareerCoach";

export function CareerCoachSettingsPage() {
  const { data: settings, isLoading } = useCareerSettings();
  const updateSettings = useUpdateCareerSettings();

  const [assessmentFrequency, setAssessmentFrequency] = useState("monthly");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoGenerateRecs, setAutoGenerateRecs] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  useEffect(() => {
    if (settings) {
      setAssessmentFrequency(settings.assessment_frequency ?? "monthly");
      setEmailNotifications(settings.email_notifications ?? true);
      setPushNotifications(settings.push_notifications ?? false);
      setAutoGenerateRecs(settings.auto_generate_recommendations ?? true);
      setGoalReminders(settings.goal_reminders ?? true);
      setWeeklyReport(settings.weekly_report ?? false);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate({
      assessment_frequency: assessmentFrequency,
      email_notifications: emailNotifications,
      push_notifications: pushNotifications,
      auto_generate_recommendations: autoGenerateRecs,
      goal_reminders: goalReminders,
      weekly_report: weeklyReport,
    });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Career Coach Settings"
            description="Configure your career coaching preferences"
            icon={<Settings className="size-5" />}
          />
          <Card>
            <CardContent className="py-12">
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={48} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Career Coach Settings"
          description="Configure your career coaching preferences"
          icon={<Settings className="size-5" />}
          actions={
            <Button
              size="sm"
              leftIcon={<Save className="size-4" />}
              isLoading={updateSettings.isPending}
              onClick={handleSave}
            >
              Save Settings
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Assessment Preferences</CardTitle>
            <CardDescription>
              Control how often career assessments are suggested
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium">Assessment Frequency</label>
              <select
                value={assessmentFrequency}
                onChange={(e) => setAssessmentFrequency(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Auto-generate Recommendations</p>
                <p className="text-xs text-muted-foreground">
                  Automatically generate new recommendations after assessments
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoGenerateRecs}
                onClick={() => setAutoGenerateRecs(!autoGenerateRecs)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                  autoGenerateRecs ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    autoGenerateRecs ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose how you'd like to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Email Notifications",
                description: "Receive email updates about your career progress",
                checked: emailNotifications,
                onChange: setEmailNotifications,
              },
              {
                label: "Push Notifications",
                description: "Receive in-app push notifications",
                checked: pushNotifications,
                onChange: setPushNotifications,
              },
              {
                label: "Goal Reminders",
                description: "Get reminders about upcoming goal deadlines",
                checked: goalReminders,
                onChange: setGoalReminders,
              },
              {
                label: "Weekly Report",
                description: "Receive a weekly summary of your career progress",
                checked: weeklyReport,
                onChange: setWeeklyReport,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.checked}
                  onClick={() => item.onChange(!item.checked)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                    item.checked ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      item.checked ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
