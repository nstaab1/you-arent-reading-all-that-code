import { fileURLToPath } from 'node:url';
import { createFeedApp } from './app';

const port = Number(process.env.FEED_PORT ?? 4000);
const creaturesDirectory = fileURLToPath(new URL('../creatures', import.meta.url));

createFeedApp({ creaturesDirectory }).listen(port, () => {
  console.log(`Feed serving creatures on http://localhost:${port}/api/creatures`);
});
