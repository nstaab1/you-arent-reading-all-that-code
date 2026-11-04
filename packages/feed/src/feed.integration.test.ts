import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createFeedApp } from './app';

const creatureFile = `---
name: The Vibe Coder
talkTitle: Shipping on Feelings Alone
buzzwords:
  - vibe coding
  - agentic
timeSlot: '11:00'
room: Great Hall
---

It writes a thousand lines an hour.

It reads none of them.
`;

describe('GET /api/creatures', () => {
  let creaturesDirectory: string;

  beforeEach(async () => {
    creaturesDirectory = await mkdtemp(join(tmpdir(), 'bestiary-creatures-'));
    await writeFile(join(creaturesDirectory, 'vibe-coder.md'), creatureFile);
  });

  afterEach(async () => {
    await rm(creaturesDirectory, { recursive: true });
  });

  it('serves each creature file as JSON, with its Markdown lore', async () => {
    const response = await request(createFeedApp({ creaturesDirectory }))
      .get('/api/creatures')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      creatures: [
        {
          slug: 'vibe-coder',
          name: 'The Vibe Coder',
          talkTitle: 'Shipping on Feelings Alone',
          buzzwords: ['vibe coding', 'agentic'],
          timeSlot: '11:00',
          room: 'Great Hall',
          lore: 'It writes a thousand lines an hour.\n\nIt reads none of them.\n',
        },
      ],
    });
  });

  it('refuses a creature whose time slot is not written HH:MM', async () => {
    await writeFile(
      join(creaturesDirectory, 'vibe-coder.md'),
      creatureFile.replace("timeSlot: '11:00'", "timeSlot: '9am'"),
    );

    await request(createFeedApp({ creaturesDirectory })).get('/api/creatures').expect(500);
  });
});
