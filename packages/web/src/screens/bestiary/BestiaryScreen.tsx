import { useEffect, useState } from 'react';
import { fetchCreatureFeed, type Creature } from '../../feed';
import { TalkCard } from './TalkCard';

type FeedState =
  { status: 'loading' } | { status: 'loaded'; creatures: Creature[] } | { status: 'failed' };

export function BestiaryScreen() {
  const [feed, setFeed] = useState<FeedState>({ status: 'loading' });

  useEffect(() => {
    fetchCreatureFeed().then(
      ({ creatures }) => setFeed({ status: 'loaded', creatures }),
      () => setFeed({ status: 'failed' }),
    );
  }, []);

  return (
    <main className="bestiary">
      <h1>The Buzzword Bestiary</h1>
      {feed.status === 'loading' && <p>Summoning creatures…</p>}
      {feed.status === 'failed' && <p role="alert">The creature feed is unreachable.</p>}
      {feed.status === 'loaded' && (
        <ul className="talk-cards">
          {feed.creatures.map((creature) => (
            <li key={creature.slug}>
              <TalkCard creature={creature} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
