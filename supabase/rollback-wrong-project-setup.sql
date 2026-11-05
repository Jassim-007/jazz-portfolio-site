-- RUN THIS ONLY in the Supabase project you accidentally used.
-- It removes the portfolio table created by portfolio-media.sql, including
-- the FOSSIL AD row, its policy, and its table grants.
-- Remove an empty Storage bucket separately through the Supabase Storage UI.
BEGIN;

DROP TABLE IF EXISTS public.portfolio_media;

COMMIT;

SELECT
  to_regclass('public.portfolio_media') AS portfolio_table_after_rollback;
