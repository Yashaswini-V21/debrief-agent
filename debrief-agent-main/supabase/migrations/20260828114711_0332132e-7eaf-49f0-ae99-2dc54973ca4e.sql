-- Remove public/anon read access to investigation data; reads now go through
-- trusted server functions using the service role.
DROP POLICY IF EXISTS "Investigations are publicly readable" ON public.investigations;
DROP POLICY IF EXISTS "Anyone can read investigations" ON public.investigations;
DROP POLICY IF EXISTS "Public can read investigations" ON public.investigations;
DROP POLICY IF EXISTS "investigations_select_public" ON public.investigations;
DROP POLICY IF EXISTS "Investigation steps are publicly readable" ON public.investigation_steps;
DROP POLICY IF EXISTS "Anyone can read investigation steps" ON public.investigation_steps;
DROP POLICY IF EXISTS "Public can read investigation steps" ON public.investigation_steps;
DROP POLICY IF EXISTS "investigation_steps_select_public" ON public.investigation_steps;

DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('investigations', 'investigation_steps')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

REVOKE ALL ON public.investigations FROM anon, authenticated;
REVOKE ALL ON public.investigation_steps FROM anon, authenticated;

GRANT ALL ON public.investigations TO service_role;
GRANT ALL ON public.investigation_steps TO service_role;

ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigation_steps ENABLE ROW LEVEL SECURITY;