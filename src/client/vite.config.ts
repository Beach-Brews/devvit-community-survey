import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwind()],
    build: {
        outDir: '../../dist/client',
        sourcemap: true,
        rollupOptions: {
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
                sourcemapFileNames: '[name].js.map',
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
