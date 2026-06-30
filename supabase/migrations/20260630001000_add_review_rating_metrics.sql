create table if not exists public.review_ratings (
  review_id uuid not null references public.reviews (id) on delete cascade,
  rating_key text not null,
  rating_label text not null,
  score numeric(2, 1) not null,
  created_at timestamptz not null default now(),
  primary key (review_id, rating_key),
  constraint review_rating_key_not_empty check (length(trim(rating_key)) > 0),
  constraint review_rating_label_not_empty check (length(trim(rating_label)) > 0),
  constraint review_rating_score_range check (
    score >= 0.5
    and score <= 5
    and score * 2 = round(score * 2)
  )
);

alter table public.review_ratings enable row level security;

drop policy if exists "review_ratings select visible review" on public.review_ratings;
drop policy if exists "review_ratings manage own review" on public.review_ratings;

create policy "review_ratings select visible review"
on public.review_ratings for select
using (
  exists (
    select 1 from public.reviews r
    where r.id = review_ratings.review_id
      and r.author_id = auth.uid()
  )
  or exists (
    select 1
    from public.reviews r
    join public.couple_places cp on cp.id = r.couple_place_id
    where r.id = review_ratings.review_id
      and public.is_couple_member(cp.couple_id)
  )
);

create policy "review_ratings manage own review"
on public.review_ratings for all
using (
  exists (
    select 1 from public.reviews r
    where r.id = review_ratings.review_id
      and r.author_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.reviews r
    where r.id = review_ratings.review_id
      and r.author_id = auth.uid()
  )
);

insert into public.review_ratings (review_id, rating_key, rating_label, score)
select r.id, 'overall', '종합', r.rating
from public.reviews r
where not exists (
  select 1
  from public.review_ratings rr
  where rr.review_id = r.id
);
