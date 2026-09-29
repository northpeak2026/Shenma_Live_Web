import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/Shenma_Live_Web/',
  server: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
}));
