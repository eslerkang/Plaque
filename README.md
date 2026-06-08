# Plaque — 나만의 미술관 스크랩북

A mobile-first art journal and scrapbook for museum and gallery visitors. Built with Next.js 16, Supabase, and OpenCV.js.

## Features

- **Photo capture** — shoot or upload artwork photos directly from the app
- **Perspective correction** — OpenCV.js detects artwork edges and corrects perspective (no AI APIs)
- **Museum catalog cards** — each saved artwork displayed as a clean catalog entry
- **Full metadata** — title, artist, year, medium, gallery, exhibition, visit date, rating (1–5 stars), tags, personal note
- **Search & filter** — by text, rating, and tag
- **Google OAuth** — via Supabase Auth

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (Auth, Postgres, Storage)
- **OpenCV.js 4.8** (client-side image processing — no AI)

## Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the migration

In Supabase Dashboard → SQL Editor, paste and run:

```
supabase/migrations/001_initial.sql
```

This creates the `profiles` and `artwork_entries` tables, RLS policies, triggers, and storage bucket.

### 3. Enable Google OAuth

Supabase Dashboard → Authentication → Providers → Google:
- Enable Google provider
- Add Google OAuth credentials (Client ID + Secret from Google Cloud Console)
- Set redirect URL: `https://<your-domain>/auth/callback`

### 4. Set environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Find these in: Supabase Dashboard → Project Settings → API

### 5. Install and run

```bash
npm install
npm run dev
```

### 6. Deploy to Vercel

```bash
npx vercel
```

Add environment variables in Vercel project settings.  
Add your Vercel URL to Supabase Auth → URL Configuration → Redirect URLs.

## Project Structure

```
src/
  app/
    page.tsx                  Landing page
    login/                    Login + Google OAuth
    auth/callback/            OAuth callback route
    scrapbook/
      page.tsx                Catalog grid view
      new/                    Add artwork (3-step flow)
      [id]/page.tsx           Artwork detail
      [id]/edit/              Edit artwork
    search/                   Search + tag/rating filters
    settings/                 Profile + sign out
  components/
    ArtworkCard.tsx           Museum catalog card
    BottomNav.tsx             Mobile bottom navigation
    ImageProcessor.tsx        OpenCV.js perspective correction
    StarRating.tsx            Interactive star rating
    AIFeaturePlaceholder.tsx  Disabled AI buttons + coming-soon modal
    ui/                       Button, Input, Label, Textarea, Badge, Dialog
  lib/
    supabase/                 Browser + server Supabase clients
    types.ts                  TypeScript types (Profile, ArtworkEntry)
    utils.ts                  cn(), formatDate()
  middleware.ts               Route protection
supabase/
  migrations/001_initial.sql  Full schema + RLS + storage policies
```

## Image Processing (no AI)

OpenCV.js runs entirely in the browser:

1. Upload → drawn to off-screen canvas (capped at 1600px)
2. Gaussian blur + Canny edge detection + dilation
3. Contour detection → quadrilateral approximation
4. Largest rectangular contour = artwork boundary
5. Perspective transform → cropped, deskewed image
6. Both original and cleaned images uploaded to Supabase Storage
7. User picks which version to display; both always preserved

Low-confidence or failed detections fall back to original with an explanatory message.
