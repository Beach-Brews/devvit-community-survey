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
                dashboard: resolve(__dirname, 'dashboard.html'),
                survey: resolve(__dirname, 'survey.html'),
                dashDev: resolve(__dirname, 'dash-dev.html'),
                surveyCont: resolve(__dirname, 'survey-container.html')
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
