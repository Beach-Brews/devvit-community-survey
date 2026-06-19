import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {mockDevServerPlugin} from "vite-plugin-mock-dev-server";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwind(), mockDevServerPlugin()],
    build: {
        outDir: '../../dist/client',
        sourcemap: true,
        rolldownOptions: {
            input: {
                hub: resolve(__dirname, 'hub.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                post: resolve(__dirname, 'post.html'),
                hubDev: resolve(__dirname, 'hub-dev.html'),
                postDev: resolve(__dirname, 'post-dev.html')
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]',
            },
        },
    },
    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:7575',
                changeOrigin: true
            }
        }
    }
});
