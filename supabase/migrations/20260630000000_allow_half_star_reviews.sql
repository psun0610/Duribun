alter table public.reviews
  drop constraint if exists rating_range;

alter table public.reviews
  add constraint rating_range check (rating >= 0.5 and rating <= 5);
