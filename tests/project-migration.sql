-- Executed only by scripts/test-project-migration.mjs against an isolated cluster.
SET request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000001","app_metadata":{"portfolio_admin":true}}';
SET ROLE authenticated;

DO $$
DECLARE
  v1 jsonb := '{"slug":"reviewed-project","en":{"slug":"reviewed-project","title":"Published version"},"zh":{"slug":"reviewed-project"}}';
  v2 jsonb := '{"slug":"reviewed-project","en":{"slug":"reviewed-project","title":"Private draft change"},"zh":{"slug":"reviewed-project"}}';
BEGIN
  PERFORM public.save_portfolio_project('reviewed-project', 'save', v1);
  IF EXISTS (SELECT 1 FROM public.portfolio_projects) THEN RAISE EXCEPTION 'Saving a new draft published content'; END IF;
  PERFORM public.save_portfolio_project('reviewed-project', 'publish', v1);
  PERFORM public.save_portfolio_project('reviewed-project', 'save', v2);
  IF (SELECT content FROM public.portfolio_projects WHERE slug = 'reviewed-project') <> v1 THEN RAISE EXCEPTION 'Saving a draft changed live content'; END IF;
  IF (SELECT content FROM public.portfolio_project_drafts WHERE slug = 'reviewed-project') <> v2 THEN RAISE EXCEPTION 'Draft was not saved'; END IF;
  PERFORM public.save_portfolio_project('reviewed-project', 'unpublish', v2);
  IF NOT EXISTS (SELECT 1 FROM public.portfolio_projects WHERE slug = 'reviewed-project' AND content IS NULL) THEN RAISE EXCEPTION 'Unpublish did not leave a tombstone'; END IF;
  IF (SELECT content FROM public.portfolio_project_drafts WHERE slug = 'reviewed-project') <> v2 THEN RAISE EXCEPTION 'Unpublish lost the draft'; END IF;
  PERFORM public.save_portfolio_project('reviewed-project', 'publish', v2);
  IF (SELECT content FROM public.portfolio_projects WHERE slug = 'reviewed-project') <> v2 THEN RAISE EXCEPTION 'Republish failed'; END IF;
END $$;

RESET ROLE;
CREATE FUNCTION public.reject_test_publication() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug = 'rollback-probe' THEN RAISE EXCEPTION 'Simulated second-table failure'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER reject_test_publication BEFORE INSERT OR UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.reject_test_publication();
SET ROLE authenticated;

DO $$ BEGIN
  BEGIN
    PERFORM public.save_portfolio_project('rollback-probe', 'publish', '{"slug":"rollback-probe","en":{"slug":"rollback-probe"},"zh":{"slug":"rollback-probe"}}');
    RAISE EXCEPTION 'Expected the simulated second-table failure';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Simulated second-table failure' THEN RAISE; END IF;
  END;
  IF EXISTS (SELECT 1 FROM public.portfolio_project_drafts WHERE slug = 'rollback-probe') THEN RAISE EXCEPTION 'Failed publication left a partial draft write'; END IF;
END $$;

-- A user-editable claim and a string "true" must not confer administrator access.
SET request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000001","user_metadata":{"portfolio_admin":true},"app_metadata":{"portfolio_admin":"true"}}';
DO $$ BEGIN
  IF public.is_portfolio_admin() THEN RAISE EXCEPTION 'Accepted user metadata or a string administrator claim'; END IF;
  IF EXISTS (SELECT 1 FROM public.portfolio_project_drafts) THEN RAISE EXCEPTION 'Non-admin can read private drafts'; END IF;
  BEGIN
    PERFORM public.save_portfolio_project('unauthorized', 'save', '{"slug":"unauthorized","en":{"slug":"unauthorized"},"zh":{"slug":"unauthorized"}}');
    RAISE EXCEPTION 'Non-admin invoked the RPC';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.portfolio_projects (slug, content) VALUES ('unauthorized', NULL);
    RAISE EXCEPTION 'Non-admin directly inserted public content';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.portfolio_project_drafts (slug, content) VALUES ('unauthorized', '{"slug":"unauthorized"}');
    RAISE EXCEPTION 'Non-admin directly inserted a draft';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  UPDATE public.portfolio_projects SET content = NULL WHERE slug = 'reviewed-project';
  IF EXISTS (SELECT 1 FROM public.portfolio_projects WHERE slug = 'reviewed-project' AND content IS NULL) THEN RAISE EXCEPTION 'Non-admin modified public content'; END IF;
END $$;

RESET ROLE;
SET ROLE anon;
SET request.jwt.claims = '{}';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.portfolio_projects WHERE slug = 'reviewed-project') THEN RAISE EXCEPTION 'Anonymous visitor cannot read published projects'; END IF;
  BEGIN
    PERFORM 1 FROM public.portfolio_project_drafts;
    RAISE EXCEPTION 'Anonymous visitor can query drafts';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.portfolio_projects (slug, content) VALUES ('unauthorized', NULL);
    RAISE EXCEPTION 'Anonymous visitor can write projects';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM public.save_portfolio_project('unauthorized', 'save', '{"slug":"unauthorized"}');
    RAISE EXCEPTION 'Anonymous visitor can execute the RPC';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $$;
RESET ROLE;
