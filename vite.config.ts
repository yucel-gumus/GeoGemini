import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const production = mode === 'production';
  const bff =
    env.VITE_BFF_URL ||
    process.env.VITE_BFF_URL ||
    (production ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');
  return {
    base: '/GeoGemini/',
    plugins: [react()],
    define: {
      'import.meta.env.VITE_BFF_URL': JSON.stringify(bff),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});