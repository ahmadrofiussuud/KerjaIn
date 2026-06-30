-- ============================================================================
-- KerjaIn Database Schema
-- Run this script in the Supabase SQL Editor
-- ============================================================================

-- ─── ENUMS ──────────────────────────────────────────────────────────────────

CREATE TYPE public.user_role AS ENUM ('applicant', 'recruiter');
CREATE TYPE public.job_type AS ENUM ('daily', 'shift', 'full-time');
CREATE TYPE public.application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');


-- ─── PROFILES ───────────────────────────────────────────────────────────────

CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        public.user_role NOT NULL DEFAULT 'applicant',
  full_name   TEXT NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profiles linked to auth.users';

-- Auto-create a profile row when a new user signs up via auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- ─── JOBS ───────────────────────────────────────────────────────────────────

CREATE TABLE public.jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  salary_range  TEXT,
  is_urgent     BOOLEAN NOT NULL DEFAULT false,
  job_type      public.job_type NOT NULL DEFAULT 'daily',
  location      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.jobs IS 'Job listings posted by recruiters';

CREATE INDEX idx_jobs_recruiter_id ON public.jobs(recruiter_id);
CREATE INDEX idx_jobs_job_type ON public.jobs(job_type);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_jobs_is_urgent ON public.jobs(is_urgent) WHERE is_urgent = true;

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- ─── APPLICATIONS ───────────────────────────────────────────────────────────

CREATE TABLE public.applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status        public.application_status NOT NULL DEFAULT 'pending',
  applied_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent duplicate applications
  UNIQUE(job_id, applicant_id)
);

COMMENT ON TABLE public.applications IS 'Job applications submitted by applicants';

CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX idx_applications_status ON public.applications(status);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ─── PROFILES RLS ───────────────────────────────────────────────────────────

-- Anyone authenticated can read any profile (needed for displaying recruiter info, etc.)
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profile insertion is handled by the trigger, but allow self-insert as fallback
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ─── JOBS RLS ───────────────────────────────────────────────────────────────

-- Anyone (including anonymous) can read all jobs
CREATE POLICY "Jobs are viewable by everyone"
  ON public.jobs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only recruiters can create jobs (and only under their own id)
CREATE POLICY "Recruiters can insert their own jobs"
  ON public.jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = recruiter_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'recruiter'
    )
  );

-- Recruiters can update only their own jobs
CREATE POLICY "Recruiters can update their own jobs"
  ON public.jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = recruiter_id)
  WITH CHECK (auth.uid() = recruiter_id);

-- Recruiters can delete only their own jobs
CREATE POLICY "Recruiters can delete their own jobs"
  ON public.jobs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = recruiter_id);

-- ─── APPLICATIONS RLS ──────────────────────────────────────────────────────

-- Applicants can view their own applications
CREATE POLICY "Applicants can view their own applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = applicant_id);

-- Recruiters can view applications for their jobs
CREATE POLICY "Recruiters can view applications for their jobs"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

-- Only applicants can submit applications (and only for themselves)
CREATE POLICY "Applicants can insert their own applications"
  ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = applicant_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'applicant'
    )
  );

-- Recruiters can update application status for their own jobs
CREATE POLICY "Recruiters can update application status for their jobs"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );
