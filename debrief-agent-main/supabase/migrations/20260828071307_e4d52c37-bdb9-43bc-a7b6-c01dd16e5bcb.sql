
UPDATE public.investigation_steps
SET payload = jsonb_build_object(
  'action', 'git push origin fix/soil-advisory-schema',
  'commit_message', 'fix(api): rename ph_level to soil_ph in advisory serializer',
  'branch', 'fix/soil-advisory-schema',
  'base', 'main',
  'files', jsonb_build_array(
    jsonb_build_object('path', 'api/serializers.py', 'added', 2, 'removed', 2),
    jsonb_build_object('path', 'tests/factories.py', 'added', 1, 'removed', 1),
    jsonb_build_object('path', 'tests/fixtures/soil.json', 'added', 1, 'removed', 1)
  ),
  'tests', '148 passed, 0 failed',
  'reversible', false
)
WHERE kind = 'licence_required';
