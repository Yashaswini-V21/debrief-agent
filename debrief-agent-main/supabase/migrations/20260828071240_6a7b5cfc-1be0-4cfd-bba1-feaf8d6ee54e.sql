
CREATE TABLE public.investigations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repo TEXT NOT NULL,
  issue_title TEXT NOT NULL,
  issue_number INTEGER,
  status TEXT NOT NULL DEFAULT 'investigating',
  branch TEXT,
  resolved_ref TEXT,
  resolved_url TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.investigation_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id uuid NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
  parent_step_id uuid REFERENCES public.investigation_steps(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  kind TEXT NOT NULL,
  title TEXT,
  detail TEXT,
  tool_name TEXT,
  status TEXT,
  output TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX investigation_steps_order_idx ON public.investigation_steps (investigation_id, position);

GRANT SELECT ON public.investigations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investigations TO authenticated;
GRANT ALL ON public.investigations TO service_role;

GRANT SELECT ON public.investigation_steps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investigation_steps TO authenticated;
GRANT ALL ON public.investigation_steps TO service_role;

ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigation_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investigations are viewable by everyone" ON public.investigations FOR SELECT USING (true);
CREATE POLICY "Signed-in users can create investigations" ON public.investigations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users can update investigations" ON public.investigations FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Steps are viewable by everyone" ON public.investigation_steps FOR SELECT USING (true);
CREATE POLICY "Signed-in users can create steps" ON public.investigation_steps FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users can update steps" ON public.investigation_steps FOR UPDATE TO authenticated USING (true);

INSERT INTO public.investigations (id, repo, issue_title, issue_number, status, branch)
VALUES ('11111111-1111-4111-8111-111111111111', 'Yashaswini-V21/Rytha_Mitra', 'pytest suite fails on soil advisory endpoint after schema change', 142, 'awaiting_approval', 'fix/soil-advisory-schema');

INSERT INTO public.investigation_steps (investigation_id, parent_step_id, position, kind, title, detail, tool_name, status, output) VALUES
('11111111-1111-4111-8111-111111111111', NULL, 1, 'reasoning', 'Framing the failure',
 'Issue #142 reports 3 failing tests in tests/test_soil_advisory.py after the recent schema migration. My working theory is that the advisory serializer still expects the old `ph_level` field while the model now exposes `soil_ph`. Before touching code I want to read the failing test file, the serializer, and the migration to confirm the rename rather than guess.', NULL, NULL, NULL),
('11111111-1111-4111-8111-111111111111', NULL, 2, 'get_tool_info', NULL, 'Inspected schema for repository file reads before calling it.', 'get_tool_info (github)', 'ok', NULL),
('11111111-1111-4111-8111-111111111111', NULL, 3, 'call_tool', NULL, 'Read tests/test_soil_advisory.py — 214 lines. Three assertions reference response["ph_level"].', 'get_file_contents (github)', 'ok', NULL),
('11111111-1111-4111-8111-111111111111', NULL, 4, 'call_tool', NULL, 'Searched the repo for "ph_level" — 6 hits across serializers.py, advisory.py and the test file.', 'search_code (github)', 'ok', NULL),
('11111111-1111-4111-8111-111111111111', NULL, 5, 'reasoning', 'Confirmed the rename',
 'Migration 0014_rename_soil_fields.py renames ph_level to soil_ph on the SoilReading model, but api/serializers.py still declares ph_level = serializers.FloatField(source="ph_level"). That raises AttributeError during serialization, which surfaces as a 500 in the three failing tests. Fix is a two-line serializer change plus updating the test fixtures to the new field name. I will delegate the fixture sweep to a sub-agent while I patch the serializer.', NULL, NULL, NULL),
('11111111-1111-4111-8111-111111111111', NULL, 6, 'sub_agent', 'Sub-agent: fixture sweep',
 'Delegated: locate every fixture and factory still emitting the legacy field name and report back a minimal patch set.', NULL, 'complete', NULL);

INSERT INTO public.investigation_steps (investigation_id, parent_step_id, position, kind, title, detail, tool_name, status, output)
SELECT '11111111-1111-4111-8111-111111111111', s.id, v.position, v.kind, v.title, v.detail, v.tool_name, v.status, v.output
FROM public.investigation_steps s,
(VALUES
 (1, 'call_tool', NULL::text, 'Listed tests/fixtures/ — 11 files, 4 reference soil readings.', 'list_directory (github)', 'ok', NULL::text),
 (2, 'reasoning', 'Scope of legacy usage', 'Only tests/fixtures/soil.json and tests/factories.py still use ph_level. conftest.py builds readings through the factory, so patching the factory covers 2 of the 3 failures without touching conftest.', NULL, NULL, NULL),
 (3, 'call_tool', NULL, 'Read tests/factories.py and confirmed SoilReadingFactory sets ph_level = 6.4.', 'get_file_contents (github)', 'ok', NULL)
) AS v(position, kind, title, detail, tool_name, status, output)
WHERE s.investigation_id = '11111111-1111-4111-8111-111111111111' AND s.position = 6 AND s.parent_step_id IS NULL;

INSERT INTO public.investigation_steps (investigation_id, parent_step_id, position, kind, title, detail, tool_name, status, output) VALUES
('11111111-1111-4111-8111-111111111111', NULL, 7, 'sandbox', 'Sandbox execution — baseline',
 'Ran the failing subset before any edits to capture a clean baseline.', 'pytest', 'fail',
'$ pytest tests/test_soil_advisory.py -q
=========================== test session starts ============================
platform linux -- Python 3.11.8, pytest-8.1.1, pluggy-1.4.0
collected 12 items

tests/test_soil_advisory.py ....FFF.....                            [100%]

================================= FAILURES =================================
______________ test_advisory_returns_ph_for_valid_reading ______________
api/serializers.py:41: in to_representation
    return {"ph_level": instance.ph_level, ...}
E   AttributeError: ''SoilReading'' object has no attribute ''ph_level''

3 failed, 9 passed in 2.41s'),
('11111111-1111-4111-8111-111111111111', NULL, 8, 'sandbox', 'Sandbox execution — after patch',
 'Applied the serializer rename and the factory fixture update inside the sandbox, then re-ran the full suite.', 'pytest', 'pass',
'$ pytest -q
=========================== test session starts ============================
platform linux -- Python 3.11.8, pytest-8.1.1, pluggy-1.4.0
collected 148 items

................................................................ [ 43%]
................................................................ [ 86%]
....................                                             [100%]

148 passed in 11.07s
coverage: 91.4% (+0.2%)'),
('11111111-1111-4111-8111-111111111111', NULL, 9, 'licence_required', 'Push fix commit to origin',
 'The patch is verified green in the sandbox. Pushing to the remote is irreversible and requires your licence.', NULL, 'pending', NULL);
