const updatedElement = document.querySelector("#playlist-updated");
const playerContainer = document.querySelector("#spotify-player");
const rowsContainer = document.querySelector("#track-rows-container");


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
let hasSelectedTrack = false;

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

// Preserve JSON order: the grid fills rows from left to right.
function renderTrackRows() {
  rowsContainer.replaceChildren(...tracks.map((track, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "music-track-row";
    button.dataset.trackId = track.spotifyTrackId;
    button.setAttribute("aria-pressed", String(track.spotifyTrackId === selectedTrackId));
    button.setAttribute("aria-label", (index + 1) + ". " + track.name + " — " + track.artist);
    button.title = track.name + " — " + track.artist;
    for (const key of ["main", "accent"]) {
      const swatch = document.createElement("span");
      swatch.className = "music-track-color";
      swatch.setAttribute("aria-hidden", "true");
      swatch.style.backgroundColor = track.backgroundColors?.[key] ?? "#ffffff";
      button.append(swatch);
    }
    return button;
  }));
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

function getSelectedTrack() {
  return tracks.find((track) => {
    return track.spotifyTrackId === selectedTrackId;
  });
}

function selectTrack(trackId) {
  if (!trackId || (hasSelectedTrack && selectedTrackId === trackId)) {
    return;
  }

  const selectedTrack = tracks.find((track) => {
    return track.spotifyTrackId === trackId;
  });

  if (!selectedTrack) {
    return;
  }

  selectedTrackId = trackId;
  hasSelectedTrack = true;

  // Preserve keyboard focus while switching tracks.
  rowsContainer.querySelectorAll(".music-track-row").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.trackId === trackId));
  });
  updateSpotifyPlayer();
  updateBackgroundColors(selectedTrack);

}

rowsContainer?.addEventListener("click", (event) => {
  const clickedRow = event.target.closest(".music-track-row");

  if (!clickedRow) {
    return;
  }

  selectTrack(clickedRow.dataset.trackId);
});

loadMusicPlaylist();
