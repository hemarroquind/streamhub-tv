import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // Allow access from Fire TV and other devices on the same network
    cors: true,
  },
  build: {
    outDir: 'dist',
    // Single-file build for easy deployment
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Target older browsers for Smart TV compatibility
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
  },
  // Base path — change to './' if serving from subdirectory
  base: './',
});
