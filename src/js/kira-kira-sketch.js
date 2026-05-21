const kiraKiraSketch = (p) => {
  const BACKGROUND_COLOR = "#D9E8F5";
  const STROKE_COLOR = "#7D9BB6";

  const PALETTE = [
    "#FFC5D3",
    "#FFD2DC",
    "#FFFFFF",
    "#EBF3FA",
    "#E5D9F2",
    "#C6F1E6",
  ];

  const SPARKLE_COLORS = ["#FFFFFF", "#FFF0F5", "#E2F3FF"];

  let elements = [];

  p.setup = () => {
    const container = document.getElementById("kira-kira");

    const canvasSize = getCanvasSize(container);

    p.createCanvas(canvasSize, canvasSize);
    p.noLoop();
    p.randomSeed(2);
    generateArt();
  };

  p.draw = () => {
    p.background(BACKGROUND_COLOR);

    p.push();

    const s = p.width / 1000;
    p.scale(s);

    for (const el of elements) {
      p.push();

      p.translate(el.x, el.y);

      p.stroke(STROKE_COLOR);
      p.strokeWeight(1.0 / s);
      p.fill(el.color);

      if (el.type === "circle") {
        const c = p.color(el.color);
        c.setAlpha(220);
        p.fill(c);
        p.circle(0, 0, el.size);
      } else if (el.type === "sparkle") {
        p.rotate(p.PI / 4);
        drawSharpStar(el.size);
      } else if (el.type === "small-dot") {
        p.noStroke();
        p.circle(0, 0, el.size);
      }

      p.pop();
    }

    p.pop();
  };

  p.windowResized = () => {
    const container = document.getElementById("kira-kira");

    const canvasSize = getCanvasSize(container);

    p.resizeCanvas(canvasSize, canvasSize);
    p.redraw();
  };

  function getCanvasSize(container) {
    if (!container) {
      return 800;
    }

    return container.clientWidth || 800;
  }

  function drawSharpStar(size) {
    p.beginShape();

    const points = 4;

    for (let i = 0; i < points * 2; i++) {
      const angle = i * (p.PI / points);

      const r =
        i % 4 === 0 ? size * 1.0 : i % 2 === 0 ? size * 1.6 : size * 0.14;

      p.vertex(p.cos(angle) * r, p.sin(angle) * r);
    }

    p.endShape(p.CLOSE);
  }

  function generateArt() {
    elements = [];

    const w = 1000;
    const h = 1000;

    for (let i = 0; i < 400; i++) {
      elements.push({
        type: "small-dot",
        x: p.random(0, w),
        y: p.random(0, h),
        size: p.random(1.0, 5.0),
        color: "#FFFFFF",
      });
    }

    for (let i = 0; i < 100; i++) {
      elements.push({
        type: "circle",
        x: p.random(-50, w + 50),
        y: p.random(-50, h + 50),
        size: p.random(10, 15),
        color: p.random(PALETTE),
      });
    }

    for (let i = 0; i < 30; i++) {
      elements.push({
        type: "sparkle",
        x: p.random(80, 920),
        y: p.random(80, 920),
        size: p.random(20, 70),
        color: p.random(SPARKLE_COLORS),
      });
    }
  }
};

new p5(kiraKiraSketch, "kira-kira");
