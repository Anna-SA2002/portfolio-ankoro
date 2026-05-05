const worksList = document.querySelector("#works-list");

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

function getWorkHref(work) {
  const url = String(work.url ?? "").trim();

  if (url) {
    return url;
  }

  return `./work.html?slug=${encodeURIComponent(work.slug)}`;
}

async function loadWorks() {
  if (!worksList) {
    console.error(
      "#works-list が見つかりません。HTML側のidを確認してください。",
    );
    return;
  }

  try {
    const response = await fetch("/data/works.json");

    if (!response.ok) {
      throw new Error("works.json の読み込みに失敗しました");
    }

    const works = await response.json();

    worksList.innerHTML = works
      .map((work) => {
        const href = getWorkHref(work);

        return `
         <li>
            <a href="${escapeHTML(href)}">
              <img
                src="${escapeHTML(work.image)}"
                alt="${escapeHTML(work.title)}の画像"
              />
              <div class="works-text">
                <p class="works-name">
                  ${escapeHTML(work.title)}
                </p>
                <p class="works-sub-name">
                  ${escapeHTML(work["sub-title"])}
                </p>
                <p class="works-skill-year">
                  ${escapeHTML(work.skill)} / ${escapeHTML(work.year)}
                </p>
              </div>
            </a>
          </li>
        `;
      })
      .join("");
  } catch (error) {
    console.error(error);

    worksList.innerHTML = `
      <p class="error-message">
        Worksデータを読み込めませんでした。
      </p>
    `;
  }
}

loadWorks();
