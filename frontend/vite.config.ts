import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // Use a simpler base path for now
  plugins: [react()],
  build: {
    minify: true,  // Keep minify on for production
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
