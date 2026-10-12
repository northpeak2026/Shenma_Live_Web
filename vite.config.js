import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ command }) => ({
  plugins: [{name:'landing-entry',configureServer(server){server.middlewares.use((req,res,next)=>{if(req.url?.split('?')[0]==='/landingpage')req.url=req.url.replace('/landingpage','/landingpage/index.html');next()})}}],
  build: {rollupOptions:{input:{main:fileURLToPath(new URL('./index.html',import.meta.url)),landing:fileURLToPath(new URL('./landingpage/index.html',import.meta.url))}}},
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
