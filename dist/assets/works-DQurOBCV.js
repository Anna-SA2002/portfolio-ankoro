import{n as e}from"./cake-sketch-B1y5QAFS.js";var t=e((()=>{var e=document.querySelector(`#works-list`),t={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`};function n(e){return String(e??``).replace(/[&<>"']/g,e=>t[e])}function r(e){return String(e.url??``).trim()||`./work.html?slug=${encodeURIComponent(e.slug)}`}async function i(){if(!e){console.error(`#works-list が見つかりません。HTML側のidを確認してください。`);return}try{let t=await fetch(`/portfolio-ankoro/data/works.json`);if(!t.ok)throw Error(`works.json の読み込みに失敗しました`);e.innerHTML=(await t.json()).map(e=>`
         <li class="works-card">
            <a href="${n(r(e))}">
              <img
                src="${n(e.image)}"
                alt="${n(e.title)}の画像"
              />
              <div class="works-text">
                <p class="works-name">
                  ${n(e.title)}
                </p>
                <p class="works-sub-name">
                  ${n(e[`sub-title`])}
                </p>
                <p class="works-skill-year">
                  ${n(e.skill)} / ${n(e.year)}
                </p>
              </div>
            </a>
          </li>
        `).join(``)}catch(t){console.error(t),e.innerHTML=`
      <p class="error-message">
        Worksデータを読み込めませんでした。
      </p>
    `}}i()}));export{t};