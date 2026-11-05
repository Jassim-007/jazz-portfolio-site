# Supabase media setup

The portfolio reads published gallery entries from `portfolio_media`. Photos are served from the public `portfolio-media` bucket; videos are embedded from YouTube and are not uploaded to Supabase.

Use the Supabase project with ref `mltiunpjhpwlgibcvfym` for this site. Confirm the project selector before running any SQL below.

## Create the project

1. Create a Supabase project on the Free plan.
2. Open **SQL Editor**, paste and run `supabase/portfolio-media.sql`.
3. Open **Project Settings → API Keys** (or **Connect**) and copy the Project URL and publishable key.
4. Copy `.env.example` to `.env.local` and replace its two placeholder values.
5. Restart the Vite development server after saving `.env.local`.

Do not use or share a `service_role` or secret key in the browser app. The SQL creates read access for published records and adds no public write policy.

## Add a photo

1. In **Storage → portfolio-media**, upload a JPG, PNG, WebP, or AVIF image. Keep each image under 50 MB; optimized WebP/JPEG files load faster and use less of the 1 GB Free storage allowance.
2. Copy the object's path, for example `photos/coast-at-sunset.webp`.
3. In **Table Editor → portfolio_media**, add a row:
   - `kind`: `photo`
   - `title`: a short title
   - `description`: optional caption
   - `alt_text`: a brief description for accessibility
   - `storage_path`: the exact path copied from Storage
   - `sort_order`: 1, 2, 3…
   - `is_published`: `true`
   - `youtube_id`: leave empty

For many photos already in the `portfolio-media` bucket, run `supabase/import-photos-from-storage.sql` in the SQL Editor. It safely registers unlisted images as unpublished drafts so placeholder names never appear on the public gallery. In Table Editor, give each draft a title, caption, and alt text, then set `is_published` to `true`. The importer can be rerun safely when you upload more.

## Add a video

1. Upload the video to YouTube as **Unlisted** and make sure embedding is allowed.
2. In **Table Editor → portfolio_media**, add a row with `kind` set to `video`, plus `title`, optional `description`, the 11-character `youtube_id`, `sort_order`, and `is_published = true`.
   You can optionally upload a custom still image and enter its path in `cover_path`; otherwise the YouTube thumbnail is used.
3. The portfolio displays a cover and loads the YouTube player after the visitor presses play.

Unlisted videos are shareable by anyone with the link. Avoid putting sensitive/private footage there.

The Free plan currently includes 1 GB of Storage, a 50 MB per-file limit, and 10 GB of monthly egress. Video playback is kept on YouTube to avoid using that gallery bandwidth.
