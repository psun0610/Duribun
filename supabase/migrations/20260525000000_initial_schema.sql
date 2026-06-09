create extension if not exists pgcrypto with schema extensions;

create type public.place_category as enum ('restaurant', 'cafe', 'activity');
create type public.place_provider as enum ('kakao', 'manual');
create type public.photo_kind as enum ('place_food', 'couple_private');
create type public.couple_status as enum ('active', 'disconnect_pending');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.couples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  friend_code text not null unique,
  status public.couple_status not null default 'active',
  disconnect_requested_by uuid references public.profiles (id) on delete set null,
  disconnect_requested_at timestamptz,
  delete_after timestamptz,
  friend_code_rotated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint disconnect_state_consistent check (
    (
      status = 'active'
      and disconnect_requested_by is null
      and disconnect_requested_at is null
      and delete_after is null
    )
    or (
      status = 'disconnect_pending'
      and disconnect_requested_by is not null
      and disconnect_requested_at is not null
      and delete_after is not null
    )
  )
);

create table public.couple_members (
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id),
  unique (user_id)
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  provider public.place_provider not null,
  provider_place_id text,
  name text not null,
  category public.place_category not null,
  provider_category_name text,
  address text,
  road_address text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  place_url text,
  is_explore_approved boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint kakao_place_requires_provider_id check (
    provider <> 'kakao' or provider_place_id is not null
  )
);

create unique index places_provider_place_id_unique
  on public.places (provider, provider_place_id)
  where provider_place_id is not null;

