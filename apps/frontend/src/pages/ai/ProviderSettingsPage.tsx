import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Server,
  Cpu,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface AIProvider {
  id: string;
  name: string;
  enabled: boolean;
  endpoint: string;
  apiKey: string;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  models: AIModel[];
  healthStatus: "healthy" | "degraded" | "down" | "unknown";
  lastHealthCheck: string;
  isDefault: boolean;
}

interface AIModel {
  id: string;
  name: string;
  enabled: boolean;
  isDefault: boolean;
  capabilities: {
    streaming: boolean;
    jsonMode: boolean;
    vision: boolean;
    functions: boolean;
  };
  maxTokens: number;
  costPer1kTokens: number;
}

const healthIcon: Record<string, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  degraded: AlertTriangle,
  down: XCircle,
  unknown: AlertTriangle,
};

const healthVariant: Record<string, "success" | "warning" | "default"> = {
  healthy: "success",
  degraded: "warning",
  down: "default",
  unknown: "default",
};

export const ProviderSettingsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "provider" | "model"; providerId: string; modelId?: string } | null>(null);

  const { data: providers = [], isLoading, error } = useQuery<AIProvider[]>({
    queryKey: ["ai", "providers"],
    queryFn: async () => {
      const response = await apiClient.get("/ai/providers");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateProviderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AIProvider> }) => {
      const response = await apiClient.put(`/ai/providers/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "providers"] });
      toast.success("Provider updated");
    },
    onError: () => {
      toast.error("Failed to update provider");
    },
  });

  const updateModelMutation = useMutation({
    mutationFn: async ({
      providerId,
      modelId,
      data,
    }: {
      providerId: string;
      modelId: string;
      data: Partial<AIModel>;
    }) => {
      const response = await apiClient.put(
        `/ai/providers/${providerId}/models/${modelId}`,
        data
      );
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "providers"] });
      toast.success("Model updated");
    },
    onError: () => {
      toast.error("Failed to update model");
    },
  });

  const healthCheckMutation = useMutation({
    mutationFn: async (providerId: string) => {
      const response = await apiClient.post(`/ai/providers/${providerId}/health-check`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "providers"] });
      toast.success("Health check complete");
    },
    onError: () => {
      toast.error("Health check failed");
    },
  });

  const deleteProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      await apiClient.delete(`/ai/providers/${providerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "providers"] });
      toast.success("Provider deleted");
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete provider");
    },
  });

  const deleteModelMutation = useMutation({
    mutationFn: async ({ providerId, modelId }: { providerId: string; modelId: string }) => {
      await apiClient.delete(`/ai/providers/${providerId}/models/${modelId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "providers"] });
      toast.success("Model deleted");
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete model");
    },
  });

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "provider") {
      deleteProviderMutation.mutate(deleteTarget.providerId);
    } else if (deleteTarget.type === "model" && deleteTarget.modelId) {
      deleteModelMutation.mutate({
        providerId: deleteTarget.providerId,
        modelId: deleteTarget.modelId,
      });
    }
  };

  const handleSetDefaultProvider = (providerId: string) => {
    providers.forEach((p) => {
      if (p.isDefault !== (p.id === providerId)) {
        updateProviderMutation.mutate({
          id: p.id,
          data: { isDefault: p.id === providerId },
        });
      }
    });
  };

  const handleSetDefaultModel = (providerId: string, modelId: string) => {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;
    provider.models.forEach((m) => {
      if (m.isDefault !== (m.id === modelId)) {
        updateModelMutation.mutate({
          providerId,
          modelId: m.id,
          data: { isDefault: m.id === modelId },
        });
      }
    });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} />
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
            title="Provider Settings"
            description="Configure AI providers and models"
            icon={<Settings className="size-5" />}
          />
          <Alert variant="danger" title="Failed to load providers" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Provider Settings"
          description="Configure AI providers, models, and health checks"
          icon={<Settings className="size-5" />}
        />

        {providers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Server className="mb-3 size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No providers configured</p>
              <p className="text-xs text-muted-foreground/70">
                Add AI providers to start using AI features
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => {
              const HealthIcon = healthIcon[provider.healthStatus] ?? AlertTriangle;

              return (
                <Card key={provider.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HealthIcon
                          className={cn(
                            "size-5",
                            provider.healthStatus === "healthy" && "text-success-600",
                            provider.healthStatus === "degraded" && "text-warning-600",
                            provider.healthStatus === "down" && "text-danger-600",
                            provider.healthStatus === "unknown" && "text-muted-foreground"
                          )}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{provider.name}</CardTitle>
                            {provider.isDefault && (
                              <Badge variant="brand" size="sm">Default</Badge>
                            )}
                          </div>
                          <CardDescription className="mt-0.5">{provider.endpoint}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={healthVariant[provider.healthStatus] ?? "default"} size="sm">
                          {provider.healthStatus}
                        </Badge>
                        <Switch
                          checked={provider.enabled}
                          onChange={(checked) =>
                            updateProviderMutation.mutate({
                              id: provider.id,
                              data: { enabled: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="API Endpoint" htmlFor={`endpoint-${provider.id}`}>
                        <Input
                          id={`endpoint-${provider.id}`}
                          value={provider.endpoint}
                          onChange={(e) =>
                            updateProviderMutation.mutate({
                              id: provider.id,
                              data: { endpoint: e.target.value },
                            })
                          }
                          placeholder="https://api.example.com"
                        />
                      </Field>
                      <Field label="API Key" htmlFor={`apikey-${provider.id}`}>
                        <Input
                          id={`apikey-${provider.id}`}
                          type="password"
                          value={provider.apiKey}
                          onChange={(e) =>
                            updateProviderMutation.mutate({
                              id: provider.id,
                              data: { apiKey: e.target.value },
                            })
                          }
                          placeholder="sk-..."
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Requests per Minute" htmlFor={`rpm-${provider.id}`}>
                        <Input
                          id={`rpm-${provider.id}`}
                          type="number"
                          value={provider.rateLimit.requestsPerMinute}
                          onChange={(e) =>
                            updateProviderMutation.mutate({
                              id: provider.id,
                              data: {
                                rateLimit: {
                                  ...provider.rateLimit,
                                  requestsPerMinute: parseInt(e.target.value, 10) || 0,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                      <Field label="Tokens per Minute" htmlFor={`tpm-${provider.id}`}>
                        <Input
                          id={`tpm-${provider.id}`}
                          type="number"
                          value={provider.rateLimit.tokensPerMinute}
                          onChange={(e) =>
                            updateProviderMutation.mutate({
                              id: provider.id,
                              data: {
                                rateLimit: {
                                  ...provider.rateLimit,
                                  tokensPerMinute: parseInt(e.target.value, 10) || 0,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        Models ({provider.models.length})
                      </h3>
                      <div className="flex items-center gap-2">
                        {!provider.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefaultProvider(provider.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<RefreshCw className="size-3" />}
                          onClick={() => healthCheckMutation.mutate(provider.id)}
                          loading={healthCheckMutation.isPending}
                        >
                          Health Check
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {provider.models.map((model) => (
                        <div
                          key={model.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Cpu className="size-4 text-muted-foreground" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{model.name}</span>
                                {model.isDefault && (
                                  <Badge variant="brand" size="sm">Default</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {model.capabilities.streaming && (
                                  <Badge variant="secondary" size="sm">Streaming</Badge>
                                )}
                                {model.capabilities.jsonMode && (
                                  <Badge variant="secondary" size="sm">JSON</Badge>
                                )}
                                {model.capabilities.vision && (
                                  <Badge variant="secondary" size="sm">Vision</Badge>
                                )}
                                {model.capabilities.functions && (
                                  <Badge variant="secondary" size="sm">Functions</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={model.enabled}
                              onChange={(checked) =>
                                updateModelMutation.mutate({
                                  providerId: provider.id,
                                  modelId: model.id,
                                  data: { enabled: checked },
                                })
                              }
                            />
                            {!model.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetDefaultModel(provider.id, model.id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                setDeleteTarget({
                                  type: "model",
                                  providerId: provider.id,
                                  modelId: model.id,
                                });
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="size-3 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 className="size-3" />}
                        onClick={() => {
                          setDeleteTarget({ type: "provider", providerId: provider.id });
                          setShowDeleteDialog(true);
                        }}
                        className="border-danger-200 text-danger-600 hover:bg-danger-50"
                      >
                        Delete Provider
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <ConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title={`Delete ${deleteTarget?.type === "provider" ? "Provider" : "Model"}`}
          description={`This will permanently delete this ${deleteTarget?.type}. This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          loading={deleteProviderMutation.isPending || deleteModelMutation.isPending}
          variant="danger"
        />
      </div>
    </PageContainer>
  );
};
