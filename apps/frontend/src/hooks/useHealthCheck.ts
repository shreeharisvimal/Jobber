import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface HealthCheck {
  status: string;
  version: string;
  environment: string;
  checks: Record<string, string>;
}

export function useHealthCheck() {
  return useQuery<HealthCheck>({
    queryKey: ["health"],
    queryFn: async () => {
      const { data } = await apiClient.get("/health");
      return data;
    },
    refetchInterval: 30000,
  });
}
