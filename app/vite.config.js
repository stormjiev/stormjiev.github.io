import { defineConfig } from "vite";
import { resolve } from "node:path";

// 纯静态站点。base:'./' 让产物可放在任意子路径/静态托管。
// public/ 下资产按 /assets/... 原样输出，不参与打包哈希，保持与原站一致的引用路径。
// 单页：仅保留精简版首页 index.html。
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
