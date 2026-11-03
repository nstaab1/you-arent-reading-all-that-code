import { hypeChallengeRating } from '@bestiary/stats';
import type { CreatureRecord } from './creatures';

export function buildFeed(records: CreatureRecord[]) {
  return {
    creatures: records.map((record) => ({
      ...record,
      challengeRating: hypeChallengeRating(record.buzzwords.length),
    })),
  };
}
