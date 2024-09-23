import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "./",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/shiki/dist/onig.wasm",
          dest: "dist",
        },
        {
          src: "node_modules/shiki/themes",
          dest: ".",
        },
        {
          src: "node_modules/shiki/languages",
          dest: ".",
        },
        {
          src: "css",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    lib: {
        entry: "./src/main.js",
        name: "trame_markdown",
        formats: ["umd"],
        fileName: "trame-markdown",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    outDir: "../trame_markdown/module/serve",
    assetsDir: ".",
  },
});
