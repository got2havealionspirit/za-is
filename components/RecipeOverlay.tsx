"use client";

import { MutableRefObject, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { z } from "zod";
import { recipeSchema } from "@/lib/validators";

type Recipe = z.infer<typeof recipeSchema>;

interface Props {
  recipe: Recipe;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  onClose: () => void;
}

export default function RecipeOverlay({ recipe, videoRef, onClose }: Props) {
  const [currentTime, setCurrentTime] = useState(0);

  const steps = useMemo(() => recipe.steps ?? [], [recipe.steps]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const handler = () => setCurrentTime(node.currentTime);
    node.addEventListener("timeupdate", handler);
    return () => {
      node.removeEventListener("timeupdate", handler);
    };
  }, [videoRef]);

  const activeStepIndex = steps.findIndex((step, index) => {
    const nextStep = steps[index + 1];
    if (!nextStep) {
      return currentTime >= step.t;
    }
    return currentTime >= step.t && currentTime < nextStep.t;
  });

  return (
    <div className="flex h-full flex-col gap-6 p-6 text-foreground">
      <button onClick={onClose} className="self-end rounded-full bg-copper-500/30 p-2 text-copper-500">
        <X className="h-5 w-5" />
      </button>
      <div>
        <h2 className="text-3xl font-display">Ingredients</h2>
        <ul className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          {(recipe.ingredients ?? []).map((ingredient) => (
            <li key={ingredient.name} className="rounded-xl border border-copper-500/30 bg-black/40 p-3">
              <span className="text-copper-500">{ingredient.qty}</span> {ingredient.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-3xl font-display">Steps</h2>
        <ol className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <li
              key={`${step.t}-${index}`}
              className={`rounded-xl border border-copper-500/40 p-4 transition ${index === activeStepIndex ? "bg-copper-500/20 shadow-glow" : "bg-black/40"}`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
                {formatTime(step.t)}
              </p>
              <p className="mt-2 text-sm">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainder}`;
};
