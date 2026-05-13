import{n as e,t}from"./cake-sketch-CgRR3JQ7.js";var n=e((()=>{var e=document.querySelector(`#pixel-morse-background`);if(e){let t=e.getContext(`2d`),n=[`♪`,`♫`,`＊`,`＋`,`・`,`~`],r={mainColor:`#1fd2ff`,accentColor:`#FDFDAF`},i=1e3,a=window.matchMedia(`(prefers-reduced-motion: reduce)`),o=[],s=null,c=0,l=0,u=0;class d{constructor(e,t){this.y=e,this.x=t,this.text=f(),this.isAccent=Math.random()<.2,this.elapsed=Math.random()*i,this.isVisible=!0,this.blinkCounter=0,this.blinkPattern=this.generateBlinkPattern()}generateBlinkPattern(){let e=[[1,0,1,0],[1,1,1,0],[1,0,1,1],[1,1,0,0],[1,1,1,1]];return e[Math.floor(Math.random()*e.length)]}update(e){this.elapsed+=e,!(this.elapsed<i)&&(this.elapsed=0,this.x-=32,this.text=p(this.text),this.blinkCounter=(this.blinkCounter+1)%this.blinkPattern.length,this.isVisible=this.blinkPattern[this.blinkCounter]===1,this.x<-32&&(this.x=Math.ceil(l/32)*32+32))}draw(){this.isVisible&&(t.fillStyle=this.isAccent?r.accentColor:r.mainColor,t.font=`24px 'DotGothic16', sans-serif`,t.textAlign=`center`,t.textBaseline=`middle`,t.fillText(this.text,this.x,this.y))}}function f(){return n[Math.floor(Math.random()*n.length)]}function p(e){let t=f();for(;t===e;)t=f();return t}function m(e){return/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(e)}function h(e,t){if(!m(e)||!m(t)){console.warn(`背景カラーの指定が正しくありません。#fff または #ffffff の形式で指定してください。`);return}r={mainColor:e,accentColor:t},v()}function g(){let n=Math.min(window.devicePixelRatio||1,2);l=window.innerWidth,u=window.innerHeight,e.width=Math.floor(l*n),e.height=Math.floor(u*n),e.style.width=`${l}px`,e.style.height=`${u}px`,t.setTransform(n,0,0,n,0,0),_(),v()}function _(){o=[];let e=Math.floor(u/32),t=Math.floor(l/32)+2;for(let n=0;n<e;n++)for(let e=0;e<t;e++)if(Math.random()<.1){let t=n*32+32/2,r=e*32+32/2;o.push(new d(t,r))}}function v(){t.clearRect(0,0,l,u),o.forEach(e=>{e.draw()})}function y(e){c||=e;let n=Math.min(e-c,i);c=e,t.clearRect(0,0,l,u),o.forEach(e=>{e.update(n),e.draw()}),s=requestAnimationFrame(y)}function b(){if(s||a.matches){v();return}c=0,s=requestAnimationFrame(y)}function x(){s&&=(cancelAnimationFrame(s),null)}window.addEventListener(`music-track-change`,e=>{let{mainColor:t,accentColor:n}=e.detail??{};h(t,n)}),window.addEventListener(`resize`,g),document.addEventListener(`visibilitychange`,()=>{if(document.hidden){x();return}b()}),a.addEventListener(`change`,()=>{x(),g(),b()}),g(),document.fonts?.ready.then(()=>{v()}),b()}})),r=e((()=>{var e=document.querySelector(`#playlist-updated`),t=document.querySelector(`#spotify-player`),n=document.querySelector(`#track-rows-container`),r=document.querySelector(`#playlist-image`),i=`/portfolio-ankoro/data/music-playlist.json`,a={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`},o=[],s=``;function c(e){return String(e??``).replace(/[&<>"']/g,e=>a[e])}async function l(){if(!n){console.error(`#track-rows-container が見つかりません。HTML側のidを確認してください。`);return}try{let e=await fetch(i);if(!e.ok)throw Error(`読み込みに失敗しました。`);let t=await e.json();if(!Array.isArray(t.tracks)||t.tracks.length===0)throw Error(`tracks が空です。`);o=t.tracks,s=o[0].spotifyTrackId,u(t.page?.updated),d(),f(),p(o[0]),m(o[0])}catch(e){console.error(e),n.innerHTML=`
      <p class="error-message">
        Playlistを読み込めませんでした。
      </p>
    `}}function u(t){e&&(e.textContent=t?`Update: ${t}`:``)}function d(){n.innerHTML=o.map((e,t)=>`
        <button
          type="button"
          class="music-track-row ${e.spotifyTrackId===s?`is-playing`:``}"
          data-track-id="${c(e.spotifyTrackId)}"
        >
          <span class="music-track-index">
            ${String(t+1).padStart(2,`0`)}
          </span>

          <span class="music-track-info">
            <span class="music-track-name">
              ${c(e.name)}
            </span>

            <span class="music-track-artist">
              ${c(e.artist)}
            </span>
          </span>
        </button>
      `).join(``)}function f(){if(!t)return;let e=h();e&&(t.innerHTML=`
    <iframe
      title="${c(`${e.name} - Spotify embedded player`)}"
      src="https://open.spotify.com/embed/track/${encodeURIComponent(e.spotifyTrackId)}?utm_source=generator&theme=0"
      width="100%"
      height="152"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style="border: 0;"
    ></iframe>
  `)}function p(e){let t=e?.backgroundColors;t&&window.dispatchEvent(new CustomEvent(`music-track-change`,{detail:{mainColor:t.main,accentColor:t.accent}}))}function m(e){if(!r)return;let t=e?.backgroundColors?.main??`#ffffff`;r.style.backgroundColor=t}function h(){return o.find(e=>e.spotifyTrackId===s)}function g(e){if(!e||s===e)return;let t=o.find(t=>t.spotifyTrackId===e);t&&(s=e,d(),f(),p(t),m(t))}n?.addEventListener(`click`,e=>{let t=e.target.closest(`.music-track-row`);t&&g(t.dataset.trackId)}),l()}));t(),n(),r();