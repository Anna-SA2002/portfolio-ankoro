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

async function loadWorkDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  // slugがない場合
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

    // reference先の取得
    const referenceLink = work.reference
      ? `<a href="${escapeHTML(work.reference)}" target="_blank" rel="noopener noreferrer">reference</a>`
      : "";

    workDetail.innerHTML = `
      <div class="work-detail-image-container">
        <img
          class="work-detail-image"
          src="${escapeHTML(work.image)}"
          alt="${escapeHTML(work.title)}の画像"
        />
      </div>

      <div class="work-detail-text">
        <p class="work-detail-year">${escapeHTML(work.year)}</p>
        <h1 class="work-detail-title">${escapeHTML(work.title)}</h1>
        <p class="work-detail-sub-title">${escapeHTML(work["sub-title"])}</p>
        <p class="work-detail-skill">${escapeHTML(work.skill)}</p>

        <p class="work-detail-description">
          ${escapeHTML(work.description || "この作品の説明文は準備中です。")}
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
