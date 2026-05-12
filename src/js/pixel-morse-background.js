const canvas = document.querySelector("#pixel-morse-background");

if (canvas) {
  const ctx = canvas.getContext("2d");

  const symbols = ["♪", "♫", "＊", "＋", "・", "~"];

  let palette = {
    mainColor: "#1fd2ff",
    accentColor: "#FDFDAF",
  };

  const stepSize = 32;
  const stepDuration = 1000;
  const density = 0.1;
  const fontSize = 24;

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  let particles = [];
  let animationId = null;
  let lastTime = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;

  class Particle {
    constructor(laneY, initialX) {
      this.y = laneY;
      this.x = initialX;
      this.text = getRandomSymbol();

      // true の粒子は accentColor、false の粒子は mainColor を使う
      this.isAccent = Math.random() < 0.2;

      this.elapsed = Math.random() * stepDuration;
      this.isVisible = true;
      this.blinkCounter = 0;
      this.blinkPattern = this.generateBlinkPattern();
    }

    generateBlinkPattern() {
      const patterns = [
        [1, 0, 1, 0],
        [1, 1, 1, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 1, 1],
      ];

      return patterns[Math.floor(Math.random() * patterns.length)];
    }

    update(deltaTime) {
      this.elapsed += deltaTime;

      if (this.elapsed < stepDuration) {
        return;
      }

      this.elapsed = 0;
      this.x -= stepSize;

      this.text = getNextSymbol(this.text);

      this.blinkCounter = (this.blinkCounter + 1) % this.blinkPattern.length;
      this.isVisible = this.blinkPattern[this.blinkCounter] === 1;

      if (this.x < -stepSize) {
        this.x = Math.ceil(canvasWidth / stepSize) * stepSize + stepSize;
      }
    }

    draw() {
      if (!this.isVisible) {
        return;
      }

      ctx.fillStyle = this.isAccent ? palette.accentColor : palette.mainColor;
      ctx.font = `${fontSize}px 'DotGothic16', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.text, this.x, this.y);
    }
  }

  function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function getNextSymbol(currentSymbol) {
    let nextSymbol = getRandomSymbol();

    while (nextSymbol === currentSymbol) {
      nextSymbol = getRandomSymbol();
    }

    return nextSymbol;
  }

  function isHexColor(value) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
  }

  function updatePalette(mainColor, accentColor) {
    if (!isHexColor(mainColor) || !isHexColor(accentColor)) {
      console.warn(
        "背景カラーの指定が正しくありません。#fff または #ffffff の形式で指定してください。",
      );
      return;
    }

    palette = {
      mainColor,
      accentColor,
    };

    drawFrame();
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = Math.floor(canvasWidth * dpr);
    canvas.height = Math.floor(canvasHeight * dpr);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    initParticles();
    drawFrame();
  }

  function initParticles() {
    particles = [];

    const rows = Math.floor(canvasHeight / stepSize);
    const cols = Math.floor(canvasWidth / stepSize) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (Math.random() < density) {
          const y = row * stepSize + stepSize / 2;
          const x = col * stepSize + stepSize / 2;

          particles.push(new Particle(y, x));
        }
      }
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach((particle) => {
      particle.draw();
    });
  }

  function animate(timestamp) {
    if (!lastTime) {
      lastTime = timestamp;
    }

    const deltaTime = Math.min(timestamp - lastTime, stepDuration);
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach((particle) => {
      particle.update(deltaTime);
      particle.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (animationId || reducedMotionQuery.matches) {
      drawFrame();
      return;
    }

    lastTime = 0;
    animationId = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (!animationId) {
      return;
    }

    cancelAnimationFrame(animationId);
    animationId = null;
  }

  window.addEventListener("music-track-change", (event) => {
    const { mainColor, accentColor } = event.detail ?? {};

    updatePalette(mainColor, accentColor);
  });

  window.addEventListener("resize", resizeCanvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
      return;
    }

    startAnimation();
  });

  reducedMotionQuery.addEventListener("change", () => {
    stopAnimation();
    resizeCanvas();
    startAnimation();
  });

  resizeCanvas();

  document.fonts?.ready.then(() => {
    drawFrame();
  });

  startAnimation();
}
