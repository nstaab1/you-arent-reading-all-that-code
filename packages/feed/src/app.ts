import express, { type Express } from 'express';
import { readCreatures } from './creatures';

export function createFeedApp(options: { creaturesDirectory: string }): Express {
  const app = express();

  app.get('/api/creatures', async (_request, response) => {
    response.json({ creatures: await readCreatures(options.creaturesDirectory) });
  });

  return app;
}
