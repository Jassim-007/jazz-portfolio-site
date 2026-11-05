-- Run only in the PORTFOLIO project (project ref: mltiunpjhpwlgibcvfym),
-- through Supabase Dashboard > SQL Editor.
-- Public visitors can read published gallery entries only. The website has no write policy.

create table if not exists public.portfolio_media (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('photo', 'video')),
  title text not null,
  description text not null default '',
  alt_text text not null default '',
  storage_path text,
  cover_path text,
  youtube_id text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint portfolio_media_source_check check (
    (kind = 'photo' and storage_path is not null and youtube_id is null)
    or (kind = 'video' and youtube_id is not null and storage_path is null)
  )
);

alter table public.portfolio_media enable row level security;
grant select on public.portfolio_media to anon, authenticated;

drop policy if exists "Published portfolio media is public" on public.portfolio_media;
create policy "Published portfolio media is public"
  on public.portfolio_media
  for select
  to anon, authenticated
  using (is_published = true);

-- Create the public read-only photo bucket. No browser upload/delete policy is added.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
