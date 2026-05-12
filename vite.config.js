import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/portfolio-ankoro/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        works: resolve(__dirname, "works.html"),
        work: resolve(__dirname, "work.html"),
        musicPlaylist: resolve(__dirname, "music-playlist.html"),
        about: resolve(__dirname, "about.html"),
        illustration: resolve(__dirname, "illustration.html"),
      },
    },
  },
});
