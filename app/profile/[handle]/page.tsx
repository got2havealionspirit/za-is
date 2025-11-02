import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileByHandle } from "@/lib/db";

interface Props {
  params: { handle: string };
}

export default async function ProfilePage({ params }: Props) {
  const result = await getProfileByHandle(params.handle === "me" ? "demo-chef" : params.handle);
  if (!result) return notFound();
  const { profile, videos } = result;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
      <header className="flex flex-col gap-4 rounded-3xl border border-copper-500/30 bg-black/50 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-copper-500">Profile</p>
          <h1 className="text-4xl font-display">@{profile.handle}</h1>
          <p className="mt-2 max-w-xl text-sm text-foreground/70">{profile.bio ?? "Chef extraordinaire."}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-display">{videos.length}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">Videos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display">{videos.reduce((acc, video) => acc + (video.likes_count ?? 0), 0)}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">Likes</p>
          </div>
        </div>
      </header>
      <section>
        <h2 className="text-lg font-display text-copper-500">Videos</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/recipe/${video.id}`}
              className="group relative aspect-[9/16] overflow-hidden rounded-3xl border border-copper-500/20 bg-black/40"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-display">{video.title}</h3>
                <p className="text-xs text-foreground/60">{video.tags.join(", ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
