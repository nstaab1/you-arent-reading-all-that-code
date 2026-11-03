import { describe, expect, it } from 'vitest';
import { postForDay, type FeedCreature } from './creature-of-the-day';

const oracle: FeedCreature = {
  name: 'The Hallucinating Oracle',
  talkTitle: "Ask Me Anything, I'll Answer Anyway",
  challengeRating: '3',
};
const vibeCoder: FeedCreature = {
  name: 'The Vibe Coder',
  talkTitle: 'Shipping on Feelings Alone',
  challengeRating: '1/2',
};
const promptGoblin: FeedCreature = {
  name: 'The Prompt Goblin',
  talkTitle: 'Just One More Prompt',
  challengeRating: '0',
};

describe('postForDay', () => {
  it("prints the creature's post with the Challenge Rating the feed gave it", () => {
    expect(postForDay([vibeCoder], '2026-11-03')).toBe(
      [
        'Creature of the Day, 2026-11-03',
        '',
        'The Vibe Coder',
        '"Shipping on Feelings Alone"',
        'Challenge Rating 1/2 · 100 XP',
      ].join('\n'),
    );
  });

  it('moves to the next creature in the feed each day, and wraps round', () => {
    const creatures = [oracle, vibeCoder, promptGoblin];
    const namesOn = (days: string[]) =>
      days.map((day) => postForDay(creatures, day).split('\n')[2]);

    expect(namesOn(['2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06'])).toEqual([
      'The Hallucinating Oracle',
      'The Vibe Coder',
      'The Prompt Goblin',
      'The Hallucinating Oracle',
    ]);
  });

  it('refuses a day not written YYYY-MM-DD', () => {
    expect(() => postForDay([oracle], '3 November')).toThrow('Not a day: 3 November');
  });

  it('refuses a feed with no creatures', () => {
    expect(() => postForDay([], '2026-11-03')).toThrow('The feed has no creatures');
  });
});
