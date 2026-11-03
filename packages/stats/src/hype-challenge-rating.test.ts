import { describe, expect, it } from 'vitest';
import { hypeChallengeRating } from './index';

// Expected values are worked from the Bestiary's invented hype table.
describe('hypeChallengeRating', () => {
  it.each([
    [0, '0'],
    [1, '1/8'],
    [3, '1/2'],
    [4, '1'],
    [9, '5'],
    [10, '8'],
    [14, '11'],
    [20, '20'],
    [29, '20'],
    [30, '30'],
    [75, '30'],
  ] as const)('rates a talk with %i buzzwords at CR %s', (buzzwordCount, challengeRating) => {
    expect(hypeChallengeRating(buzzwordCount)).toBe(challengeRating);
  });
});
