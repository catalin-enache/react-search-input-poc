import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/',
  publicDir: '../public',
  base: './',
  server: {
    host: true,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      assets: path.resolve(__dirname, './public/assets'),
      components: path.resolve(__dirname, './src/components'),
      lib: path.resolve(__dirname, './src/lib')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  }
});
