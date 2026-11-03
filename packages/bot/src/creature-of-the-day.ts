import { experiencePoints, type ChallengeRating } from '@bestiary/stats';

/** The fields the bot reads from each creature in the feed. */
export interface FeedCreature {
  name: string;
  talkTitle: string;
  challengeRating: ChallengeRating;
}

interface CreatureFeed {
  creatures: FeedCreature[];
}

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/** Reads the creature feed at `feedUrl` and returns the post the bot would make on `day`. */
export async function creatureOfTheDay(options: { feedUrl: string; day: string }): Promise<string> {
  const response = await fetch(new URL('/api/creatures', options.feedUrl), {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`The feed answered ${response.status}`);
  const feed = (await response.json()) as CreatureFeed;
  return postForDay(feed.creatures, options.day);
}

/** The post the bot would make on `day`, a date written `YYYY-MM-DD`. */
export function postForDay(creatures: readonly FeedCreature[], day: string): string {
  const creature = creatures[daysSinceEpoch(day) % creatures.length];
  if (!creature) throw new Error('The feed has no creatures');

  return [
    `Creature of the Day, ${day}`,
    '',
    creature.name,
    `"${creature.talkTitle}"`,
    `Challenge Rating ${creature.challengeRating} · ${experiencePoints(creature.challengeRating).toLocaleString('en-US')} XP`,
  ].join('\n');
}

function daysSinceEpoch(day: string): number {
  const midnight = /^\d{4}-\d{2}-\d{2}$/.test(day) ? Date.parse(`${day}T00:00:00Z`) : NaN;
  if (Number.isNaN(midnight)) throw new Error(`Not a day: ${day}`);
  return Math.floor(midnight / MILLISECONDS_PER_DAY);
}
