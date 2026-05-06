const workDetail = document.querySelector("#work-detail");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return escapeMap[char];
  });
}

function showError(message) {
  workDetail.innerHTML = `
    <div class="work-detail-error">
      <h1>作品が見つかりませんでした</h1>
      <p>${escapeHTML(message)}</p>
      <a href="./works.html">works一覧へ戻る</a>
    </div>
  `;
}

function createGalleryImages(work) {
  const galleryImages = Array.isArray(work.galleryImages)
    ? work.galleryImages
    : [];

  return galleryImages
    .map((src, index) => {
      if (!src) {
        return "";
      }

      return `
        <li class="work-detail-gallery-item">
          <img
            class="work-detail-gallery-image"
            src="${escapeHTML(src)}"
            alt="${escapeHTML(work.title)}の関連画像}"
            loading="lazy"
          />
        </li>
      `;
    })
    .join("");
}

async function loadWorkDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    showError("URLが指定されていません。");
    return;
  }

  try {
    const response = await fetch("/data/works.json");

    if (!response.ok) {
      throw new Error("works.json の読み込みに失敗しました");
    }

    const works = await response.json();
    const work = works.find((item) => item.slug === slug);

    if (!work) {
      showError(`slug「${slug}」に一致する作品がありません。`);
      return;
    }

    document.title = `sato anna | ${work.title}`;

    const referenceLink = work.reference
      ? `<a class="btn btn-outline" href="${escapeHTML(work.reference)}" target="_blank" rel="noopener noreferrer">related page</a>`
      : "";

    const galleryImagesHTML = createGalleryImages(work);

    const galleryHTML = galleryImagesHTML
      ? `
        <ul
          class="work-detail-gallery"
          aria-label="${escapeHTML(work.title)}の関連画像"
        >
          ${galleryImagesHTML}
        </ul>
      `
      : "";

    workDetail.innerHTML = `
      <div class="work-detail-image-container">
        <img
          class="work-detail-image"
          src="${escapeHTML(work.image)}"
          alt="${escapeHTML(work.title)}のメイン画像"
        />

        ${galleryHTML}
      </div>

      <div class="work-detail-text">
        <p class="work-detail-year">${escapeHTML(work.year)}</p>
        <h2 class="work-detail-title">${escapeHTML(work.title)}</h2>
        <p class="work-detail-sub-title">${escapeHTML(work["sub-title"])}</p>
        <p class="work-detail-skill">${escapeHTML(work.skill)}</p>

        <p class="work-detail-description">
          ${escapeHTML(work.description || "準備中.......")}
        </p>

        <div class="work-detail-links">
          ${referenceLink}
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    showError("データの読み込み中にエラーが発生しました。");
  }
}

loadWorkDetail();
