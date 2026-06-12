drop policy if exists "couples update active member" on public.couples;

revoke update on public.couples from anon;
revoke update on public.couples from authenticated;

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
    and c.delete_after > now()
  limit 1;

  if my_couple_id is null then
    raise exception 'Unexpired disconnect pending couple required';
  end if;

  update public.couples
  set status = 'active',
      disconnect_requested_by = null,
      disconnect_requested_at = null,
      delete_after = null
  where id = my_couple_id;
end;
$$;

grant execute on function public.request_couple_disconnect() to authenticated;
grant execute on function public.cancel_couple_disconnect() to authenticated;
grant execute on function public.delete_expired_disconnected_couples() to service_role;
