import { defineConfig } from 'vitest/config';

// The reporter is pinned: Vitest switches to `minimal` when it detects an
// agent, and the stage must show the same output as rehearsal.
export default defineConfig({
  test: {
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['packages/*/src/**/*.test.ts', 'scripts/**/*.test.ts'],
          exclude: ['**/*.integration.test.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          include: ['packages/*/src/**/*.integration.test.ts'],
        },
      },
    ],
  },
});
