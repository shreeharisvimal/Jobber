import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/stores/toast.store";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  DeleteAccountRequest,
  User,
  TokenResponse,
  ApiResponse,
} from "@/types";

function extractTokens(data: unknown): TokenResponse {
  const d = data as ApiResponse<{ user: User } & TokenResponse>;
  if (d?.data) {
    const tokenData = d.data as unknown as Record<string, unknown>;
    return {
      access_token: (tokenData.access_token ?? (d.data as unknown as { access_token: string }).access_token) as string,
      refresh_token: (tokenData.refresh_token ?? (d.data as unknown as { refresh_token: string }).refresh_token) as string,
      token_type: (tokenData.token_type as string) ?? "Bearer",
      expires_in: (tokenData.expires_in as number) ?? 3600,
    };
  }
  const r = d as unknown as TokenResponse;
  return {
    access_token: r.access_token ?? "",
    refresh_token: r.refresh_token ?? "",
    token_type: r.token_type ?? "Bearer",
    expires_in: r.expires_in ?? 3600,
  };
}

function extractUser(data: unknown): User | null {
  const d = data as ApiResponse<{ user: User }>;
  if (d?.data?.user) return d.data.user;
  const u = data as { user?: User };
  if (u?.user) return u.user;
  return data as User;
}

export function useRegisterMutation() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (response) => {
      const user = extractUser(response);
      const tokens = extractTokens(response);
      if (user && tokens.access_token) {
        login(user, tokens);
      }
      navigate("/dashboard");
      toast.success("Account created successfully!");
    },
    onError: () => {
      toast.error("Failed to create account. Please try again.");
    },
  });
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (response) => {
      const user = extractUser(response);
      const tokens = extractTokens(response);
      if (user && tokens.access_token) {
        login(user, tokens);
      }
      navigate("/dashboard");
      toast.success("Welcome back!");
    },
    onError: () => {
      toast.error("Invalid email or password.");
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate("/login");
      toast.info("You have been logged out.");
    },
  });
}

export function useForgotPasswordMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await apiClient.post("/auth/forgot-password", data);
      return response.data;
    },
    onSuccess: () => {
      navigate("/email-sent");
      toast.success("Password reset email sent.");
    },
    onError: () => {
      toast.error("Failed to send reset email. Please try again.");
    },
  });
}

export function useResetPasswordMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      navigate("/login");
      toast.success("Password has been reset. Please log in.");
    },
    onError: () => {
      toast.error("Failed to reset password. The link may have expired.");
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await apiClient.post("/auth/change-password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully.");
    },
    onError: () => {
      toast.error("Failed to change password. Check your current password.");
    },
  });
}

export function useUpdateProfileMutation() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await apiClient.put("/auth/profile", data);
      return response.data;
    },
    onSuccess: (response) => {
      const user = extractUser(response);
      if (user) setUser(user);
      toast.success("Profile updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update profile.");
    },
  });
}

export function useDeleteAccountMutation() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteAccountRequest) => {
      const response = await apiClient.post("/auth/delete-account", data);
      return response.data;
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate("/login");
      toast.info("Your account has been deleted.");
    },
    onError: () => {
      toast.error("Failed to delete account.");
    },
  });
}

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/auth/resend-verification");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verification email sent.");
    },
    onError: () => {
      toast.error("Failed to send verification email.");
    },
  });
}
