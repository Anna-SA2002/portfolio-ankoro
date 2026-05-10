(() => {
  const CONTAINER_ID = "cat-background";

  let pointerX = 0.5;
  let pointerY = 0.5;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX / window.innerWidth;
      pointerY = event.clientY / window.innerHeight;
    },
    { passive: true },
  );

  const sketch = (p) => {
    let palette = {};

    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    p.setup = () => {
      const container = document.getElementById(CONTAINER_ID);

      if (!container) {
        console.error(`#${CONTAINER_ID} が見つかりません。`);
        return;
      }

      p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL).parent(
        container,
      );

      p.pixelDensity(Math.min(window.devicePixelRatio, 2));

      palette = createPalette();
    };

    p.draw = () => {
      const objectSize = Math.min(p.width, p.height) * 0.75;
      const scale = objectSize / 315;

      p.clear();

      p.push();
      p.scale(scale);

      targetRotX = p.map(pointerY, 0, 1, 0.2, -0.9);
      targetRotY = p.map(pointerX, 0, 1, -0.6, 0.6);

      rotX = p.lerp(rotX, targetRotX, 0.1);
      rotY = p.lerp(rotY, targetRotY, 0.1);

      p.rotateX(rotX);
      p.rotateY(rotY);
      p.rotateZ(-0.02);

      drawCatFace();

      p.pop();
    };

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    function createPalette() {
      return {
        c1: p.random(200, 250),
        c2: p.random(200, 250),
        c3: p.random(200, 250),
      };
    }

    function drawCatFace() {
      p.stroke(150, palette.c2, 240);
      p.strokeWeight(1.8);

      drawFaceBase();
      drawEars();
      drawMouthAndNose();
      drawWhiskers();
    }

    function drawFaceBase() {
      p.push();
      p.fill(palette.c1, palette.c2, palette.c3);
      p.box(150, 95, 110);
      p.pop();
    }

    function drawEars() {
      p.push();
      p.translate(0, -47.5, 0);

      [-1, 1].forEach((side) => {
        p.push();
        p.translate(35 * side, -10, 0);
        p.rotateZ(p.PI);
        p.rotateZ(0.15 * -side);

        p.fill(palette.c1, palette.c2, palette.c3);
        p.cone(38, 55, 4);

        p.pop();
      });

      p.pop();
    }

    function drawMouthAndNose() {
      p.push();
      p.translate(0, 18, 52);
      p.noStroke();

      [-1, 1].forEach((side) => {
        p.push();
        p.translate(22 * side, 0, 0);
        p.fill(255, 255, 252);
        p.sphere(25, 12, 12);
        p.pop();
      });

      p.translate(0, -8, 12);
      p.fill(245, palette.c2, palette.c1);
      p.box(10, 6, 6);

      p.pop();
    }

    function drawWhiskers() {
      p.push();
      p.translate(0, 20, 50);
      p.stroke(150, palette.c2, 240);
      p.strokeWeight(1);
      p.noFill();

      [-1, 1].forEach((side) => {
        for (let i = 0; i < 2; i++) {
          p.push();
          p.translate(45 * side, i * 8, 0);
          p.rotateZ(0.2 * side + i * 0.1 * side);
          p.box(40, 1, 1);
          p.pop();
        }
      });

      p.pop();
    }
  };

  new p5(sketch);
})();
