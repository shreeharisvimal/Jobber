import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/types/auth";

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get("/auth/me");
      const user = data?.data ?? data?.user ?? data;
      setUser(user);
      return user;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: isAuthenticated,
  });
}
