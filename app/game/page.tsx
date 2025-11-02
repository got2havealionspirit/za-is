"use client";

import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import SwipeChefCanvas from "@/components/SwipeChefCanvas";

export default function GamePage() {
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type !== "matchComplete") return;
      const session = await supabaseClient.auth.getSession();
      if (!session.data.session) return;
      await fetch("/api/telemetry/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: event.data.payload.score,
          maxCombo: event.data.payload.maxCombo,
          durationMs: event.data.payload.durationMs,
          userId: session.data.session.user.id
        })
      });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-copper-500">SwipeChef</p>
        <h1 className="text-4xl font-display">Slice the beat, top the board.</h1>
      </header>
      <SwipeChefCanvas />
      <section id="leaderboard" className="rounded-3xl border border-copper-500/30 bg-black/50 p-6">
        <h2 className="text-xl font-display">Leaderboard instructions</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Finish a run to post your score. Visit the Feed page to preview the top 3 daily and all-time players.
        </p>
      </section>
    </div>
  );
}
