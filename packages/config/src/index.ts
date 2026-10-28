export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1",
    timeout: 30000,
  },
  app: {
    name: "Jobber",
    version: "0.1.0",
  },
  auth: {
    tokenKey: "access_token",
    refreshTokenKey: "refresh_token",
  },
} as const;
