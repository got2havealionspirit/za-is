import Link from "next/link";
import dynamic from "next/dynamic";

const AuthForm = dynamic(() => import("@/components/AuthForm"), { ssr: false });

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm uppercase tracking-[0.5em] text-copper-500">BiteBeat</p>
        <h1 className="text-5xl font-display leading-tight">Where foodies drop beats and recipes drop in.</h1>
        <p className="text-lg text-foreground/70">
          BiteBeat is the steampunk supper club of your dreams: vertical foodie videos, interactive recipe overlays,
          and the SwipeChef mini-game that keeps your knife skills razor sharp.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/feed"
            className="rounded-full bg-copper-500 px-8 py-3 text-lg font-semibold text-background shadow-glow"
          >
            Open App
          </Link>
          <Link href="/game" className="rounded-full border border-copper-500 px-8 py-3 text-lg">
            Play SwipeChef
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {["Curated chefs", "Recipe overlays", "Magic link login", "Supabase powered"].map((item) => (
          <div key={item} className="rounded-2xl border border-copper-500/30 bg-black/40 p-4">
            <p className="text-sm text-foreground/80">{item}</p>
          </div>
        ))}
      </div>
      <AuthForm />
    </div>
  );
}
