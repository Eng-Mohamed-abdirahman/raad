import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    // The first run downloads the in-memory MongoDB binary, which can take a while.
    hookTimeout: 120_000,
    // argon2 is slow on purpose, and the login tests run it many times. On a busy
    // machine (CI, or the admin building in parallel) 5 s is not enough.
    testTimeout: 20_000,
    env: {
      JWT_SECRET: 'test-only-secret-that-is-at-least-32-characters-long',
    },
  },
});
