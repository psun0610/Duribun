create or replace function public.register_kakao_couple_place(
  p_provider_place_id text,
  p_name text,
  p_category public.place_category,
  p_provider_category_name text default null,
  p_address text default null,
  p_road_address text default null,
  p_latitude numeric default null,
  p_longitude numeric default null,
  p_place_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  my_couple_id uuid;
  target_place_id uuid;
  target_couple_place_id uuid;
begin
  my_couple_id := public.current_couple_id();

  if my_couple_id is null then
    raise exception 'Active couple required';
  end if;

  if nullif(trim(p_provider_place_id), '') is null then
    raise exception 'Kakao provider place id required';
  end if;

  insert into public.places (
    provider,
    provider_place_id,
    name,
    category,
    provider_category_name,
    address,
    road_address,
    latitude,
    longitude,
    place_url,
    created_by
  )
  values (
    'kakao',
    trim(p_provider_place_id),
    trim(p_name),
    p_category,
    nullif(trim(coalesce(p_provider_category_name, '')), ''),
    nullif(trim(coalesce(p_address, '')), ''),
    nullif(trim(coalesce(p_road_address, '')), ''),
    p_latitude,
    p_longitude,
    nullif(trim(coalesce(p_place_url, '')), ''),
    auth.uid()
  )
  on conflict (provider, provider_place_id) where provider_place_id is not null
  do update
  set name = excluded.name,
      category = excluded.category,
      provider_category_name = excluded.provider_category_name,
      address = excluded.address,
      road_address = excluded.road_address,
      latitude = excluded.latitude,
      longitude = excluded.longitude,
      place_url = excluded.place_url
  returning id into target_place_id;

  insert into public.couple_places (couple_id, place_id, created_by)
  values (my_couple_id, target_place_id, auth.uid())
  on conflict (couple_id, place_id) do update
  set updated_at = public.couple_places.updated_at
  returning id into target_couple_place_id;

  return target_couple_place_id;
end;
$$;

create or replace function public.register_manual_couple_place(
  p_name text,
  p_category public.place_category,
  p_address text default null,
  p_road_address text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  my_couple_id uuid;
  target_place_id uuid;
  target_couple_place_id uuid;
begin
  my_couple_id := public.current_couple_id();

  if my_couple_id is null then
    raise exception 'Active couple required';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception 'Manual place name required';
  end if;

  insert into public.places (
    provider,
    name,
    category,
    address,
    road_address,
    is_explore_approved,
    created_by
  )
  values (
    'manual',
    trim(p_name),
    p_category,
    nullif(trim(coalesce(p_address, '')), ''),
    nullif(trim(coalesce(p_road_address, '')), ''),
    false,
    auth.uid()
  )
  returning id into target_place_id;

  insert into public.couple_places (couple_id, place_id, created_by)
  values (my_couple_id, target_place_id, auth.uid())
  returning id into target_couple_place_id;

  return target_couple_place_id;
end;
$$;

revoke execute on function public.register_kakao_couple_place(
  text,
  text,
  public.place_category,
  text,
  text,
  text,
  numeric,
  numeric,
  text
) from public;
revoke execute on function public.register_manual_couple_place(
  text,
  public.place_category,
  text,
  text
) from public;

grant execute on function public.register_kakao_couple_place(
  text,
  text,
  public.place_category,
  text,
  text,
  text,
  numeric,
  numeric,
  text
) to authenticated;
grant execute on function public.register_manual_couple_place(
  text,
  public.place_category,
  text,
  text
) to authenticated;