create table public.couple_places (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  is_public boolean not null default false,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (couple_id, place_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  couple_place_id uuid not null references public.couple_places (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  rating numeric(2, 1) not null,
  one_line_review text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (couple_place_id, author_id),
  constraint rating_range check (rating >= 1 and rating <= 5)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  category public.place_category,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (category, label)
);

create table public.review_tags (
  review_id uuid not null references public.reviews (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete restrict,
  primary key (review_id, tag_id)
);

create table public.review_photos (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews (id) on delete cascade,
  kind public.photo_kind not null,
  storage_path text not null unique,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table public.couple_friendships (
  id uuid primary key default gen_random_uuid(),
  couple_a_id uuid not null references public.couples (id) on delete cascade,
  couple_b_id uuid not null references public.couples (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint no_self_friendship check (couple_a_id <> couple_b_id),
  constraint sorted_friendship_pair check (couple_a_id < couple_b_id),
  unique (couple_a_id, couple_b_id)
);

create table public.friend_couple_filters (
  user_id uuid not null references public.profiles (id) on delete cascade,
  friend_couple_id uuid not null references public.couples (id) on delete cascade,
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, friend_couple_id)
);

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', false)
on conflict (id) do nothing;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger couples_touch_updated_at
before update on public.couples
for each row execute function public.touch_updated_at();

create trigger places_touch_updated_at
before update on public.places
for each row execute function public.touch_updated_at();

create trigger couple_places_touch_updated_at
before update on public.couple_places
for each row execute function public.touch_updated_at();

create trigger reviews_touch_updated_at
before update on public.reviews
for each row execute function public.touch_updated_at();

create or replace function public.is_couple_member_any_status(target_couple_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = target_couple_id
      and cm.user_id = target_user_id
  );
$$;

create or replace function public.is_couple_member(target_couple_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_members cm
    join public.couples c on c.id = cm.couple_id
    where cm.couple_id = target_couple_id
      and cm.user_id = target_user_id
      and c.status = 'active'
  );
$$;

create or replace function public.current_couple_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select cm.couple_id
  from public.couple_members cm
  join public.couples c on c.id = cm.couple_id
  where cm.user_id = auth.uid()
    and c.status = 'active'
  limit 1;
$$;

create or replace function public.are_friend_couples(left_couple_id uuid, right_couple_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_friendships cf
    join public.couples ca on ca.id = cf.couple_a_id
    join public.couples cb on cb.id = cf.couple_b_id
    where ca.status = 'active'
      and cb.status = 'active'
      and (
        (cf.couple_a_id = left_couple_id and cf.couple_b_id = right_couple_id)
        or (cf.couple_a_id = right_couple_id and cf.couple_b_id = left_couple_id)
      )
  );
$$;

create or replace function public.couple_place_review_count(target_couple_place_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer
  from public.reviews r
  where r.couple_place_id = target_couple_place_id;
$$;

create or replace function public.couple_place_has_public_photo(target_couple_place_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.reviews r
    join public.review_photos rp on rp.review_id = r.id
    where r.couple_place_id = target_couple_place_id
      and rp.kind = 'place_food'
  );
$$;

create or replace function public.is_couple_place_public_ready(target_couple_place_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_places cp
    join public.couples c on c.id = cp.couple_id
    where cp.id = target_couple_place_id
      and c.status = 'active'
      and cp.is_public
      and public.couple_place_review_count(cp.id) = 2
      and public.couple_place_has_public_photo(cp.id)
  );
$$;

create or replace function public.is_couple_place_explore_ready(target_couple_place_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_places cp
    join public.places p on p.id = cp.place_id
    where cp.id = target_couple_place_id
      and public.is_couple_place_public_ready(cp.id)
      and (p.provider = 'kakao' or p.is_explore_approved)
  );
$$;

create or replace function public.generate_public_code()
returns text
language sql
volatile
as $$
  select upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 6));
$$;

create or replace function public.create_couple(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_couple_id uuid;
  new_invite_code text;
  new_friend_code text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'User is already in a couple';
  end if;

  loop
    new_invite_code := public.generate_public_code();
    exit when not exists (select 1 from public.couples where invite_code = new_invite_code);
  end loop;

  loop
    new_friend_code := public.generate_public_code();
    exit when not exists (select 1 from public.couples where friend_code = new_friend_code);
  end loop;

  insert into public.couples (name, invite_code, friend_code)
  values (p_name, new_invite_code, new_friend_code)
  returning id into new_couple_id;

  insert into public.couple_members (couple_id, user_id)
  values (new_couple_id, auth.uid());

  return new_couple_id;
end;
$$;

create or replace function public.join_couple_by_invite_code(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_couple_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'User is already in a couple';
  end if;

  select id
  into target_couple_id
  from public.couples
  where invite_code = upper(trim(p_invite_code))
    and status = 'active';

  if target_couple_id is null then
    raise exception 'Invalid couple invite code';
  end if;

  if (select count(*) from public.couple_members where couple_id = target_couple_id) >= 2 then
    raise exception 'Couple is already full';
  end if;

  insert into public.couple_members (couple_id, user_id)
  values (target_couple_id, auth.uid());

  return target_couple_id;
end;
$$;

create or replace function public.regenerate_friend_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  my_couple_id uuid;
  new_friend_code text;
begin
  my_couple_id := public.current_couple_id();

  if my_couple_id is null then
    raise exception 'Active couple required';
  end if;

  loop
    new_friend_code := public.generate_public_code();
    exit when not exists (select 1 from public.couples where friend_code = new_friend_code);
  end loop;

  update public.couples
  set friend_code = new_friend_code,
      friend_code_rotated_at = now()
  where id = my_couple_id;

  return new_friend_code;
end;
$$;

create or replace function public.create_friendship_by_friend_code(p_friend_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  my_couple_id uuid;
  target_couple_id uuid;
  left_couple_id uuid;
  right_couple_id uuid;
  friendship_id uuid;
begin
  my_couple_id := public.current_couple_id();

  if my_couple_id is null then
    raise exception 'Active couple required';
  end if;

  select id
  into target_couple_id
  from public.couples
  where friend_code = upper(trim(p_friend_code))
    and status = 'active';

  if target_couple_id is null then
    raise exception 'Invalid friend code';
  end if;

  if target_couple_id = my_couple_id then
    raise exception 'Cannot add own couple as friend';
  end if;

  left_couple_id := least(my_couple_id, target_couple_id);
  right_couple_id := greatest(my_couple_id, target_couple_id);

  insert into public.couple_friendships (couple_a_id, couple_b_id, created_by)
  values (left_couple_id, right_couple_id, auth.uid())
  on conflict (couple_a_id, couple_b_id) do update
  set created_at = public.couple_friendships.created_at
  returning id into friendship_id;

  insert into public.friend_couple_filters (user_id, friend_couple_id, enabled)
  values (auth.uid(), target_couple_id, true)
  on conflict (user_id, friend_couple_id) do nothing;

  return friendship_id;
end;
$$;

create or replace function public.request_couple_disconnect()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  my_couple_id uuid;
begin
  my_couple_id := public.current_couple_id();

  if my_couple_id is null then
    raise exception 'Active couple required';
  end if;

  update public.couples
  set status = 'disconnect_pending',
      disconnect_requested_by = auth.uid(),
      disconnect_requested_at = now(),
      delete_after = now() + interval '7 days'
  where id = my_couple_id;
end;
$$;

create or replace function public.cancel_couple_disconnect()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  my_couple_id uuid;
begin
  select cm.couple_id
  into my_couple_id
  from public.couple_members cm
  join public.couples c on c.id = cm.couple_id
  where cm.user_id = auth.uid()
    and c.status = 'disconnect_pending'
  limit 1;

  if my_couple_id is null then
    raise exception 'Disconnect pending couple required';
  end if;

  update public.couples
  set status = 'active',
      disconnect_requested_by = null,
      disconnect_requested_at = null,
      delete_after = null
  where id = my_couple_id;
end;
$$;

create or replace function public.delete_expired_disconnected_couples()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.couples
  where status = 'disconnect_pending'
    and delete_after <= now();

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

create or replace view public.friend_couple_place_summaries as
select
  cp.id as couple_place_id,
  cp.couple_id,
  c.name as couple_name,
  p.id as place_id,
  p.name as place_name,
  p.category,
  p.address,
  p.road_address,
  p.latitude,
  p.longitude,
  p.place_url,
  round(avg(r.rating), 1) as average_rating,
  count(distinct r.id)::integer as review_count,
  array_remove(array_agg(distinct t.label), null) as tags,
  max(cp.updated_at) as updated_at
from public.couple_places cp
join public.couples c on c.id = cp.couple_id
join public.places p on p.id = cp.place_id
join public.reviews r on r.couple_place_id = cp.id
left join public.review_tags rt on rt.review_id = r.id
left join public.tags t on t.id = rt.tag_id
where public.is_couple_place_public_ready(cp.id)
  and public.are_friend_couples(public.current_couple_id(), cp.couple_id)
group by cp.id, cp.couple_id, c.name, p.id;

create or replace view public.explore_couple_place_summaries as
select
  cp.id as couple_place_id,
  cp.couple_id,
  c.name as couple_name,
  p.id as place_id,
  p.name as place_name,
  p.category,
  p.address,
  p.road_address,
  p.latitude,
  p.longitude,
  p.place_url,
  round(avg(r.rating), 1) as average_rating,
  count(distinct r.id)::integer as review_count,
  array_remove(array_agg(distinct t.label), null) as tags,
  max(cp.updated_at) as updated_at
from public.couple_places cp
join public.couples c on c.id = cp.couple_id
join public.places p on p.id = cp.place_id
join public.reviews r on r.couple_place_id = cp.id
left join public.review_tags rt on rt.review_id = r.id
left join public.tags t on t.id = rt.tag_id
where public.is_couple_place_explore_ready(cp.id)
group by cp.id, cp.couple_id, c.name, p.id;

alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.places enable row level security;
alter table public.couple_places enable row level security;
alter table public.reviews enable row level security;
alter table public.tags enable row level security;
alter table public.review_tags enable row level security;
alter table public.review_photos enable row level security;
alter table public.couple_friendships enable row level security;
alter table public.friend_couple_filters enable row level security;

create policy "profiles select self"
on public.profiles for select
using (id = auth.uid());

create policy "profiles insert self"
on public.profiles for insert
with check (id = auth.uid());

create policy "profiles update self"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "couples select active member"
on public.couples for select
using (public.is_couple_member_any_status(id));

create policy "couples update active member"
on public.couples for update
using (public.is_couple_member_any_status(id))
with check (exists (
  select 1 from public.couple_members cm
  where cm.couple_id = couples.id and cm.user_id = auth.uid()
));

create policy "couple_members select own active couple"
on public.couple_members for select
using (public.is_couple_member_any_status(couple_id));

create policy "places select authenticated"
on public.places for select
to authenticated
using (true);

create policy "places insert authenticated"
on public.places for insert
to authenticated
with check (created_by = auth.uid());

create policy "places update creator"
on public.places for update
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "couple_places select member friend or explore"
on public.couple_places for select
using (
  public.is_couple_member(couple_id)
  or (
    public.is_couple_place_public_ready(id)
    and public.are_friend_couples(public.current_couple_id(), couple_id)
  )
  or public.is_couple_place_explore_ready(id)
);

create policy "couple_places insert member"
on public.couple_places for insert
with check (
  created_by = auth.uid()
  and public.is_couple_member(couple_id)
);

create policy "couple_places update member"
on public.couple_places for update
using (public.is_couple_member(couple_id))
with check (public.is_couple_member(couple_id));

create policy "couple_places delete member"
on public.couple_places for delete
using (public.is_couple_member(couple_id));

create policy "reviews select private or public aggregate source"
on public.reviews for select
using (
  exists (
    select 1
    from public.couple_places cp
    where cp.id = reviews.couple_place_id
      and public.is_couple_member(cp.couple_id)
  )
);

create policy "reviews insert couple member"
on public.reviews for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1
    from public.couple_places cp
    where cp.id = reviews.couple_place_id
      and public.is_couple_member(cp.couple_id)
  )
);

create policy "reviews update own"
on public.reviews for update
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy "reviews delete own"
on public.reviews for delete
using (author_id = auth.uid());

create policy "tags select authenticated"
on public.tags for select
to authenticated
using (true);

create policy "review_tags select visible review"
on public.review_tags for select
using (
  exists (
    select 1 from public.reviews r
    where r.id = review_tags.review_id
      and r.author_id = auth.uid()
  )
  or exists (
    select 1
    from public.reviews r
    join public.couple_places cp on cp.id = r.couple_place_id
    where r.id = review_tags.review_id
      and public.is_couple_member(cp.couple_id)
  )
);

create policy "review_tags manage own review"
on public.review_tags for all
using (
  exists (
    select 1 from public.reviews r
    where r.id = review_tags.review_id
      and r.author_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.reviews r
    where r.id = review_tags.review_id
      and r.author_id = auth.uid()
  )
);

create policy "review_photos select couple member"
on public.review_photos for select
using (
  exists (
    select 1
    from public.reviews r
    join public.couple_places cp on cp.id = r.couple_place_id
    where r.id = review_photos.review_id
      and public.is_couple_member(cp.couple_id)
  )
);

create policy "review_photos insert own review"
on public.review_photos for insert
with check (
  exists (
    select 1 from public.reviews r
    where r.id = review_photos.review_id
      and r.author_id = auth.uid()
  )
);

create policy "review_photos update own review"
on public.review_photos for update
using (
  exists (
    select 1 from public.reviews r
    where r.id = review_photos.review_id
      and r.author_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.reviews r
    where r.id = review_photos.review_id
      and r.author_id = auth.uid()
  )
);

create policy "review_photos delete own review"
on public.review_photos for delete
using (
  exists (
    select 1 from public.reviews r
    where r.id = review_photos.review_id
      and r.author_id = auth.uid()
  )
);

create policy "friendships select member"
on public.couple_friendships for select
using (
  public.is_couple_member(couple_a_id)
  or public.is_couple_member(couple_b_id)
);

create policy "friendships insert member"
on public.couple_friendships for insert
with check (
  created_by = auth.uid()
  and (
    public.is_couple_member(couple_a_id)
    or public.is_couple_member(couple_b_id)
  )
);

create policy "friendships delete member"
on public.couple_friendships for delete
using (
  public.is_couple_member(couple_a_id)
  or public.is_couple_member(couple_b_id)
);

create policy "friend_filters select own"
on public.friend_couple_filters for select
using (user_id = auth.uid());

create policy "friend_filters upsert own"
on public.friend_couple_filters for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "review photo objects select visible" on storage.objects;
drop policy if exists "review photo objects insert own folder" on storage.objects;
drop policy if exists "review photo objects update owner" on storage.objects;
drop policy if exists "review photo objects delete owner" on storage.objects;

create policy "review photo objects select visible"
on storage.objects for select
using (
  bucket_id = 'review-photos'
  and exists (
    select 1
    from public.review_photos rp
    join public.reviews r on r.id = rp.review_id
    join public.couple_places cp on cp.id = r.couple_place_id
    where rp.storage_path = storage.objects.name
      and (
        public.is_couple_member(cp.couple_id)
        or (
          rp.kind = 'place_food'
          and public.is_couple_place_public_ready(cp.id)
          and public.are_friend_couples(public.current_couple_id(), cp.couple_id)
        )
        or (
          rp.kind = 'place_food'
          and public.is_couple_place_explore_ready(cp.id)
        )
      )
  )
);

create policy "review photo objects insert own folder"
on storage.objects for insert
with check (
  bucket_id = 'review-photos'
  and owner = auth.uid()
  and name like auth.uid()::text || '/%'
);

create policy "review photo objects update owner"
on storage.objects for update
using (
  bucket_id = 'review-photos'
  and owner = auth.uid()
)
with check (
  bucket_id = 'review-photos'
  and owner = auth.uid()
);

create policy "review photo objects delete owner"
on storage.objects for delete
using (
  bucket_id = 'review-photos'
  and owner = auth.uid()
);

revoke execute on function public.create_couple(text) from public;
revoke execute on function public.join_couple_by_invite_code(text) from public;
revoke execute on function public.regenerate_friend_code() from public;
revoke execute on function public.create_friendship_by_friend_code(text) from public;
revoke execute on function public.request_couple_disconnect() from public;
revoke execute on function public.cancel_couple_disconnect() from public;
revoke execute on function public.delete_expired_disconnected_couples() from public;

grant execute on function public.create_couple(text) to authenticated;
grant execute on function public.join_couple_by_invite_code(text) to authenticated;
grant execute on function public.regenerate_friend_code() to authenticated;
grant execute on function public.create_friendship_by_friend_code(text) to authenticated;
grant execute on function public.request_couple_disconnect() to authenticated;
grant execute on function public.cancel_couple_disconnect() to authenticated;
grant execute on function public.delete_expired_disconnected_couples() to service_role;

insert into public.tags (category, label, sort_order) values
  ('restaurant', '맛있어요', 10),
  ('restaurant', '가성비 좋아요', 20),
  ('restaurant', '분위기 좋아요', 30),
  ('restaurant', '예약 추천', 40),
  ('restaurant', '웨이팅 있음', 50),
  ('restaurant', '기념일 추천', 60),
  ('cafe', '커피 맛집', 10),
  ('cafe', '디저트 맛집', 20),
  ('cafe', '조용해요', 30),
  ('cafe', '사진 잘 나와요', 40),
  ('cafe', '작업 가능', 50),
  ('cafe', '뷰 좋아요', 60),
  ('activity', '재밌어요', 10),
  ('activity', '초보 가능', 20),
  ('activity', '실내', 30),
  ('activity', '야외', 40),
  ('activity', '비 오는 날 추천', 50),
  ('activity', '예약 필요', 60),
  (null, '재방문 의사 있음', 10),
  (null, '대화하기 좋아요', 20),
  (null, '데이트 코스 추천', 30);
