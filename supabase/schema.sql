-- BiteBeat database schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  handle text unique not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  tags text[] default '{}',
  recipe jsonb default '{}'::jsonb,
  storage_path text not null,
  thumb_url text,
  likes_count int default 0,
  comments_count int default 0,
  created_at timestamptz default now()
);

create table if not exists public.likes (
  user_id uuid references public.profiles(id) on delete cascade,
  video_id uuid references public.videos(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, video_id)
);

create table if not exists public.comments (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  video_id uuid references public.videos(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists public.follows (
  follower uuid references public.profiles(id) on delete cascade,
  followee uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower, followee)
);

create table if not exists public.scores (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  score int not null,
  max_combo int not null,
  duration_ms int not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy if not exists "read profiles" on public.profiles for select using (true);
create policy if not exists "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy if not exists "update own profile" on public.profiles for update using (auth.uid() = id);

alter table public.videos enable row level security;
create policy if not exists "read videos" on public.videos for select using (true);
create policy if not exists "insert own videos" on public.videos for insert with check (auth.uid() = user_id);
create policy if not exists "update own videos" on public.videos for update using (auth.uid() = user_id);
create policy if not exists "delete own videos" on public.videos for delete using (auth.uid() = user_id);

alter table public.likes enable row level security;
create policy if not exists "read likes" on public.likes for select using (true);
create policy if not exists "write own likes" on public.likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.comments enable row level security;
create policy if not exists "read comments" on public.comments for select using (true);
create policy if not exists "write own comments" on public.comments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.follows enable row level security;
create policy if not exists "read follows" on public.follows for select using (true);
create policy if not exists "write own follows" on public.follows for all using (auth.uid() = follower) with check (auth.uid() = follower);

alter table public.scores enable row level security;
create policy if not exists "read scores" on public.scores for select using (true);
create policy if not exists "write own scores" on public.scores for insert with check (auth.uid() = user_id);
