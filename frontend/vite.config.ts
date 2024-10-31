// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load environment variables for different environments
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  build: {
    outDir: 'build',
    minify: true, // Enable minification for production
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Expose the dev server on all network interfaces
    port: 5173,
    strictPort: true,  // Ensure the port doesn't fallback if 5173 is in use
    hmr: !isProduction && {
      host: 'localhost',  // Use localhost for local development
      port: 5173,  // Ensure HMR runs on the correct port
    },
  },
});
