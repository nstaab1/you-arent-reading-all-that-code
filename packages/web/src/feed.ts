export interface Creature {
  slug: string;
  name: string;
  talkTitle: string;
  buzzwords: string[];
  /** The talk's start time in the day's schedule, written `HH:MM`. */
  timeSlot: string;
  room: string;
  lore: string;
}

export interface CreatureFeed {
  creatures: Creature[];
}

export async function fetchCreatureFeed(): Promise<CreatureFeed> {
  const response = await fetch('/api/creatures');
  if (!response.ok) throw new Error(`The feed answered ${response.status}`);
  return (await response.json()) as CreatureFeed;
}
