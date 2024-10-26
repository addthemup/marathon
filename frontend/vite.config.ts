import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel'; // Importing Babel plugin

// Define Vite configuration
export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '137.184.223.198', // Replace with your public IP if needed
      port: 5173,
    },
  },
});
