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
          exclude: ['**/*.integration.test.ts', '**/*.consumer.test.ts', '**/*.provider.test.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          include: ['packages/*/src/**/*.integration.test.ts'],
        },
      },
      // The contract layer runs these two projects one after the other: the
      // consumer tests write the pact file the provider verification replays.
      // PACT_DO_NOT_TRACK stops Pact sending usage events over the network.
      {
        test: {
          name: 'contract-consumer',
          environment: 'node',
          include: ['packages/*/src/**/*.consumer.test.ts'],
          env: { PACT_DO_NOT_TRACK: 'true' },
        },
      },
      {
        test: {
          name: 'contract-provider',
          environment: 'node',
          include: ['packages/*/src/**/*.provider.test.ts'],
          env: { PACT_DO_NOT_TRACK: 'true' },
        },
      },
    ],
  },
});
