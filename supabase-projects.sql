-- Project Studio setup. Run in the connected Supabase SQL editor after assigning
-- the portfolio_admin app_metadata claim described in docs/SECURITY.md.
-- Idempotent: no existing project or portfolio content is deleted or seeded.
BEGIN;

CREATE OR REPLACE FUNCTION public.is_portfolio_admin()
RETURNS boolean LANGUAGE sql STABLE SET search_path = '' AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' -> 'portfolio_admin') = 'true'::jsonb, false)
$$;
REVOKE ALL ON FUNCTION public.is_portfolio_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_portfolio_admin() TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.portfolio_project_drafts (
  slug text PRIMARY KEY CHECK (char_length(slug) BETWEEN 1 AND 100 AND slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object' AND content ->> 'slug' = slug),
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Null content is an unpublish tombstone. Keeping the slug prevents the reviewed
-- repository seed from reappearing. Draft text is stored in the private table only.
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  slug text PRIMARY KEY CHECK (char_length(slug) BETWEEN 1 AND 100 AND slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content jsonb CHECK (content IS NULL OR (jsonb_typeof(content) = 'object' AND content ->> 'slug' = slug)),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_project_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.portfolio_project_drafts FROM anon, authenticated;
REVOKE ALL ON public.portfolio_projects FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.portfolio_project_drafts TO authenticated;
GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT INSERT, UPDATE ON public.portfolio_projects TO authenticated;

DROP POLICY IF EXISTS portfolio_drafts_admin ON public.portfolio_project_drafts;
CREATE POLICY portfolio_drafts_admin ON public.portfolio_project_drafts FOR ALL TO authenticated
  USING ((SELECT public.is_portfolio_admin())) WITH CHECK ((SELECT public.is_portfolio_admin()));
DROP POLICY IF EXISTS portfolio_drafts_admin_guard ON public.portfolio_project_drafts;
CREATE POLICY portfolio_drafts_admin_guard ON public.portfolio_project_drafts AS RESTRICTIVE FOR ALL TO anon, authenticated
  USING ((SELECT public.is_portfolio_admin())) WITH CHECK ((SELECT public.is_portfolio_admin()));

DROP POLICY IF EXISTS portfolio_projects_public_read ON public.portfolio_projects;
CREATE POLICY portfolio_projects_public_read ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS portfolio_projects_admin_insert ON public.portfolio_projects;
CREATE POLICY portfolio_projects_admin_insert ON public.portfolio_projects FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_portfolio_admin()));
DROP POLICY IF EXISTS portfolio_projects_admin_update ON public.portfolio_projects;
CREATE POLICY portfolio_projects_admin_update ON public.portfolio_projects FOR UPDATE TO authenticated
  USING ((SELECT public.is_portfolio_admin())) WITH CHECK ((SELECT public.is_portfolio_admin()));
DROP POLICY IF EXISTS portfolio_projects_insert_guard ON public.portfolio_projects;
CREATE POLICY portfolio_projects_insert_guard ON public.portfolio_projects AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK ((SELECT public.is_portfolio_admin()));
DROP POLICY IF EXISTS portfolio_projects_update_guard ON public.portfolio_projects;
CREATE POLICY portfolio_projects_update_guard ON public.portfolio_projects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING ((SELECT public.is_portfolio_admin())) WITH CHECK ((SELECT public.is_portfolio_admin()));

-- SECURITY INVOKER preserves table RLS. Advisory locking serializes concurrent
-- draft/publish operations for one slug, including its first insert.
CREATE OR REPLACE FUNCTION public.save_portfolio_project(p_slug text, p_action text, p_document jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  draft_row public.portfolio_project_drafts;
  published_row public.portfolio_projects;
BEGIN
  IF NOT public.is_portfolio_admin() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;
  IF p_action IS NULL OR p_action NOT IN ('save', 'publish', 'unpublish')
    OR p_slug IS NULL OR char_length(p_slug) NOT BETWEEN 1 AND 100
    OR p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    OR p_document IS NULL OR jsonb_typeof(p_document) <> 'object'
    OR (p_document ->> 'slug') IS DISTINCT FROM p_slug
    OR (p_document -> 'en' ->> 'slug') IS DISTINCT FROM p_slug
    OR (p_document -> 'zh' ->> 'slug') IS DISTINCT FROM p_slug
    OR octet_length(p_document::text) > 512000 THEN
    RAISE EXCEPTION 'Invalid project document' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('portfolio_project:' || p_slug, 0));
  INSERT INTO public.portfolio_project_drafts (slug, content, updated_by, updated_at)
    VALUES (p_slug, p_document, auth.uid(), now())
    ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, updated_by = EXCLUDED.updated_by, updated_at = EXCLUDED.updated_at
    RETURNING * INTO draft_row;
  IF p_action IN ('publish', 'unpublish') THEN
    INSERT INTO public.portfolio_projects (slug, content, updated_at)
      VALUES (p_slug, CASE WHEN p_action = 'publish' THEN p_document ELSE NULL END, now())
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, updated_at = EXCLUDED.updated_at;
  END IF;
  SELECT * INTO published_row FROM public.portfolio_projects WHERE slug = p_slug;
  RETURN jsonb_build_object(
    'draft', jsonb_build_object('slug', draft_row.slug, 'content', draft_row.content, 'updated_at', draft_row.updated_at),
    'published', CASE WHEN published_row.slug IS NULL THEN NULL ELSE to_jsonb(published_row) END
  );
END;
$$;

REVOKE ALL ON FUNCTION public.save_portfolio_project(text, text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_portfolio_project(text, text, jsonb) TO authenticated;

COMMIT;
