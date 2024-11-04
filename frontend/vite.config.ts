import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    minify: true, // Enable minification to reduce bundle size in production
    sourcemap: false, // Disable sourcemaps in production to save memory
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Separate vendor code into its own chunk
          }
        },
      },
      cache: false, // Disable cache if it’s consuming memory
    },
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose the dev server on all network interfaces
    port: 5173,
    strictPort: true, // Ensure the port doesn't fallback if 5173 is in use
    https: false, // Disable HTTPS for Vite dev server, let Nginx handle SSL
    hmr: {
      host: '137.184.223.198', // Your public IP
      port: 5173, // Ensure HMR runs on the correct port
      protocol: 'ws', // Use ws instead of wss for non-SSL
    },
  },
})
