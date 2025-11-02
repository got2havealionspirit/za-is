# BiteBeat

BiteBeat is a steampunk-inspired short-form food video platform. Swipe vertically through looping recipe shorts, surface ingredients with interactive overlays, and challenge friends in the SwipeChef mini-game backed by a Supabase leaderboard.

## Stack
- **Framework**: Next.js 14 App Router (React Server Components + Client Components)
- **UI**: Tailwind CSS, custom steampunk palette, shadcn-inspired primitives
- **State**: Zustand (local state), React Hook Form
- **Validation**: Zod
- **Auth & Data**: Supabase (Auth, Postgres, Storage)
- **Mini-game**: Phaser 3 embedded at `/game`

## Getting started
1. **Install dependencies**
   ```bash
   pnpm install
   ```
   or use `npm`/`yarn` if you prefer.

2. **Environment**
   Copy `.env.example` to `.env.local` and fill in the following values from your Supabase project settings:
   ```bash
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE=...
   ```
   Expose `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` if you need client-side configuration overrides.

3. **Database & storage**
   - Run the schema: paste the contents of `supabase/schema.sql` into the Supabase SQL editor (or `supabase db push`).
   - Create a private storage bucket named `videos`.
   - Configure auth providers (email + magic link recommended).

4. **Seeding demo content**
   ```bash
   pnpm seed
   ```
   The seed script inserts two demo chefs and two sample videos referencing files under `public/samples/`. Replace those MP4 placeholders with real vertical videos for richer demos.

5. **Development**
   ```bash
   pnpm dev
   ```
   Visit `http://localhost:3000` for the marketing page and `http://localhost:3000/feed` for the vertical feed.

## Key features
- **Vertical feed** (`/feed`): Server-rendered ranking combining freshness, likes, and comments. IntersectionObserver auto plays/pause videos and exposes actions for likes, comments, saving, sharing, and long-press recipe overlays.
- **Recipe overlays**: JSON-driven ingredients and step timeline synced to playback, reusable via `<RecipeOverlay />` and `<RecipePlayer />`.
- **Upload workflow** (`/upload`): Auth-guarded form with drag/drop video upload to Supabase Storage, recipe JSON editor, and metadata fields.
- **Profiles** (`/profile/[handle]`): Chef stats, bio, and grid of their videos.
- **Mini-game** (`/game`): Phaser-powered SwipeChef with score reporting via `postMessage` and Supabase-backed leaderboard accessible from the feed.

## Scripts
- `pnpm dev` – start Next.js in development
- `pnpm build` – production build
- `pnpm start` – run the production server
- `pnpm lint` – run ESLint
- `pnpm typecheck` – type-check the project
- `pnpm seed` – seed demo profiles/videos into Supabase

## Testing the SwipeChef pipeline
1. Sign in via Supabase auth (magic link or email/password).
2. Play a full SwipeChef round in `/game` and wait for the match summary to post back.
3. Reload `/feed` to see daily/all-time leaderboard highlights populated.

## Definition of Done
Manual verification steps:
1. Run `pnpm dev` and open `http://localhost:3000` to confirm the marketing landing page renders with steampunk branding.
2. Visit `/feed` to check the infinite scrolling short-video feed with working IntersectionObserver autoplay, recipe overlay toggle, and leaderboard preview.
3. Sign in, go to `/upload`, and confirm the upload form allows selecting a file, entering metadata, and posts to Supabase (requires valid credentials and bucket).
4. Navigate to `/recipe/[id]` for a seeded video to confirm the player and overlay timeline sync.
5. Play SwipeChef at `/game`, finish a round, and verify a POST is sent to `/api/telemetry/match` (watch network tab) and leaderboard stats refresh on `/feed`.
