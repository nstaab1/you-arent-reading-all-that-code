import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { Verifier } from '@pact-foundation/pact';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { createFeedApp } from './app';

const creaturesDirectory = fileURLToPath(new URL('../creatures', import.meta.url));
const pactFile = fileURLToPath(
  new URL('../../../pacts/CreatureOfTheDayBot-CreatureFeed.json', import.meta.url),
);

describe('the creature feed', () => {
  let server: Server;

  beforeAll(async () => {
    server = await new Promise<Server>((resolve) => {
      const listening = createFeedApp({ creaturesDirectory }).listen(0, '127.0.0.1', () =>
        resolve(listening),
      );
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it("honours the Creature of the Day bot's pact", async () => {
    const { port } = server.address() as AddressInfo;

    await new Verifier({
      provider: 'CreatureFeed',
      providerBaseUrl: `http://127.0.0.1:${port}`,
      pactUrls: [pactFile],
    }).verifyProvider();
  });
});
