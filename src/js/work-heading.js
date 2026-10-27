export function setupWorkHeading(heading) {
  if (!heading) return;

  // The original stays in document flow; a decorative copy slides over it.
  // This prevents the page from jumping when the compact header appears.
  const floating = heading.cloneNode(true);
  floating.className = "work-floating-heading";
  floating.setAttribute("aria-hidden", "true");
  document.body.append(floating);

  let frame = null;
  function update() {
    frame = null;
    const bounds = heading.getBoundingClientRect();
    floating.style.left = `${bounds.left}px`;
    floating.style.width = `${bounds.width}px`;
    const top = parseFloat(getComputedStyle(floating).top) || 0;
    floating.classList.toggle("is-visible", bounds.top <= top);
  }

  function scheduleUpdate() {
    if (frame === null) frame = requestAnimationFrame(update);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  new ResizeObserver(scheduleUpdate).observe(heading);
  update();
}
