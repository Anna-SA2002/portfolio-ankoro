import{n as e,t}from"./cake-sketch-C-HCrd5b.js";var n=e((()=>{var e=document.querySelector(`#work-detail`),t={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`};function n(e){return String(e??``).replace(/[&<>"']/g,e=>t[e])}function r(e){return`/portfolio-ankoro/${String(e??``).replace(/^\/+/,``)}`}function i(e){return`/portfolio-ankoro/${String(e??``).replace(/^\/+/,``)}`}function a(t){e.innerHTML=`
    <div class="work-detail-error">
      <h1>作品が見つかりませんでした</h1>
      <p>${n(t)}</p>
      <a href="${n(i(`works.html`))}">works一覧へ戻る</a>
    </div>
  `}function o(e){return(Array.isArray(e.galleryImages)?e.galleryImages:[]).map(t=>t?`
        <li class="work-detail-gallery-item">
          <img
            class="work-detail-gallery-image"
            src="${n(r(t))}"
            alt="${n(e.title)}の関連画像"
            loading="lazy"
          />
        </li>
      `:``).join(``)}function s(e){return(Array.isArray(e)?e:[e]).filter(e=>String(e??``).trim()).map(e=>`
        <p class="work-detail-description">
          ${n(e)}
        </p>
      `).join(``)||`
      <p class="work-detail-description">
        準備中.......
      </p>
    `}async function c(){if(!e){console.error(`#work-detail が見つかりません。HTML側のidを確認してください。`);return}let t=new URLSearchParams(window.location.search).get(`slug`);if(!t){a(`URLが指定されていません。`);return}try{let i=await fetch(`/portfolio-ankoro/data/works.json`);if(!i.ok)throw Error(`works.json の読み込みに失敗しました`);let c=(await i.json()).find(e=>e.slug===t);if(!c){a(`slug「${t}」に一致する作品がありません。`);return}document.title=`sato anna | ${c.title}`;let l=c.reference?`<a class="btn btn-outline" href="${n(c.reference)}" target="_blank" rel="noopener noreferrer">related page</a>`:``,u=o(c),d=u?`
        <ul
          class="work-detail-gallery"
          aria-label="${n(c.title)}の関連画像"
        >
          ${u}
        </ul>
      `:``;e.innerHTML=`
      <div class="work-detail-image-container">
        <img
          class="work-detail-image"
          src="${n(r(c.image))}"
          alt="${n(c.title)}のメイン画像"
        />

        ${d}
      </div>

      <div class="work-detail-text">
        <p class="work-detail-year">${n(c.year)}</p>
        <h2 class="work-detail-title">${n(c.title)}</h2>
        <p class="work-detail-sub-title">${n(c[`sub-title`])}</p>

        ${s(c.description)}

        <p class="work-detail-skill">skills & tools : ${n(c.skill)}</p>

        <div class="work-detail-links">
          ${l}
        </div>
      </div>
    `}catch(e){console.error(e),a(`データの読み込み中にエラーが発生しました。`)}}c()}));t(),n();