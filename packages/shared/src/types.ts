export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string | null;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  message: string | null;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    detail: string | null;
  };
}

export interface HealthCheck {
  status: string;
  version: string;
  environment: string;
  checks: Record<string, string>;
}

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
