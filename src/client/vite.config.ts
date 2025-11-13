import { defineConfig, PluginOption } from 'vite';
import { resolve } from 'path';
import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const debugConstant = (mode: string) => {
    return {
        name: 'replace-debug-constant',
        enforce: 'pre',
        transform: (code: string, id: string) => {
            if (mode !== 'debug') return
            if (!id.endsWith('debugUtils.ts'))
                return null;
            return code.replace(`context?.userId === 't2_1a3euo740x'`, 'true');
        }
    } satisfies PluginOption;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [debugConstant(mode), react(), tailwind()],
        build: {
            outDir: '../../dist/client',
            sourcemap: true,
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'index.html'),
                    dashboard: resolve(__dirname, 'dashboard.html'),
                    survey: resolve(__dirname, 'survey.html'),
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
    };
});
