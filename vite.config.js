import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  // GitHub Pages용 경로
  base: '/',

  plugins: [vue()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@composables': path.resolve(__dirname, './src/composables')
    }
  },

  css: {
    // 전역 import 제거 (사스 오류 방지)
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true, // CSS 캐시 꼬임 방지
    rollupOptions: {
      output: {
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },

  server: {
    host: true,
    port: 5173
  }
});
