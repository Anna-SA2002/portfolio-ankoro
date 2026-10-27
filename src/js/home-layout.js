// Keep a page's random composition stable when its available space changes.
export function createPanelLayout(width, height, seed) {
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const ratios = [276 / 298, 276 / 298, 283 / 298];
  const gap = Math.min(24, width * 0.05, height * 0.05);
  let size = Math.min(292, width * 0.43, height * 0.38);

  // Try free placement first; shrink slightly if the space is too crowded.
  for (let attempt = 0; attempt < 16; attempt++) {
    const placed = [];
    for (const ratio of ratios) {
      const panelHeight = size * ratio;
      let candidate;
      for (let trial = 0; trial < 200; trial++) {
        const x = random() * (width - size);
        const y = random() * (height - panelHeight);
        if (placed.every((other) =>
          x + size + gap <= other.x || other.x + other.width + gap <= x ||
          y + panelHeight + gap <= other.y || other.y + other.height + gap <= y
        )) {
          candidate = { x, y, width: size, height: panelHeight };
          break;
        }
      }
      if (!candidate) break;
      placed.push(candidate);
    }
    if (placed.length === ratios.length) return placed;
    size *= 0.9;
  }

  // Guaranteed fit even for unusually narrow viewports.
  size = Math.min(size, width, (height - gap * 2) / ratios.reduce((a, b) => a + b));
  let top = 0;
  return ratios.map((ratio) => {
    const panel = { x: random() * (width - size), y: top, width: size, height: size * ratio };
    top += panel.height + gap;
    return panel;
  });
}

const gallery = document.querySelector('.home-gallery');
if (gallery) {
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  const panels = [...gallery.querySelectorAll('.home-panel')];
  new ResizeObserver(() => {
    const { width, height } = gallery.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    const layout = createPanelLayout(width, height, seed);
    panels.forEach((panel, index) => {
      const bounds = layout[index];
      Object.assign(panel.style, {
        left: `${bounds.x}px`, top: `${bounds.y}px`,
        width: `${bounds.width}px`, height: `${bounds.height}px`,
      });
    });
    gallery.classList.add('is-randomized');
  }).observe(gallery);
}
