import type { Creature } from './feed';

/** A creature for tests, with as many placeholder buzzwords as asked for. */
export function testCreature(slug: string, timeSlot: string, buzzwordCount = 1): Creature {
  return {
    slug,
    name: slug,
    talkTitle: `${slug} talk`,
    buzzwords: Array.from({ length: buzzwordCount }, (_, index) => `buzzword ${index + 1}`),
    timeSlot,
    room: 'Great Hall',
    lore: '',
  };
}
