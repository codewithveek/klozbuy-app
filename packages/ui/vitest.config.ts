import { defineConfig } from 'vitest/config';

/** Components render through react-native-web, so tests see the same DOM the web app ships. */
export default defineConfig({
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.mjs', '.js', '.json'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.tsx'],
  },
});
