"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, UserProfile } from "@/types";

/**
 * Sign in with Google OAuth.
 * Redirects to Google's OAuth consent screen.
 */
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Sign in with email and password.
 */
export async function signInWithEmail(
  formData: FormData
): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email?.trim() || !password) {
      return {
        data: null,
        error: "Email dan password wajib diisi",
        success: false,
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { data: null, error: error.message, success: false };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (err) {
    // redirect() throws a NEXT_REDIRECT error — let it propagate
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Gagal login";
    return { data: null, error: message, success: false };
  }
}

/**
 * Sign up with email, password, and role selection.
 */
export async function signUpWithEmail(
  formData: FormData
): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const full_name = formData.get("full_name") as string;
    const role = formData.get("role") as "applicant" | "recruiter";

    if (!email?.trim() || !password || !full_name?.trim()) {
      return {
        data: null,
        error: "Semua field wajib diisi",
        success: false,
      };
    }

    if (password.length < 6) {
      return {
        data: null,
        error: "Password minimal 6 karakter",
        success: false,
      };
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: full_name.trim(),
          role: role || "applicant",
        },
      },
    });

    if (error) {
      return { data: null, error: error.message, success: false };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Gagal mendaftar";
    return { data: null, error: message, success: false };
  }
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Get the current authenticated user's profile.
 */
export async function getCurrentUser(): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: null, success: false };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return { data: null, error: profileError.message, success: false };
    }

    return {
      data: {
        ...profile,
        email: user.email!,
      } as UserProfile,
      error: null,
      success: true,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil data user";
    return { data: null, error: message, success: false };
  }
}

/**
 * Update the current user's profile.
 */
export async function updateProfile(
  formData: FormData
): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Anda harus login terlebih dahulu", success: false };
    }

    const full_name = formData.get("full_name") as string;
    const phone = formData.get("phone") as string | null;

    if (!full_name?.trim()) {
      return {
        data: null,
        error: "Nama lengkap wajib diisi",
        success: false,
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: full_name.trim(),
        phone: phone?.trim() || null,
      })
      .eq("id", user.id);

    if (error) {
      return { data: null, error: error.message, success: false };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { data: null, error: null, success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal memperbarui profil";
    return { data: null, error: message, success: false };
  }
}
