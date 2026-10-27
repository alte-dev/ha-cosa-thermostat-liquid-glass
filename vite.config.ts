import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'src/cosa-thermostat-card.ts'),
      name: 'CosaThermostatCard',
      fileName: () => 'cosa-thermostat-card.js',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
