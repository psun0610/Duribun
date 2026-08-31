-- 목록 상단에 "상대 이름 ♥ 내 이름"을 보여주려면 상대의 이름이 필요합니다.
-- profiles의 RLS는 본인 행만 읽게 되어 있고, 이메일까지 들어 있어 정책을 넓히지 않습니다.
-- 대신 이름과 사진만 노출하는 뷰를 둡니다. 다른 공개 요약 뷰와 같은 방식입니다.
create or replace view public.couple_member_profiles as
select
  p.id,
  p.display_name,
  p.avatar_url,
  cm.couple_id,
  (p.id = auth.uid()) as is_me
from public.couple_members cm
join public.profiles p on p.id = cm.user_id
join public.couples c on c.id = cm.couple_id
where cm.couple_id = public.current_couple_id()
  and c.status = 'active';

grant select on public.couple_member_profiles to authenticated;
