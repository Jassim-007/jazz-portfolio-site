# Jazz — Portfolio

Personal portfolio for Muhammed Jassim (Jazz), built with React and Vite.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Supabase media

Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable key. The `.env.local` file is ignored by Git. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for the media table and storage setup.

Photos are loaded from the public Supabase storage bucket. Video entries use YouTube embeds, which load after a visitor presses play.
