import { describe, expect, it } from 'vitest';
import { testCreature } from '../../test-creature';
import { encounterXpTotal } from './encounter';

describe('encounterXpTotal', () => {
  it("adds up the XP of the encounter's creatures", () => {
    // Six buzzwords rate CR 3, worth 700 XP. Three rate CR 1/2, worth 100 XP.
    const talks = [testCreature('oracle', '09:00', 6), testCreature('vibe-coder', '11:00', 3)];

    expect(encounterXpTotal(talks)).toBe(800);
  });

  it('is 0 for an empty encounter', () => {
    expect(encounterXpTotal([])).toBe(0);
  });
});
