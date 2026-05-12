const updatedElement = document.querySelector("#playlist-updated");
const playerContainer = document.querySelector("#spotify-player");
const rowsContainer = document.querySelector("#track-rows-container");
const playlistImage = document.querySelector("#playlist-image");

const DATA_PATH = `${import.meta.env.BASE_URL}data/music-playlist.json`;

const ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

let tracks = [];
let selectedTrackId = "";

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
}

async function loadMusicPlaylist() {
  if (!rowsContainer) {
    console.error(
      "#track-rows-container が見つかりません。HTML側のidを確認してください。",
    );
    return;
  }

  try {
    const response = await fetch(DATA_PATH);

    if (!response.ok) {
      throw new Error("読み込みに失敗しました。");
    }

    const data = await response.json();

    if (!Array.isArray(data.tracks) || data.tracks.length === 0) {
      throw new Error("tracks が空です。");
    }

    tracks = data.tracks;
    selectedTrackId = tracks[0].spotifyTrackId;

    renderUpdatedDate(data.page?.updated);
    renderTrackRows();
    updateSpotifyPlayer();
    updateBackgroundColors(tracks[0]);
    updatePlaylistImageBackground(tracks[0]);
  } catch (error) {
    console.error(error);

    rowsContainer.innerHTML = `
      <p class="error-message">
        Playlistを読み込めませんでした。
      </p>
    `;
  }
}

function renderUpdatedDate(updated) {
  if (!updatedElement) {
    return;
  }

  updatedElement.textContent = updated ? `Update: ${updated}` : "";
}

function renderTrackRows() {
  rowsContainer.innerHTML = tracks
    .map((track, index) => {
      const isPlaying = track.spotifyTrackId === selectedTrackId;

      return `
        <button
          type="button"
          class="music-track-row ${isPlaying ? "is-playing" : ""}"
          data-track-id="${escapeHTML(track.spotifyTrackId)}"
        >
          <span class="music-track-index">
            ${String(index + 1).padStart(2, "0")}
          </span>

          <span class="music-track-info">
            <span class="music-track-name">
              ${escapeHTML(track.name)}
            </span>

            <span class="music-track-artist">
              ${escapeHTML(track.artist)}
            </span>
          </span>
        </button>
      `;
    })
    .join("");
}

function updateSpotifyPlayer() {
  if (!playerContainer) {
    return;
  }

  const selectedTrack = getSelectedTrack();

  if (!selectedTrack) {
    return;
  }

  playerContainer.innerHTML = `
    <iframe
      title="${escapeHTML(`${selectedTrack.name} - Spotify embedded player`)}"
      src="https://open.spotify.com/embed/track/${encodeURIComponent(
        selectedTrack.spotifyTrackId,
      )}?utm_source=generator&theme=0"
      width="100%"
      height="152"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style="border: 0;"
    ></iframe>
  `;
}

function updateBackgroundColors(track) {
  const colors = track?.backgroundColors;

  if (!colors) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("music-track-change", {
      detail: {
        mainColor: colors.main,
        accentColor: colors.accent,
      },
    }),
  );
}

function updatePlaylistImageBackground(track) {
  if (!playlistImage) {
    return;
  }

  const mainColor = track?.backgroundColors?.main ?? "#ffffff";

  playlistImage.style.backgroundColor = mainColor;
}

function getSelectedTrack() {
  return tracks.find((track) => {
    return track.spotifyTrackId === selectedTrackId;
  });
}

function selectTrack(trackId) {
  if (!trackId || selectedTrackId === trackId) {
    return;
  }

  const selectedTrack = tracks.find((track) => {
    return track.spotifyTrackId === trackId;
  });

  if (!selectedTrack) {
    return;
  }

  selectedTrackId = trackId;

  renderTrackRows();
  updateSpotifyPlayer();
  updateBackgroundColors(selectedTrack);
  updatePlaylistImageBackground(selectedTrack);
}

rowsContainer?.addEventListener("click", (event) => {
  const clickedRow = event.target.closest(".music-track-row");

  if (!clickedRow) {
    return;
  }

  selectTrack(clickedRow.dataset.trackId);
});

loadMusicPlaylist();
