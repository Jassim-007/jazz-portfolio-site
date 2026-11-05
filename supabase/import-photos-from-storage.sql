-- Run only in the PORTFOLIO project (project ref: mltiunpjhpwlgibcvfym), after uploading images to the public
-- `portfolio-media` bucket. New rows stay unpublished until they have real
-- titles, captions, and accessible alt text; this avoids visible MOMENT labels.

with existing_order as (
  select coalesce(max(sort_order), 0)::integer as last_order
  from public.portfolio_media
  where kind = 'photo'
), unregistered_images as (
  select objects.name as storage_path
  from storage.objects as objects
  where objects.bucket_id = 'portfolio-media'
    and lower(coalesce(objects.metadata ->> 'mimetype', '')) like 'image/%'
    and not exists (
      select 1
      from public.portfolio_media as media
      where media.kind = 'photo'
        and media.storage_path = objects.name
    )
), ordered_images as (
  select
    storage_path,
    (row_number() over (order by storage_path) + (select last_order from existing_order))::integer as sort_order
  from unregistered_images
)
insert into public.portfolio_media (
  kind,
  title,
  description,
  alt_text,
  storage_path,
  sort_order,
  is_published
)
select
  'photo',
  'ADD PHOTO TITLE',
  '',
  'Mobile photograph from Jazz’s photo collection',
  storage_path,
  sort_order,
  false
from ordered_images;

select
  count(*) filter (where is_published) as published_photos,
  count(*) filter (where not is_published) as drafts_needing_captions
from public.portfolio_media
where kind = 'photo';
