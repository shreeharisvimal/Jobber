export const APP_NAME = "Jobber";
export const APP_DESCRIPTION = "AI Career Operating System";

export const API_VERSION = "v1";
export const API_PREFIX = `/api/${API_VERSION}`;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  CAREER_PROFILE: "/career-profile",
  RESUMES: "/resumes",
  JOBS: "/jobs",
  COMPANIES: "/companies",
  RECRUITERS: "/recruiters",
  EMAILS: "/emails",
  INTERVIEWS: "/interviews",
  PORTFOLIO: "/portfolio",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  EMAIL_SENT: "/email-sent",
  ACCOUNT_LOCKED: "/account-locked",
  OAUTH_CALLBACK: "/auth/callback",
  UNAUTHORIZED: "/unauthorized",
  FORBIDDEN: "/forbidden",
  SESSIONS: "/sessions",
  SECURITY: "/security",
} as const;

export const CAREER_MODULES = [
  { id: "career-profile", title: "Career Profile", route: ROUTES.CAREER_PROFILE },
  { id: "resumes", title: "Resume Generator", route: ROUTES.RESUMES },
  { id: "jobs", title: "Job Analysis", route: ROUTES.JOBS },
  { id: "companies", title: "Company Research", route: ROUTES.COMPANIES },
  { id: "recruiters", title: "Recruiter CRM", route: ROUTES.RECRUITERS },
  { id: "emails", title: "Email Intelligence", route: ROUTES.EMAILS },
  { id: "interviews", title: "Interview Prep", route: ROUTES.INTERVIEWS },
  { id: "portfolio", title: "Portfolio", route: ROUTES.PORTFOLIO },
  { id: "analytics", title: "Analytics", route: ROUTES.ANALYTICS },
] as const;
