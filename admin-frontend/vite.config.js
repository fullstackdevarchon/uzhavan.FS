import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Dedicated port for admin frontend
    strictPort: true, // Ensure it only uses this port
  },
  build: {
    outDir: 'dist', // default output folder for Vite
  },
  base: './', // ensures relative paths work for Netlify
});
