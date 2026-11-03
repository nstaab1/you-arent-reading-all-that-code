import { describe, expect, it } from 'vitest';
import { experiencePoints } from './index';

// Expected values are the SRD 5.1 "Experience Points by Challenge Rating" table.
describe('experiencePoints', () => {
  it.each([
    ['0', 10],
    ['1/8', 25],
    ['1/4', 50],
    ['1/2', 100],
    ['1', 200],
    ['2', 450],
    ['5', 1800],
    ['10', 5900],
    ['17', 18000],
    ['20', 25000],
    ['21', 33000],
    ['30', 155000],
  ] as const)('awards CR %s creatures %i XP', (challengeRating, xp) => {
    expect(experiencePoints(challengeRating)).toBe(xp);
  });
});
