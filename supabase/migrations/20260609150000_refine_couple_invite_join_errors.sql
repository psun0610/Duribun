create or replace function public.join_couple_by_invite_code(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_couple_id uuid;
  target_status public.couple_status;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'User is already in a couple';
  end if;

  select id, status
  into target_couple_id, target_status
  from public.couples
  where invite_code = upper(trim(p_invite_code));

  if target_couple_id is null then
    raise exception 'Invalid couple invite code';
  end if;

  if target_status <> 'active' then
    raise exception 'Inactive couple invite code';
  end if;

  if (select count(*) from public.couple_members where couple_id = target_couple_id) >= 2 then
    raise exception 'Couple is already full';
  end if;

  insert into public.couple_members (couple_id, user_id)
  values (target_couple_id, auth.uid());

  return target_couple_id;
end;
$$;
