-- REVIEWED DEPLOYMENT STEP; this file is NOT executed by the app or CI.
-- Back up and inspect policies first. Assign the owner claim using docs/SECURITY.md,
-- then run this in the Supabase SQL editor. No content rows are updated/deleted.
-- Existing permissive policies remain; restrictive policies prevent broader old
-- policies from granting non-admin access. Do not remove these guard policies.
BEGIN;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE raw_app_meta_data -> 'portfolio_admin' = 'true'::jsonb) THEN
    RAISE EXCEPTION 'No portfolio administrator configured. Follow docs/SECURITY.md before applying this migration.';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.is_portfolio_admin()
RETURNS boolean LANGUAGE sql STABLE SET search_path = '' AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' -> 'portfolio_admin') = 'true'::jsonb, false)
$$;
REVOKE ALL ON FUNCTION public.is_portfolio_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_portfolio_admin() TO anon, authenticated;

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['posts', 'diaries', 'experiences', 'categories', 'site_settings'] LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
      EXECUTE format('DROP POLICY IF EXISTS portfolio_admin_insert ON public.%I', table_name);
      EXECUTE format('CREATE POLICY portfolio_admin_insert ON public.%I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK ((SELECT public.is_portfolio_admin()))', table_name);
      EXECUTE format('DROP POLICY IF EXISTS portfolio_admin_update ON public.%I', table_name);
      EXECUTE format('CREATE POLICY portfolio_admin_update ON public.%I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING ((SELECT public.is_portfolio_admin())) WITH CHECK ((SELECT public.is_portfolio_admin()))', table_name);
      EXECUTE format('DROP POLICY IF EXISTS portfolio_admin_delete ON public.%I', table_name);
      EXECUTE format('CREATE POLICY portfolio_admin_delete ON public.%I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING ((SELECT public.is_portfolio_admin()))', table_name);
    ELSE
      RAISE NOTICE 'Skipping missing table %. Apply its setup SQL and rerun hardening before using it.', table_name;
    END IF;
  END LOOP;
END $$;

-- Author checks remain independent of the role. Even administrators cannot read
-- another author's diary or change ownership through the direct Data API.
DO $$ BEGIN
  IF to_regclass('public.posts') IS NOT NULL THEN
    DROP POLICY IF EXISTS portfolio_posts_visibility ON public.posts;
    CREATE POLICY portfolio_posts_visibility ON public.posts AS RESTRICTIVE FOR SELECT TO anon, authenticated
      USING (published = true OR ((SELECT public.is_portfolio_admin()) AND author_id = (SELECT auth.uid())));
    DROP POLICY IF EXISTS portfolio_posts_owner_insert ON public.posts;
    CREATE POLICY portfolio_posts_owner_insert ON public.posts AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (author_id = (SELECT auth.uid()));
    DROP POLICY IF EXISTS portfolio_posts_owner_update ON public.posts;
    CREATE POLICY portfolio_posts_owner_update ON public.posts AS RESTRICTIVE FOR UPDATE TO authenticated USING (author_id = (SELECT auth.uid())) WITH CHECK (author_id = (SELECT auth.uid()));
    DROP POLICY IF EXISTS portfolio_posts_owner_delete ON public.posts;
    CREATE POLICY portfolio_posts_owner_delete ON public.posts AS RESTRICTIVE FOR DELETE TO authenticated USING (author_id = (SELECT auth.uid()));
  END IF;
  IF to_regclass('public.diaries') IS NOT NULL THEN
    DROP POLICY IF EXISTS portfolio_diaries_owner ON public.diaries;
    CREATE POLICY portfolio_diaries_owner ON public.diaries AS RESTRICTIVE FOR ALL TO anon, authenticated
      USING ((SELECT public.is_portfolio_admin()) AND author_id = (SELECT auth.uid()))
      WITH CHECK ((SELECT public.is_portfolio_admin()) AND author_id = (SELECT auth.uid()));
  END IF;
  IF to_regclass('public.comments') IS NOT NULL THEN
    ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS portfolio_comment_visibility ON public.comments;
    CREATE POLICY portfolio_comment_visibility ON public.comments AS RESTRICTIVE FOR SELECT TO anon, authenticated
      USING ((SELECT public.is_portfolio_admin()) OR EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.published = true));
    DROP POLICY IF EXISTS portfolio_comment_input ON public.comments;
    CREATE POLICY portfolio_comment_input ON public.comments AS RESTRICTIVE FOR INSERT TO anon, authenticated
      WITH CHECK (char_length(btrim(author_name)) BETWEEN 1 AND 50 AND char_length(btrim(content)) BETWEEN 1 AND 500
        AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.published = true));
    DROP POLICY IF EXISTS portfolio_comment_delete ON public.comments;
    CREATE POLICY portfolio_comment_delete ON public.comments AS RESTRICTIVE FOR DELETE TO anon, authenticated USING ((SELECT public.is_portfolio_admin()));
    DROP POLICY IF EXISTS portfolio_comment_update ON public.comments;
    CREATE POLICY portfolio_comment_update ON public.comments AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING ((SELECT public.is_portfolio_admin())) WITH CHECK ((SELECT public.is_portfolio_admin()));
  END IF;
  IF to_regclass('public.page_views') IS NOT NULL THEN
    ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS portfolio_analytics_read ON public.page_views;
    CREATE POLICY portfolio_analytics_read ON public.page_views AS RESTRICTIVE FOR SELECT TO anon, authenticated USING ((SELECT public.is_portfolio_admin()));
    DROP POLICY IF EXISTS portfolio_analytics_input ON public.page_views;
    CREATE POLICY portfolio_analytics_input ON public.page_views AS RESTRICTIVE FOR INSERT TO anon, authenticated
      WITH CHECK (char_length(path) BETWEEN 1 AND 2048 AND path LIKE '/%' AND path NOT LIKE '//%'
        AND path !~ '^/(admin|auth|api)(/|$)' AND path <> '/login'
        AND (referrer IS NULL OR char_length(referrer) <= 2048)
        AND (user_agent IS NULL OR char_length(user_agent) <= 512));
    DROP POLICY IF EXISTS portfolio_analytics_update ON public.page_views;
    CREATE POLICY portfolio_analytics_update ON public.page_views AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING ((SELECT public.is_portfolio_admin())) WITH CHECK ((SELECT public.is_portfolio_admin()));
    DROP POLICY IF EXISTS portfolio_analytics_delete ON public.page_views;
    CREATE POLICY portfolio_analytics_delete ON public.page_views AS RESTRICTIVE FOR DELETE TO anon, authenticated USING ((SELECT public.is_portfolio_admin()));
  END IF;
END $$;

-- Restrict writes only in the existing public blog bucket; do not alter other buckets.
DROP POLICY IF EXISTS portfolio_storage_insert ON storage.objects;
CREATE POLICY portfolio_storage_insert ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id <> 'blog-images' OR (SELECT public.is_portfolio_admin()));
DROP POLICY IF EXISTS portfolio_storage_update ON storage.objects;
CREATE POLICY portfolio_storage_update ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING (bucket_id <> 'blog-images' OR (SELECT public.is_portfolio_admin()))
  WITH CHECK (bucket_id <> 'blog-images' OR (SELECT public.is_portfolio_admin()));
DROP POLICY IF EXISTS portfolio_storage_delete ON storage.objects;
CREATE POLICY portfolio_storage_delete ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated
  USING (bucket_id <> 'blog-images' OR (SELECT public.is_portfolio_admin()));

COMMIT;
