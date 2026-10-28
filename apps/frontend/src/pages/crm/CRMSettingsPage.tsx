import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  ArrowLeft,
  Save,
  Bell,
  Tag,
  Layout,
  Users,
  Briefcase,
  Database,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Field } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

export default function CRMSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    company_name: "",
    default_currency: "USD",
    email_notifications: true,
    task_reminders: true,
    weekly_digest: false,
    auto_archive_days: 90,
    default_recruiter_status: "active",
    default_application_stage: "application",
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // TODO: Save settings
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/crm">
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        <PageHeader
          title="CRM Settings"
          description="Configure your CRM preferences and defaults"
          icon={<Settings className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Save className="size-4" />} onClick={handleSave}>
              Save Changes
            </Button>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="defaults">Defaults</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General Settings</CardTitle>
                <CardDescription>Basic CRM configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Company Name">
                  <Input
                    placeholder="Your company name"
                    value={settings.company_name}
                    onChange={(e) => updateSetting("company_name", e.target.value)}
                  />
                </Field>

                <Field label="Default Currency">
                  <select
                    className="flex h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
                    value={settings.default_currency}
                    onChange={(e) => updateSetting("default_currency", e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </Field>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive email updates about application status changes
                    </p>
                  </div>
                  <Switch
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => updateSetting("email_notifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Task Reminders</p>
                    <p className="text-xs text-muted-foreground">
                      Get reminded about upcoming tasks and deadlines
                    </p>
                  </div>
                  <Switch
                    checked={settings.task_reminders}
                    onCheckedChange={(checked) => updateSetting("task_reminders", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Weekly Digest</p>
                    <p className="text-xs text-muted-foreground">
                      Receive a weekly summary of your CRM activity
                    </p>
                  </div>
                  <Switch
                    checked={settings.weekly_digest}
                    onCheckedChange={(checked) => updateSetting("weekly_digest", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defaults">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Default Values</CardTitle>
                <CardDescription>Set default values for new records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Default Recruiter Status">
                  <select
                    className="flex h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
                    value={settings.default_recruiter_status}
                    onChange={(e) => updateSetting("default_recruiter_status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="contacted">Contacted</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </Field>

                <Field label="Default Application Stage">
                  <select
                    className="flex h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
                    value={settings.default_application_stage}
                    onChange={(e) => updateSetting("default_application_stage", e.target.value)}
                  >
                    <option value="application">Application</option>
                    <option value="screening">Screening</option>
                    <option value="first_round">First Round</option>
                  </select>
                </Field>

                <Field label="Auto-Archive After (days)">
                  <Input
                    type="number"
                    value={settings.auto_archive_days}
                    onChange={(e) => updateSetting("auto_archive_days", parseInt(e.target.value) || 0)}
                  />
                </Field>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export Data</CardTitle>
                  <CardDescription>Download your CRM data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">
                    <Database className="mr-2 size-4" />
                    Export All Data (CSV)
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Delete All Applications</p>
                      <p className="text-xs text-muted-foreground">
                        Permanently delete all application records
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" leftIcon={<Trash2 className="size-4" />}>
                      Delete
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Reset CRM Data</p>
                      <p className="text-xs text-muted-foreground">
                        Remove all CRM data and start fresh
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" leftIcon={<Trash2 className="size-4" />}>
                      Reset All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
