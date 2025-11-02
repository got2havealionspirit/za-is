import Phaser from "phaser";

export const createHud = (scene: Phaser.Scene) => {
  const scoreText = scene.add.text(20, 20, "Score: 0", {
    fontFamily: "Inter",
    fontSize: "24px",
    color: "#f5f0e6"
  });

  const comboText = scene.add.text(20, 60, "Combo: 0", {
    fontFamily: "Inter",
    fontSize: "18px",
    color: "#b87333"
  });

  const pauseButton = scene.add
    .text(scene.scale.width - 120, 20, "Pause", {
      fontFamily: "Inter",
      fontSize: "20px",
      color: "#f5f0e6",
      backgroundColor: "rgba(0,0,0,0.4)",
      padding: { left: 10, right: 10, top: 6, bottom: 6 }
    })
    .setInteractive()
    .on("pointerdown", () => {
      if (scene.physics.world.isPaused) {
        scene.physics.world.resume();
        pauseButton.setText("Pause");
      } else {
        scene.physics.world.pause();
        pauseButton.setText("Resume");
      }
    });

  scene.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
    pauseButton.setPosition(gameSize.width - 120, 20);
  });

  scene.input.addPointer(2);

  return {
    updateScore(value: number) {
      scoreText.setText(`Score: ${value}`);
    },
    updateCombo(value: number) {
      comboText.setText(`Combo: ${value}`);
    }
  };
};
