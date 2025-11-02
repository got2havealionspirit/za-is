import Phaser from "phaser";
import { createHud } from "./ui";

type Ingredient = Phaser.Physics.Arcade.Image & { flavor?: string };

export default class SwipeChefScene extends Phaser.Scene {
  private ingredients?: Phaser.Physics.Arcade.Group;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private combo = 0;
  private maxCombo = 0;
  private startTime = 0;
  private hud?: ReturnType<typeof createHud>;

  constructor() {
    super("SwipeChefScene");
  }

  preload() {
    this.load.image("ingredient", "https://dummyimage.com/128x128/b87333/ffffff&text=+🍅+");
  }

  create() {
    this.ingredients = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image });
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.startTime = this.time.now;
    this.hud = createHud(this);

    this.time.addEvent({
      delay: 800,
      loop: true,
      callback: () => this.spawnIngredient()
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;
      this.sliceAt(pointer.worldX, pointer.worldY);
    });
  }

  update() {
    const pointer = this.input.activePointer;
    if (pointer.isDown) {
      this.sliceAt(pointer.worldX, pointer.worldY);
    }

    this.ingredients?.children.each((child) => {
      const ingredient = child as Ingredient;
      if (ingredient.y > this.scale.height) {
        ingredient.destroy();
        this.combo = 0;
        this.hud?.updateCombo(this.combo);
      }
    });

    if (this.time.now - this.startTime > 60000) {
      this.endMatch();
    }
  }

  private spawnIngredient() {
    const x = Phaser.Math.Between(64, this.scale.width - 64);
    const ingredient = this.ingredients?.get(x, -50, "ingredient") as Ingredient;
    if (!ingredient) return;
    ingredient.setActive(true);
    ingredient.setVisible(true);
    ingredient.setScale(0.6);
    ingredient.setVelocityY(Phaser.Math.Between(180, 260));
    ingredient.setAngularVelocity(Phaser.Math.Between(-200, 200));
  }

  private sliceAt(x: number, y: number) {
    const ingredient = this.physics.closest(this.ingredients?.children.entries ?? [], { x, y }) as Ingredient | undefined;
    if (!ingredient || !ingredient.active) return;
    const distance = Phaser.Math.Distance.Between(x, y, ingredient.x, ingredient.y);
    if (distance > 80) return;

    ingredient.destroy();
    this.combo += 1;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.score += 10 + this.combo * 5;
    this.hud?.updateScore(this.score);
    this.hud?.updateCombo(this.combo);
  }

  private endMatch() {
    const duration = this.time.now - this.startTime;
    window.parent?.postMessage(
      {
        type: "matchComplete",
        payload: {
          score: this.score,
          maxCombo: this.maxCombo,
          durationMs: Math.round(duration)
        }
      },
      "*"
    );
    this.scene.restart();
  }
}
