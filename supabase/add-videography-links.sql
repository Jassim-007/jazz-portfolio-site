-- Run this in the PORTFOLIO Supabase project (project ref: mltiunpjhpwlgibcvfym).
-- Add the eight supplied YouTube videos using their current YouTube titles.
-- Safe to rerun: existing YouTube IDs are skipped.
WITH supplied_videos(sort_order_in_batch, youtube_id, title) AS (
  VALUES
    (1, 'vXqaEw43IUE', 'SS80 JAPAN...'),
    (2, 'IxN1AyzIlwQ', 'Suzuki Jimny ...'),
    (3, '_KkF4UxDUGA', 'Royal Enfield Meteor...'),
    (4, 'QbrYyD3Sm1s', 'Nethravathi Trek...'),
    (5, 'Jsxe4KerQSA', 'Waah...'),
    (6, '3uygtWtSvlU', 'Kainakiri...'),
    (7, 'oW_5aL4BEGo', '...'),
    (8, '9vEhaTQEg40', 'Ponmudi....')
), missing_videos AS (
  SELECT supplied_videos.*
  FROM supplied_videos
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.portfolio_media AS existing
    WHERE existing.kind = 'video'
      AND existing.youtube_id = supplied_videos.youtube_id
  )
)
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
  missing_videos.title,
  '',
  'YouTube video thumbnail for ' || missing_videos.title,
  NULL,
  NULL,
  missing_videos.youtube_id,
  COALESCE((SELECT max(sort_order) FROM public.portfolio_media WHERE kind = 'video'), 0)
    + row_number() OVER (ORDER BY missing_videos.sort_order_in_batch),
  TRUE
FROM missing_videos
ORDER BY missing_videos.sort_order_in_batch;

SELECT title, youtube_id, is_published, sort_order
FROM public.portfolio_media
WHERE kind = 'video'
  AND youtube_id IN (
    'vXqaEw43IUE', 'IxN1AyzIlwQ', '_KkF4UxDUGA', 'QbrYyD3Sm1s',
    'Jsxe4KerQSA', '3uygtWtSvlU', 'oW_5aL4BEGo', '9vEhaTQEg40'
  )
ORDER BY sort_order;
