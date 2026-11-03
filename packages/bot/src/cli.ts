import { creatureOfTheDay } from './creature-of-the-day';

const feedUrl = `http://localhost:${process.env.FEED_PORT ?? 4000}`;

try {
  console.log(await creatureOfTheDay({ feedUrl, day: today() }));
} catch (error) {
  console.error(
    `No Creature of the Day: ${error instanceof Error ? error.message : String(error)}`,
  );
  console.error(
    `Is the feed running at ${feedUrl}? Start it with \`npm run start -w @bestiary/feed\`.`,
  );
  process.exitCode = 1;
}

function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
