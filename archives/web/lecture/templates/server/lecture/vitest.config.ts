import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    environment: 'node'
  },
  resolve: {
    alias: {
      '@domains/user': resolve(__dirname, 'src/domains/user/user.domain.ts'),
      '@domains/review': resolve(__dirname, 'src/domains/review/review.domain.ts'),
      '@domains/study': resolve(__dirname, 'src/domains/study')
    }
  }
});
