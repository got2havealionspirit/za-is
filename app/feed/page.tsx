import { Suspense } from "react";
import { getFeedVideos, getLeaderboard } from "@/lib/db";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";

async function FeedList() {
  const videos = await getFeedVideos();
  return (
    <div className="snap-y snap-mandatory space-y-10 pb-20">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

async function LeaderboardPreview() {
  const leaderboard = await getLeaderboard();
  return (
    <div className="rounded-3xl border border-copper-500/30 bg-black/50 p-6">
      <h2 className="text-xl font-display">SwipeChef Leaders</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <h3 className="text-sm uppercase tracking-[0.3em] text-copper-500">Daily Top 3</h3>
          <ol className="mt-2 space-y-1 text-sm text-foreground/70">
            {leaderboard.daily.slice(0, 3).map((row, index) => (
              <li key={row.id}>
                #{index + 1} {row.profile?.handle ?? row.user_id.slice(0, 4)} — {row.score}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-[0.3em] text-copper-500">All time</h3>
          <ol className="mt-2 space-y-1 text-sm text-foreground/70">
            {leaderboard.allTime.slice(0, 3).map((row, index) => (
              <li key={row.id}>
                #{index + 1} {row.profile?.handle ?? row.user_id.slice(0, 4)} — {row.score}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <Link
        href="/game#leaderboard"
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-copper-500 px-4 py-2 text-sm text-copper-500"
      >
        View Leaderboard
      </Link>
    </div>
  );
}

export default function FeedPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10">
      <Suspense fallback={<div className="h-[80vh] animate-pulse rounded-3xl bg-black/20" />}>
        {/* @ts-expect-error Async Server Component */}
        <FeedList />
      </Suspense>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-black/20" />}>
        {/* @ts-expect-error Async Server Component */}
        <LeaderboardPreview />
      </Suspense>
    </div>
  );
}
