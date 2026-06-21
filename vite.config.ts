import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const production = mode === 'production';
  return {
    base: '/GeoGemini/',
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL ||
          process.env.VITE_API_URL ||
          (production ? 'https://api.yucelgumus.dev' : 'http://localhost:8000')
      ),
      'import.meta.env.VITE_API_KEY': JSON.stringify(
        env.VITE_API_KEY ||
          process.env.VITE_API_KEY ||
          env.VITE_CLIENT_API_KEY ||
          process.env.VITE_CLIENT_API_KEY ||
          ''
      ),
      'import.meta.env.VITE_CLIENT_API_KEY': JSON.stringify(
        env.VITE_CLIENT_API_KEY ||
          process.env.VITE_CLIENT_API_KEY ||
          env.VITE_API_KEY ||
          process.env.VITE_API_KEY ||
          ''
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});