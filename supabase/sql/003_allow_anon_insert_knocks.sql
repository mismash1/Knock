drop policy if exists "anon can insert knocks" on public.knocks;
create policy "anon can insert knocks"
on public.knocks
for insert
to anon
with check (true);

drop policy if exists "auth can insert knocks" on public.knocks;
create policy "auth can insert knocks"
on public.knocks
for insert
to authenticated
with check (true);
