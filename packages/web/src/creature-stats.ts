import { experiencePoints, hypeChallengeRating, type ChallengeRating } from '@bestiary/stats';
import type { Creature } from './feed';

export function creatureStats(creature: Creature): {
  challengeRating: ChallengeRating;
  xp: number;
} {
  const challengeRating = hypeChallengeRating(creature.buzzwords.length);
  return { challengeRating, xp: experiencePoints(challengeRating) };
}

export function formatXp(xp: number): string {
  return xp.toLocaleString('en-US');
}
