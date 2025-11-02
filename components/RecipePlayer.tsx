"use client";

import { useRef, useState } from "react";
import RecipeOverlay from "./RecipeOverlay";
import type { Video } from "@/lib/db";

export default function RecipePlayer({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl border border-copper-500/30 bg-black/60">
        <video
          ref={videoRef}
          src={video.signed_url || `/samples/${video.id}.mp4`}
          className="h-full w-full object-cover"
          controls
          muted
          playsInline
          onPlay={() => setShowOverlay(true)}
        />
      </div>
      {showOverlay && videoRef && (
        <div className="rounded-3xl border border-copper-500/30 bg-black/50 p-6">
          <RecipeOverlay recipe={video.recipe} videoRef={videoRef} onClose={() => setShowOverlay(false)} />
        </div>
      )}
    </div>
  );
}
