create or replace function public.generate_public_code()
returns text
language sql
volatile
as $$
  select upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 6));
$$;
