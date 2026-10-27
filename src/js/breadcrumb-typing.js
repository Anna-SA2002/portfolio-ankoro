// Keep the full breadcrumb available to assistive technology and preserve links.
// Character boxes occupy their final width before the animation starts.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".works-breadcrumb, [data-typewriter]").forEach((breadcrumb) => {
    let characterIndex = 0;
    for (const item of breadcrumb.hasAttribute("data-typewriter") ? [breadcrumb] : breadcrumb.children) {
      const text = item.textContent;
      const accessibleText = document.createElement("span");
      accessibleText.className = "typing-accessible-text";
      accessibleText.textContent = text;
      const visualText = document.createElement("span");
      visualText.setAttribute("aria-hidden", "true");
      for (const character of Array.from(text)) {
        const letter = document.createElement("span");
        letter.className = "typing-character";
        letter.textContent = character;
        letter.style.setProperty("--typing-delay", `${180 + characterIndex * 90}ms`);
        visualText.append(letter);
        characterIndex++;
      }
      item.replaceChildren(accessibleText, visualText);
    }
  });
}
