import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Mesmos aliases do tsconfig.json
const src = (dir: string) => path.resolve(__dirname, 'src', dir);

export default defineConfig({
  resolve: {
    alias: {
      '@domain': src('domain'),
      '@application': src('application'),
      '@infrastructure': src('infrastructure'),
      '@main': src('main'),
    },
  },
  test: {
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/application/**', 'src/domain/**'],
      reporter: ['text', 'html'],
    },
  },
});
