import { notFound } from "next/navigation";
import { getVideoById } from "@/lib/db";
import RecipePlayer from "@/components/RecipePlayer";

interface Props {
  params: { id: string };
}

export default async function RecipePage({ params }: Props) {
  const video = await getVideoById(params.id);
  if (!video) return notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-copper-500">Recipe</p>
        <h1 className="text-4xl font-display">{video.title}</h1>
        <p className="text-sm text-foreground/60">@{video.author?.handle ?? "anon"}</p>
      </header>
      <RecipePlayer video={video} />
    </div>
  );
}
