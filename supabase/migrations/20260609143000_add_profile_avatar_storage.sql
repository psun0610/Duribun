insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "profile avatar objects select public" on storage.objects;
drop policy if exists "profile avatar objects insert own folder" on storage.objects;
drop policy if exists "profile avatar objects update own folder" on storage.objects;
drop policy if exists "profile avatar objects delete own folder" on storage.objects;

create policy "profile avatar objects select public"
on storage.objects for select
using (bucket_id = 'profile-avatars');

create policy "profile avatar objects insert own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile avatar objects update own folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile avatar objects delete own folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
