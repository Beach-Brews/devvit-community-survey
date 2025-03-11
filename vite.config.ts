/**!
 * Based on https://github.com/mwood23/devvit-webview-react/blob/main/vite.config.ts
 */
import * as path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    root: path.join(__dirname, "webviewsrc"),
    build: {
        outDir: path.join(__dirname, "webroot"),
        emptyOutDir: true,
        copyPublicDir: true,
        sourcemap: true
    },
    server: {
        port: 5100
    }
});