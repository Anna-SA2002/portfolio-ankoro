(() => {
  const sketchContainer = document.querySelector("#cake-sketch");

  if (sketchContainer && window.p5) {
    new window.p5((p) => {
      const cake = 3;
      const sparkleCount = 50;
      const positions = [];
      const palette = {};

      function canvasSize() {
        return Math.min(76, Math.max(52, sketchContainer.clientWidth));
      }

      p.setup = () => {
        const size = canvasSize();
        const canvas = p.createCanvas(size, size, p.WEBGL);

        canvas.parent(sketchContainer);
        canvas.elt.setAttribute("aria-hidden", "true");
        p.frameRate(12);

        palette.c1 = p.random(200, 250);
        palette.c2 = p.random(150, 250);
        palette.c3 = p.random(150, 250);
        palette.c4 = p.random(50, 200);

        for (let i = 0; i < sparkleCount; i += 1) {
          positions[i] = [p.random(size), p.random(size)];
        }
      };

      p.draw = () => {
        const size = p.width;
        const scale = size / 315;

        p.clear();
        p.background(255, 240, 250, 0);

        p.push();
        p.scale(scale);
        p.rotateX(-0.4);
        p.rotateY(0.7);
        p.rotateZ(-0.1);
        p.translate(0, 48, 0);

        p.stroke(150, palette.c2, 240);
        for (let i = 0; i < cake + 2; i += 1) {
          p.translate(0, -20, 0);
          if (i % 2 === 0) {
            p.fill(250, 250, 240);
          } else {
            p.fill(palette.c1, palette.c2, palette.c3);
          }
          p.box(200, 20, 150);
        }

        p.translate(0, -30, 0);
        p.fill(245, palette.c2, palette.c1);
        p.box(40, 40, 40);

        p.translate(0, 8, 0);
        for (let j = 0; j < 3; j += 1) {
          p.translate(-40, 0, -30);
          p.fill(250, 250, 240);
          p.box(30, 25, 30);
          p.rotateY(1.5);
        }

        p.rotateY(2);
        for (let k = 0; k < 3; k += 1) {
          p.translate(60, 0, 20);
          p.fill(250, 250, 240);
          p.box(30, 25, 30);
          p.rotateY(1);
        }

        for (let k = 0; k < 5; k += 1) {
          p.noStroke();
          p.translate(70, 0, 0);
          p.fill(palette.c4, palette.c2, palette.c1);
          p.sphere(20, 5, 5);
          p.rotateY(20);
        }
        p.pop();

        p.push();
        p.translate(-size / 2, -size / 2);
        p.noStroke();
        for (let l = 0; l < positions.length; l += 1) {
          p.fill(150, 250, 250);
          p.circle(positions[l][0], positions[l][1], p.random(1, 5));
        }
        p.pop();
      };

      p.windowResized = () => {
        const size = canvasSize();
        p.resizeCanvas(size, size);

        for (let i = 0; i < positions.length; i += 1) {
          positions[i] = [p.random(size), p.random(size)];
        }
      };
    }, sketchContainer);
  }
})();
