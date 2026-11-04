import { creatureStats } from '../../creature-stats';
import type { Creature } from '../../feed';

/** The encounter's XP total: the sum of its creatures' XP. */
export function encounterXpTotal(talks: readonly Creature[]): number {
  return talks.reduce((total, creature) => total + creatureStats(creature).xp, 0);
}
