-- Remove all client-side write access; writes now happen only through
-- server functions that validate the request and use the service role.
drop policy if exists "Demo visitors can update investigations" on public.investigations;
drop policy if exists "Signed-in users can update investigations" on public.investigations;
drop policy if exists "Signed-in users can create investigations" on public.investigations;

drop policy if exists "Demo visitors can update pending approvals" on public.investigation_steps;
drop policy if exists "Signed-in users can update steps" on public.investigation_steps;
drop policy if exists "Signed-in users can create steps" on public.investigation_steps;

revoke insert, update, delete on public.investigations from anon, authenticated;
revoke insert, update, delete on public.investigation_steps from anon, authenticated;

grant select on public.investigations to anon, authenticated;
grant select on public.investigation_steps to anon, authenticated;
grant all on public.investigations to service_role;
grant all on public.investigation_steps to service_role;