"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import SwipeChefScene from "@game/SwipeChefScene";

export default function SwipeChefCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#1b120a",
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: containerRef.current.clientWidth,
        height: 500
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
          debug: false
        }
      },
      scene: [SwipeChefScene]
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-[500px] w-full overflow-hidden rounded-3xl border border-copper-500/30" />;
}
