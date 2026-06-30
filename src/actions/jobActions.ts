"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, Job, JobFilters } from "@/types";

/**
 * Fetch jobs with optional filters.
 * This is a Server Action that can be called from Client Components.
 */
export async function getJobs(
  filters?: JobFilters
): Promise<ApiResponse<Job[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("jobs")
      .select("*, profiles!jobs_recruiter_id_fkey(full_name, avatar_url)")
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.job_type) {
      query = query.eq("job_type", filters.job_type);
    }

    if (filters?.is_urgent !== undefined) {
      query = query.eq("is_urgent", filters.is_urgent);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    if (filters?.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message, success: false };
    }

    return { data: data as Job[], error: null, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch jobs";
    return { data: null, error: message, success: false };
  }
}

/**
 * Get a single job by ID with recruiter profile info.
 */
export async function getJobById(jobId: string): Promise<ApiResponse<Job>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("jobs")
      .select("*, profiles!jobs_recruiter_id_fkey(full_name, avatar_url)")
      .eq("id", jobId)
      .single();

    if (error) {
      return { data: null, error: error.message, success: false };
    }

    return { data: data as Job, error: null, success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch job details";
    return { data: null, error: message, success: false };
  }
}

/**
 * Apply for a job. Only authenticated applicants can use this.
 * RLS enforces that the user must be an applicant.
 */
export async function applyForJob(
  jobId: string
): Promise<ApiResponse<{ id: string }>> {
  try {
    const supabase = await createClient();

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Anda harus login terlebih dahulu", success: false };
    }

    // Check if the user already applied
    const { data: existingApp } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("applicant_id", user.id)
      .single();

    if (existingApp) {
      return {
        data: null,
        error: "Anda sudah melamar pekerjaan ini",
        success: false,
      };
    }

    // Insert application (RLS will verify the user is an applicant)
    const { data, error } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        applicant_id: user.id,
      })
      .select("id")
      .single();

    if (error) {
      // Handle RLS violation specifically
      if (error.code === "42501") {
        return {
          data: null,
          error: "Hanya pelamar yang dapat melamar pekerjaan",
          success: false,
        };
      }
      return { data: null, error: error.message, success: false };
    }

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard");

    return { data: { id: data.id }, error: null, success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal melamar pekerjaan";
    return { data: null, error: message, success: false };
  }
}

/**
 * Create a new job listing. Only recruiters can use this.
 * RLS enforces that the user must be a recruiter.
 */
export async function createJob(
  formData: FormData
): Promise<ApiResponse<{ id: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Anda harus login terlebih dahulu", success: false };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const salary_range = formData.get("salary_range") as string | null;
    const is_urgent = formData.get("is_urgent") === "true";
    const job_type = formData.get("job_type") as "daily" | "shift" | "full-time";
    const location = formData.get("location") as string | null;

    // Basic validation
    if (!title?.trim() || !description?.trim()) {
      return {
        data: null,
        error: "Judul dan deskripsi wajib diisi",
        success: false,
      };
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        recruiter_id: user.id,
        title: title.trim(),
        description: description.trim(),
        salary_range: salary_range?.trim() || null,
        is_urgent,
        job_type: job_type || "daily",
        location: location?.trim() || null,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "42501") {
        return {
          data: null,
          error: "Hanya recruiter yang dapat membuat lowongan",
          success: false,
        };
      }
      return { data: null, error: error.message, success: false };
    }

    revalidatePath("/jobs");
    revalidatePath("/dashboard");

    return { data: { id: data.id }, error: null, success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal membuat lowongan";
    return { data: null, error: message, success: false };
  }
}

/**
 * Get applications for the current user.
 * - Applicants see their own applications (with job details).
 * - Recruiters see applications for their jobs (with applicant details).
 */
export async function getMyApplications(): Promise<ApiResponse<Application[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Anda harus login terlebih dahulu", success: false };
    }

    // Get user profile to determine role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    let query;

    if (profile?.role === "recruiter") {
      // Recruiter: get applications for their jobs with applicant info
      query = supabase
        .from("applications")
        .select(
          "*, jobs!inner(title, recruiter_id), profiles!applications_applicant_id_fkey(full_name, phone)"
        )
        .eq("jobs.recruiter_id", user.id)
        .order("applied_at", { ascending: false });
    } else {
      // Applicant: get their own applications with job info
      query = supabase
        .from("applications")
        .select("*, jobs(title, location, salary_range)")
        .eq("applicant_id", user.id)
        .order("applied_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message, success: false };
    }

    return { data: data as Application[], error: null, success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil data lamaran";
    return { data: null, error: message, success: false };
  }
}

// Re-export the Application type for use in this file
import type { Application } from "@/types";
