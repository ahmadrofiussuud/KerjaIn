/**
 * Supabase Database type definitions.
 * Aligned with the schema defined in supabase/schema.sql.
 *
 * Replace this with auto-generated types from Supabase CLI:
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "applicant" | "recruiter";
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "applicant" | "recruiter";
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: "applicant" | "recruiter";
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          recruiter_id: string;
          title: string;
          description: string;
          salary_range: string | null;
          is_urgent: boolean;
          job_type: "daily" | "shift" | "full-time";
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recruiter_id: string;
          title: string;
          description: string;
          salary_range?: string | null;
          is_urgent?: boolean;
          job_type?: "daily" | "shift" | "full-time";
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          salary_range?: string | null;
          is_urgent?: boolean;
          job_type?: "daily" | "shift" | "full-time";
          location?: string | null;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          applicant_id: string;
          status: "pending" | "reviewed" | "accepted" | "rejected";
          applied_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          applicant_id: string;
          status?: "pending" | "reviewed" | "accepted" | "rejected";
          applied_at?: string;
        };
        Update: {
          status?: "pending" | "reviewed" | "accepted" | "rejected";
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "applicant" | "recruiter";
      job_type: "daily" | "shift" | "full-time";
      application_status: "pending" | "reviewed" | "accepted" | "rejected";
    };
  };
};
