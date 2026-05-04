const worksList = document.querySelector("#works-list");

async function loadWorks() {
  try {
    const response = await fetch("/data/works.json");

    if (!response.ok) {
      throw new Error("works.json の読み込みに失敗しました");
    }

    // works配列
    const works = await response.json();

    worksList.innerHTML = works
      .map((work) => {
        return `
         <li>
            <a href="./work.html?slug=${encodeURIComponent(work.slug)}">
              <img src="${work.image}" alt="${work.title}の画像" />
              <div class="works-text">
                <p class="works-name">
                  ${work.title}         
                </p>
                <p class="works-sub-name">
                  ${work["sub-title"]} 
                </p>
                <p class="works-skill-year">
                    ${work.skill} / ${work.year}
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
        Worksデータを読み込めませんでした。JSONファイルの場所や文法を確認してください。
      </p>
    `;
  }
}

loadWorks();
