import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Check if the environment is development or production
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: isProduction, // Enable minification in production
    rollupOptions: {
      external: ['@nivo/core'], // Externalize large libs only if necessary
    },
  },
  server: {
    host: '0.0.0.0', // Expose the dev server on all network interfaces
    port: 5173,
    strictPort: true, // Ensure it fails if the port is in use
    hmr: {
      host: isProduction ? '137.184.223.198' : 'localhost', // Use localhost for local dev HMR
      port: 5173, // Ensure HMR runs on the correct port
    },
  },
});
