import dayjs from "dayjs";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabaseServer";
import { recipeSchema } from "./validators";
import { computeFeedScore } from "./feed";

export type Profile = {
  id: string;
  handle: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};

export type Video = {
  id: string;
  user_id: string;
  title: string;
  tags: string[];
  recipe: z.infer<typeof recipeSchema>;
  storage_path: string;
  thumb_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: Profile;
  signed_url?: string;
};

export type ScoreRow = {
  id: number;
  user_id: string;
  score: number;
  max_combo: number;
  duration_ms: number;
  created_at: string;
  profile?: Profile;
};

export const getFeedVideos = async () => {
  const supabase = createSupabaseServerClient();

  const { data: videos, error } = await supabase
    .from("videos")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  const enriched = await Promise.all(
    (videos || []).map(async (video) => {
      const score = computeFeedScore({
        likes: video.likes_count ?? 0,
        comments: video.comments_count ?? 0,
        createdAt: video.created_at ?? new Date().toISOString()
      });

      let signedUrl: string | null = null;
      if (video.storage_path) {
        const { data } = await supabase.storage.from("videos").createSignedUrl(video.storage_path, 60 * 60);
        signedUrl = data?.signedUrl ?? null;
      }

      return {
        ...(video as Video & { profiles: Profile }),
        recipe: (video.recipe as object) ?? {},
        author: video.profiles,
        score,
        signed_url: signedUrl ?? undefined
      };
    })
  );

  return enriched.sort((a, b) => b.score - a.score) as (Video & { author: Profile; score: number })[];
};

export const getVideoById = async (id: string) => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, profiles(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  let signedUrl: string | null = null;
  if (data.storage_path) {
    const { data: signed } = await supabase.storage.from("videos").createSignedUrl(data.storage_path, 60 * 60);
    signedUrl = signed?.signedUrl ?? null;
  }

  return {
    ...(data as Video & { profiles: Profile }),
    author: data.profiles,
    recipe: (data.recipe as object) ?? {},
    signed_url: signedUrl ?? undefined
  };
};

export const getProfileByHandle = async (handle: string) => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, videos(*)")
    .eq("handle", handle)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const videos = await Promise.all(
    (data.videos || []).map(async (video: any) => {
      let signedUrl: string | null = null;
      if (video.storage_path) {
        const { data: signed } = await supabase.storage.from("videos").createSignedUrl(video.storage_path, 60 * 60);
        signedUrl = signed?.signedUrl ?? null;
      }
      return {
        ...video,
        recipe: (video.recipe as object) ?? {},
        signed_url: signedUrl ?? undefined
      } as Video;
    })
  );

  return {
    profile: data as Profile & { videos: Video[] },
    videos
  };
};

export const upsertProfile = async (profile: Profile) => {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("profiles").upsert(profile, { onConflict: "id" });
  if (error) throw error;
  return profile;
};

export const insertScore = async (score: Omit<ScoreRow, "id" | "created_at">) => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("scores")
    .insert({
      user_id: score.user_id,
      score: score.score,
      max_combo: score.max_combo,
      duration_ms: score.duration_ms
    })
    .select()
    .single();

  if (error) throw error;
  return data as ScoreRow;
};

export const getLeaderboard = async () => {
  const supabase = createSupabaseServerClient();
  const today = dayjs().startOf("day").toISOString();

  const [daily, allTime] = await Promise.all([
    supabase
      .from("scores")
      .select("*, profiles(*)")
      .gte("created_at", today)
      .order("score", { ascending: false })
      .limit(100),
    supabase
      .from("scores")
      .select("*, profiles(*)")
      .order("score", { ascending: false })
      .limit(100)
  ]);

  if (daily.error) throw daily.error;
  if (allTime.error) throw allTime.error;

  return {
    daily: (daily.data || []).map((row) => ({ ...row, profile: row.profiles })),
    allTime: (allTime.data || []).map((row) => ({ ...row, profile: row.profiles }))
  } satisfies { daily: ScoreRow[]; allTime: ScoreRow[] };
};
