export interface Creature {
  slug: string;
  name: string;
  talk: string;
  buzzwords: string[];
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
