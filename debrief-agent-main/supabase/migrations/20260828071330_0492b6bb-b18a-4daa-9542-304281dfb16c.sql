
GRANT UPDATE ON public.investigations TO anon;
GRANT UPDATE ON public.investigation_steps TO anon;
CREATE POLICY "Demo visitors can update investigations" ON public.investigations FOR UPDATE TO anon USING (true);
CREATE POLICY "Demo visitors can update pending approvals" ON public.investigation_steps FOR UPDATE TO anon USING (kind = 'licence_required');
