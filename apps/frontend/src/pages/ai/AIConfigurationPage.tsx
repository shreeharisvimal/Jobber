import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  Save,
  RotateCcw,
  Shield,
  Coins,
  Database,
  Zap,
  Gauge,
  ToggleLeft,
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
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface AIConfiguration {
  defaultProvider: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  safety: {
    contentFilter: boolean;
    blockedTopics: string[];
    maxRequestSize: number;
  };
  costControl: {
    monthlyBudget: number;
    alertThreshold: number;
    autoDisable: boolean;
  };
  cache: {
    enabled: boolean;
    ttl: number;
    semanticCache: boolean;
  };
  queue: {
    enabled: boolean;
    maxConcurrent: number;
    timeout: number;
  };
  features: {
    streaming: boolean;
    fallback: boolean;
    autoRetry: boolean;
  };
}

const providerOptions = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
  { value: "azure", label: "Azure" },
];

export const AIConfigurationPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState<Partial<AIConfiguration>>({});

  const { data: config, isLoading, error } = useQuery<AIConfiguration>({
    queryKey: ["ai", "config"],
    queryFn: async () => {
      const response = await apiClient.get("/ai/config");
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (data: Partial<AIConfiguration>) => {
      const response = await apiClient.put("/ai/config", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "config"] });
      toast.success("Configuration saved");
      setForm({});
    },
    onError: () => {
      toast.error("Failed to save configuration");
    },
  });

  const resetConfigMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/ai/config/reset");
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "config"] });
      toast.success("Configuration reset to defaults");
      setForm({});
    },
    onError: () => {
      toast.error("Failed to reset configuration");
    },
  });

  const handleSave = () => {
    if (Object.keys(form).length === 0) {
      toast.warning("No changes to save");
      return;
    }
    updateConfigMutation.mutate(form);
  };

  const handleFieldChange = <K extends keyof AIConfiguration>(
    field: K,
    value: AIConfiguration[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = <
    K extends keyof AIConfiguration,
    N extends keyof AIConfiguration[K]
  >(
    field: K,
    nestedField: N,
    value: AIConfiguration[K][N]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...(config?.[field] as Record<string, unknown>),
        ...(prev[field] as Record<string, unknown>),
        [nestedField]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-8 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={300} />
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
            title="AI Configuration"
            description="Global AI settings and preferences"
            icon={<Settings className="size-5" />}
          />
          <Alert variant="danger" title="Failed to load configuration" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  const c = { ...config, ...form } as AIConfiguration;
  const hasChanges = Object.keys(form).length > 0;

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="AI Configuration"
          description="Configure global AI settings, safety, and cost controls"
          icon={<Settings className="size-5" />}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="size-4" />}
                onClick={() => resetConfigMutation.mutate()}
                loading={resetConfigMutation.isPending}
              >
                Reset Defaults
              </Button>
              <Button
                size="sm"
                leftIcon={<Save className="size-4" />}
                onClick={handleSave}
                loading={updateConfigMutation.isPending}
                disabled={!hasChanges}
              >
                Save Changes
              </Button>
            </div>
          }
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-brand-600" />
                  <div>
                    <CardTitle>Default Provider</CardTitle>
                    <CardDescription>Set the default AI provider and model</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Default Provider" htmlFor="defaultProvider">
                  <Select
                    id="defaultProvider"
                    value={c.defaultProvider}
                    onChange={(e) => handleFieldChange("defaultProvider", e.target.value)}
                  >
                    {providerOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Default Model" htmlFor="defaultModel">
                  <Input
                    id="defaultModel"
                    value={c.defaultModel}
                    onChange={(e) => handleFieldChange("defaultModel", e.target.value)}
                    placeholder="e.g., gpt-4"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Temperature" htmlFor="temperature">
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={c.temperature}
                      onChange={(e) =>
                        handleFieldChange("temperature", parseFloat(e.target.value) || 0)
                      }
                    />
                  </Field>
                  <Field label="Max Tokens" htmlFor="maxTokens">
                    <Input
                      id="maxTokens"
                      type="number"
                      min="1"
                      value={c.maxTokens}
                      onChange={(e) =>
                        handleFieldChange("maxTokens", parseInt(e.target.value, 10) || 1)
                      }
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-success-600" />
                  <div>
                    <CardTitle>Safety Settings</CardTitle>
                    <CardDescription>Configure content safety and limits</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Content Filter</p>
                    <p className="text-xs text-muted-foreground">
                      Filter potentially harmful or inappropriate content
                    </p>
                  </div>
                  <Switch
                    checked={c.safety.contentFilter}
                    onChange={(checked) =>
                      handleNestedChange("safety", "contentFilter", checked)
                    }
                  />
                </div>
                <Separator />
                <Field
                  label="Max Request Size (chars)"
                  htmlFor="maxRequestSize"
                >
                  <Input
                    id="maxRequestSize"
                    type="number"
                    min="100"
                    value={c.safety.maxRequestSize}
                    onChange={(e) =>
                      handleNestedChange(
                        "safety",
                        "maxRequestSize",
                        parseInt(e.target.value, 10) || 100
                      )
                    }
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Coins className="size-4 text-warning-600" />
                  <div>
                    <CardTitle>Cost Control</CardTitle>
                    <CardDescription>Set budget limits and alerts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Monthly Budget ($)" htmlFor="monthlyBudget">
                  <Input
                    id="monthlyBudget"
                    type="number"
                    min="0"
                    step="0.01"
                    value={c.costControl.monthlyBudget}
                    onChange={(e) =>
                      handleNestedChange(
                        "costControl",
                        "monthlyBudget",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </Field>
                <Field label="Alert Threshold (%)" htmlFor="alertThreshold">
                  <Input
                    id="alertThreshold"
                    type="number"
                    min="1"
                    max="100"
                    value={c.costControl.alertThreshold}
                    onChange={(e) =>
                      handleNestedChange(
                        "costControl",
                        "alertThreshold",
                        parseInt(e.target.value, 10) || 80
                      )
                    }
                  />
                </Field>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-Disable at Budget</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically disable AI when budget is exceeded
                    </p>
                  </div>
                  <Switch
                    checked={c.costControl.autoDisable}
                    onChange={(checked) =>
                      handleNestedChange("costControl", "autoDisable", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-brand-600" />
                  <div>
                    <CardTitle>Cache Settings</CardTitle>
                    <CardDescription>Configure response caching</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Enable Cache</p>
                    <p className="text-xs text-muted-foreground">
                      Cache AI responses to reduce costs
                    </p>
                  </div>
                  <Switch
                    checked={c.cache.enabled}
                    onChange={(checked) =>
                      handleNestedChange("cache", "enabled", checked)
                    }
                  />
                </div>
                <Separator />
                <Field label="Cache TTL (seconds)" htmlFor="cacheTtl">
                  <Input
                    id="cacheTtl"
                    type="number"
                    min="60"
                    value={c.cache.ttl}
                    onChange={(e) =>
                      handleNestedChange(
                        "cache",
                        "ttl",
                        parseInt(e.target.value, 10) || 3600
                      )
                    }
                  />
                </Field>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Semantic Cache</p>
                    <p className="text-xs text-muted-foreground">
                      Use semantic similarity for cache matching
                    </p>
                  </div>
                  <Switch
                    checked={c.cache.semanticCache}
                    onChange={(checked) =>
                      handleNestedChange("cache", "semanticCache", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Gauge className="size-4 text-brand-600" />
                  <div>
                    <CardTitle>Queue Settings</CardTitle>
                    <CardDescription>Configure request queuing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Enable Queue</p>
                    <p className="text-xs text-muted-foreground">
                      Queue requests when rate limits are hit
                    </p>
                  </div>
                  <Switch
                    checked={c.queue.enabled}
                    onChange={(checked) =>
                      handleNestedChange("queue", "enabled", checked)
                    }
                  />
                </div>
                <Separator />
                <Field label="Max Concurrent Requests" htmlFor="maxConcurrent">
                  <Input
                    id="maxConcurrent"
                    type="number"
                    min="1"
                    value={c.queue.maxConcurrent}
                    onChange={(e) =>
                      handleNestedChange(
                        "queue",
                        "maxConcurrent",
                        parseInt(e.target.value, 10) || 5
                      )
                    }
                  />
                </Field>
                <Field label="Request Timeout (seconds)" htmlFor="queueTimeout">
                  <Input
                    id="queueTimeout"
                    type="number"
                    min="10"
                    value={c.queue.timeout}
                    onChange={(e) =>
                      handleNestedChange(
                        "queue",
                        "timeout",
                        parseInt(e.target.value, 10) || 60
                      )
                    }
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ToggleLeft className="size-4 text-brand-600" />
                  <div>
                    <CardTitle>Feature Toggles</CardTitle>
                    <CardDescription>Enable or disable AI features</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Streaming</p>
                    <p className="text-xs text-muted-foreground">
                      Enable streaming responses from AI providers
                    </p>
                  </div>
                  <Switch
                    checked={c.features.streaming}
                    onChange={(checked) =>
                      handleNestedChange("features", "streaming", checked)
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Fallback</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically use backup provider on failure
                    </p>
                  </div>
                  <Switch
                    checked={c.features.fallback}
                    onChange={(checked) =>
                      handleNestedChange("features", "fallback", checked)
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-Retry</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically retry failed requests
                    </p>
                  </div>
                  <Switch
                    checked={c.features.autoRetry}
                    onChange={(checked) =>
                      handleNestedChange("features", "autoRetry", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {hasChanges && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Card className="shadow-lg">
              <CardContent className="flex items-center gap-4 py-3 px-6">
                <p className="text-sm text-muted-foreground">You have unsaved changes</p>
                <Button variant="outline" size="sm" onClick={() => setForm({})}>
                  Discard
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Save className="size-3" />}
                  onClick={handleSave}
                  loading={updateConfigMutation.isPending}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
