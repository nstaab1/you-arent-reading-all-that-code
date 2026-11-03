import express, { type Express } from 'express';
import { readCreatures } from './creatures';
import { buildFeed } from './feed';

export function createFeedApp(options: { creaturesDirectory: string }): Express {
  const app = express();

  app.get('/api/creatures', async (_request, response) => {
    response.json(buildFeed(await readCreatures(options.creaturesDirectory)));
  });

  return app;
}
