import { fileURLToPath } from 'node:url';
import { MatchersV3, PactV4 } from '@pact-foundation/pact';
import { describe, expect, it } from 'vitest';
import { creatureOfTheDay } from './creature-of-the-day';

const { eachLike, like } = MatchersV3;

const pact = new PactV4({
  consumer: 'CreatureOfTheDayBot',
  provider: 'CreatureFeed',
  dir: fileURLToPath(new URL('../../../pacts', import.meta.url)),
});

describe('the creature feed, as the Creature of the Day bot reads it', () => {
  it("gives each creature's name, talk title and Challenge Rating", async () => {
    await pact
      .addInteraction()
      .uponReceiving('a request for the creature feed')
      .withRequest('GET', '/api/creatures', (request) => {
        request.headers({ Accept: 'application/json' });
      })
      .willRespondWith(200, (response) => {
        response.jsonBody({
          creatures: eachLike({
            name: like('The Hallucinating Oracle'),
            talkTitle: like("Ask Me Anything, I'll Answer Anyway"),
            challengeRating: like('3'),
          }),
        });
      })
      .executeTest(async (mockServer) => {
        const post = await creatureOfTheDay({ feedUrl: mockServer.url, day: '2026-11-03' });

        expect(post).toContain('The Hallucinating Oracle');
        expect(post).toContain('Challenge Rating 3 ·');
      });
  });
});
