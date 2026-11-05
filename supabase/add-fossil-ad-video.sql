-- Run this in the PORTFOLIO Supabase project (project ref: mltiunpjhpwlgibcvfym).
-- Add the first videography entry. Safe to run more than once.
INSERT INTO public.portfolio_media (
  kind,
  title,
  description,
  alt_text,
  storage_path,
  cover_path,
  youtube_id,
  sort_order,
  is_published
)
SELECT
  'video',
  'FOSSIL AD',
  '',
  'FOSSIL AD video',
  NULL,
  NULL,
  'NEGpyXH8HsQ',
  COALESCE((SELECT max(sort_order) + 1 FROM public.portfolio_media WHERE kind = 'video'), 1),
  TRUE
WHERE NOT EXISTS (
  SELECT 1
  FROM public.portfolio_media
  WHERE kind = 'video'
    AND youtube_id = 'NEGpyXH8HsQ'
);

SELECT id, title, youtube_id, is_published, sort_order
FROM public.portfolio_media
WHERE kind = 'video'
  AND youtube_id = 'NEGpyXH8HsQ';
