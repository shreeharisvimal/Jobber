export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  role: "user" | "admin" | "superadmin";
  avatar_url: string | null;
  created_at: string;
}

export interface UserProfile {
  user: User;
  headline: string;
  summary: string;
  location: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  phone_number: string | null;
  bio: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Session {
  id: string;
  device_info: string | null;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  location: string | null;
  is_active: boolean;
  last_activity_at: string;
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  headline?: string;
  summary?: string;
  location?: string;
  website_url?: string;
  linkedin_url?: string;
  github_url?: string;
  phone_number?: string;
  bio?: string;
}

export interface DeleteAccountRequest {
  password: string;
  reason?: string;
}
