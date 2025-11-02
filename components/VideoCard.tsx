"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Heart, MessageCircle, Bookmark, Share2, ChefHat } from "lucide-react";
import RecipeOverlay from "./RecipeOverlay";
import { cn } from "@/lib/utils";
import type { Video } from "@/lib/db";
import { supabaseClient } from "@/lib/supabaseClient";
import { useSavedStore } from "@/lib/store";

interface Props {
  video: Video & { author?: { handle: string; avatar_url: string | null } };
}

const observerOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px",
  threshold: 0.75
};

export default function VideoCard({ video }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showRecipe, setShowRecipe] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const toggleSaved = useSavedStore((state) => state.toggle);
  const isSaved = useSavedStore((state) => state.isSaved(video.id));

  const videoSrc = useMemo(() => {
    if (video.signed_url) return video.signed_url;
    if (video.storage_path?.startsWith("http")) return video.storage_path;
    const path = video.storage_path || "public/samples/sample-one.mp4";
    return path.startsWith("/") ? path : `/${path}`;
  }, [video.signed_url, video.storage_path]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          void node.play();
        } else {
          node.pause();
        }
      });
    }, observerOptions);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  const likeVideo = async () => {
    try {
      const session = await supabaseClient.auth.getSession();
      if (!session.data.session) return;
      setIsLiked(true);
      await supabaseClient.from("likes").upsert({
        user_id: session.data.session.user.id,
        video_id: video.id
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleRecipe = () => setShowRecipe((prev) => !prev);

  const copyIngredients = () => {
    if (!navigator?.clipboard) return;
    const text = video.recipe?.ingredients?.map((i) => `${i.qty} ${i.name}`).join("\n") ?? "";
    void navigator.clipboard.writeText(text);
  };

  const shareVideo = () => {
    const url = `${window.location.origin}/recipe/${video.id}`;
    if (navigator.share) {
      void navigator.share({ title: video.title, url });
    } else {
      void navigator.clipboard?.writeText(url);
    }
  };

  return (
    <article className="relative flex h-[90vh] w-full snap-center flex-col overflow-hidden rounded-3xl border border-copper-500/40 bg-black/50 shadow-glow">
      <video
        ref={videoRef}
        src={videoSrc}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        onDoubleClick={likeVideo}
        onContextMenu={(event) => {
          event.preventDefault();
          toggleRecipe();
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-display">{video.title}</h3>
          <p className="text-sm text-foreground/60">@{video.author?.handle ?? "anon"}</p>
          <button
            onClick={copyIngredients}
            className="rounded-full bg-copper-500/30 px-4 py-1 text-xs uppercase tracking-[0.2em]"
          >
            Copy ingredients
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={likeVideo}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-black/40 transition",
              isLiked ? "text-copper-500" : "text-foreground"
            )}
          >
            <Heart className="h-6 w-6" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-foreground">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button
            onClick={() => toggleSaved(video.id)}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-black/40 transition",
              isSaved ? "text-copper-500" : "text-foreground"
            )}
          >
            <Bookmark className="h-6 w-6" />
          </button>
          <button onClick={shareVideo} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-foreground">
            <Share2 className="h-6 w-6" />
          </button>
          <button
            onClick={toggleRecipe}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-copper-500 text-background shadow-glow"
          >
            <ChefHat className="h-6 w-6" />
          </button>
        </div>
      </div>
      {showRecipe && video.recipe && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur">
          <RecipeOverlay videoRef={videoRef} recipe={video.recipe} onClose={toggleRecipe} />
        </div>
      )}
    </article>
  );
}
