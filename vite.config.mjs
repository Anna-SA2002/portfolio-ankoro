import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/portfolio-ankoro/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        works: resolve(projectRoot, "works.html"),
        work: resolve(projectRoot, "work.html"),
        musicPlaylist: resolve(projectRoot, "music-playlist.html"),
        about: resolve(projectRoot, "about.html"),
        illustration: resolve(projectRoot, "illustration.html"),
        coding: resolve(projectRoot, "coding.html"),
      },
    },
  },
});
