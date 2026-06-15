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
  max(cp.updated_at) as updated_at,
  array_remove(array_agg(distinct rp.storage_path) filter (where rp.kind = 'place_food'), null) as public_photo_paths
from public.couple_places cp
join public.couples c on c.id = cp.couple_id
join public.places p on p.id = cp.place_id
join public.reviews r on r.couple_place_id = cp.id
left join public.review_tags rt on rt.review_id = r.id
left join public.tags t on t.id = rt.tag_id
left join public.review_photos rp on rp.review_id = r.id and rp.kind = 'place_food'
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
  max(cp.updated_at) as updated_at,
  array_remove(array_agg(distinct rp.storage_path) filter (where rp.kind = 'place_food'), null) as public_photo_paths
from public.couple_places cp
join public.couples c on c.id = cp.couple_id
join public.places p on p.id = cp.place_id
join public.reviews r on r.couple_place_id = cp.id
left join public.review_tags rt on rt.review_id = r.id
left join public.tags t on t.id = rt.tag_id
left join public.review_photos rp on rp.review_id = r.id and rp.kind = 'place_food'
where public.is_couple_place_explore_ready(cp.id)
group by cp.id, cp.couple_id, c.name, p.id;
