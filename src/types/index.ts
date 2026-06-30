/**
 * Global TypeScript interfaces for KerjaIn platform.
 * Aligned with the Supabase schema defined in supabase/schema.sql.
 */

// ─── Database Types ──────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = "applicant" | "recruiter";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export type JobType = "daily" | "shift" | "full-time";

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  salary_range: string | null;
  is_urgent: boolean;
  job_type: JobType;
  location: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields (from query)
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
  cover_url?: string | null;
}

export interface JobFilters {
  search?: string;
  job_type?: JobType;
  is_urgent?: boolean;
  location?: string;
  limit?: number;
  offset?: number;
}

// ─── Applications ────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "accepted"
  | "rejected";

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  applied_at: string;
  // Joined fields (from query)
  jobs?: {
    title: string;
    location?: string | null;
    salary_range?: string | null;
    recruiter_id?: string;
  };
  profiles?: {
    full_name: string;
    phone: string | null;
  };
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
