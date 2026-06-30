/**
 * Application-wide constants for KerjaIn platform.
 */

export const APP_NAME = "KerjaIn" as const;

export const APP_DESCRIPTION =
  "Platform penghubung pekerja informal dengan perekrut UMKM" as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  JOBS: "/jobs",
  PROFILE: "/profile",
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;
