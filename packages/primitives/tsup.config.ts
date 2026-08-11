import { defineConfig } from 'tsup';
import { copyFileSync } from 'node:fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: ['react', 'react-dom', '@ibx34/m3x-tokens'],
  onSuccess: async () => {
    copyFileSync('src/styles.css', 'dist/styles.css');
  },
});
