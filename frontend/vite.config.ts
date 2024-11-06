import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProduction ? '/marathon/' : '/',  // Set the base URL for production
  plugins: [react()],
  build: {
    minify: isProduction,
    rollupOptions: {
      external: ['@nivo/core'],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: isProduction ? '137.184.223.198' : 'localhost',
      port: 5173,
    },
  },
});
