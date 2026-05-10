-- 두리번(Duribun) 관계형 스키마
-- Supabase SQL Editor 또는 `supabase db push` 등으로 적용하세요.
-- 기존 Figma Make용 KV 테이블 `public.users`(key, value)는 이 앱 로직에서 더 이상 쓰지 않습니다. 데이터 이전 후 DROP 하면 됩니다.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- couples: 매칭된 두 유저 (코드 생성자 = user_a, 코드 입력자 = user_b)
-- ---------------------------------------------------------------------------
create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references auth.users (id) on delete restrict,
  user_b_id uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint couples_distinct_users check (user_a_id <> user_b_id),
  constraint couples_ordered unique (user_a_id, user_b_id)
);

create index if not exists couples_user_a_idx on public.couples (user_a_id);
create index if not exists couples_user_b_idx on public.couples (user_b_id);

-- ---------------------------------------------------------------------------
-- profiles: auth.users 1:1 확장 (표시 이름, 현재 커플)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  couple_id uuid references public.couples (id) on delete set null,
  partner_nickname text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_couple_id_idx on public.profiles (couple_id);

-- ---------------------------------------------------------------------------
-- couple_invite_codes: 6자리 임시 매칭 코드
-- ---------------------------------------------------------------------------
create table if not exists public.couple_invite_codes (
  code text primary key,
  inviter_id uuid not null references auth.users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists couple_invite_codes_inviter_idx on public.couple_invite_codes (inviter_id);

-- ---------------------------------------------------------------------------
-- places: 커플이 등록한 장소
-- ---------------------------------------------------------------------------
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  name text not null,
  address text not null,
  category text not null,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now(),
  constraint places_category_check check (category in ('식당', '카페', '액티비티'))
);

create index if not exists places_couple_id_idx on public.places (couple_id);

-- ---------------------------------------------------------------------------
-- reviews: 장소당 유저별 1건 (upsert)
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  ratings jsonb not null default '{}'::jsonb,
  rating numeric(4, 2) not null,
  revisit boolean not null default true,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_place_user_unique unique (place_id, user_id)
);

create index if not exists reviews_place_id_idx on public.reviews (place_id);
create index if not exists reviews_user_id_idx on public.reviews (user_id);

-- ---------------------------------------------------------------------------
-- updated_at 자동 갱신
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 회원가입 시 프로필 자동 생성 (Edge / 대시보드 등 모든 가입 경로)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      ''
    )
  )
  on conflict (id) do update
    set display_name = excluded.display_name,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 커플 매칭 (원자적 처리, Service Role에서만 호출 권장)
-- ---------------------------------------------------------------------------
create or replace function public.join_couple_with_code(p_code text, p_joiner uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inviter uuid;
  v_expires timestamptz;
  v_couple_id uuid;
begin
  select c.inviter_id, c.expires_at
    into v_inviter, v_expires
  from public.couple_invite_codes c
  where c.code = p_code
  for update;

  if v_inviter is null then
    raise exception 'Invalid or expired code' using errcode = '22023';
  end if;

  if v_expires < now() then
    delete from public.couple_invite_codes where code = p_code;
    raise exception 'Invalid or expired code' using errcode = '22023';
  end if;

  if v_inviter = p_joiner then
    raise exception 'Cannot match with yourself' using errcode = '22023';
  end if;

  if exists (select 1 from public.profiles p where p.id = v_inviter and p.couple_id is not null) then
    raise exception 'Inviter already matched' using errcode = '22023';
  end if;

  if exists (select 1 from public.profiles p where p.id = p_joiner and p.couple_id is not null) then
    raise exception 'Joiner already matched' using errcode = '22023';
  end if;

  insert into public.couples (user_a_id, user_b_id)
  values (v_inviter, p_joiner)
  returning id into v_couple_id;

  update public.profiles
    set couple_id = v_couple_id,
        updated_at = now()
  where id in (v_inviter, p_joiner);

  delete from public.couple_invite_codes where code = p_code;

  return v_couple_id;
end;
$$;

revoke all on function public.join_couple_with_code(text, uuid) from public;
grant execute on function public.join_couple_with_code(text, uuid) to service_role;

-- ---------------------------------------------------------------------------
-- RLS (클라이언트에서 anon key로 직접 접근할 때를 대비; Edge는 service_role로 우회)
-- ---------------------------------------------------------------------------
alter table public.couples enable row level security;
alter table public.profiles enable row level security;
alter table public.couple_invite_codes enable row level security;
alter table public.places enable row level security;
alter table public.reviews enable row level security;

-- couples: 본인이 속한 커플 행만 조회
drop policy if exists couples_select_member on public.couples;
create policy couples_select_member on public.couples
  for select using (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- profiles: 본인 프로필 읽기/수정
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id);

-- invite codes: 본인이 만든 코드만 조회 (선택)
drop policy if exists invite_codes_select_own on public.couple_invite_codes;
create policy invite_codes_select_own on public.couple_invite_codes
  for select using (auth.uid() = inviter_id);

-- places: 같은 커플 소속만
drop policy if exists places_select_couple on public.places;
create policy places_select_couple on public.places
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.couple_id = places.couple_id
    )
  );

drop policy if exists places_insert_couple on public.places;
create policy places_insert_couple on public.places
  for insert with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.couple_id = places.couple_id
    )
  );

-- reviews: 장소가 내 커플 것이면 조회, 본인 작성만 insert/update
drop policy if exists reviews_select_couple on public.reviews;
create policy reviews_select_couple on public.reviews
  for select using (
    exists (
      select 1 from public.places pl
      join public.profiles p on p.couple_id = pl.couple_id
      where pl.id = reviews.place_id and p.id = auth.uid()
    )
  );

drop policy if exists reviews_insert_own on public.reviews;
create policy reviews_insert_own on public.reviews
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.places pl
      join public.profiles p on p.couple_id = pl.couple_id
      where pl.id = reviews.place_id and p.id = auth.uid()
    )
  );

drop policy if exists reviews_update_own on public.reviews;
create policy reviews_update_own on public.reviews
  for update using (auth.uid() = user_id);

-- Service role은 RLS 우회. authenticated만 위 정책 적용.

comment on table public.couples is '커플 매칭 (user_a: 코드 생성자, user_b: 코드 입력자)';
comment on table public.profiles is '사용자 확장 프로필 및 현재 couple_id (partner_nickname: 상대방 호칭)';
comment on column public.profiles.partner_nickname is '상대방을 지칭하는 호칭. 커플 매칭 직후 설정하며, 리뷰/대시보드 등에서 표시됨';
comment on table public.couple_invite_codes is '24시간 유효 6자리 매칭 코드';
comment on table public.places is '커플이 등록한 방문 장소';
comment on table public.reviews is '장소별 유저 리뷰 (세부 점수는 ratings jsonb)';
