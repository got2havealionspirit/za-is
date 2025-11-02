import Phaser from "phaser";
import SwipeChefScene from "./SwipeChefScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#1b120a",
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game-root",
    width: window.innerWidth,
    height: window.innerHeight
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

// eslint-disable-next-line no-new
new Phaser.Game(config);
