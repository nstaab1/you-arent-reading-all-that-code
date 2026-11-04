import { useEffect, useState } from 'react';
import { fetchCreatureFeed, type Creature } from './feed';

export type FeedState =
  { status: 'loading' } | { status: 'loaded'; creatures: Creature[] } | { status: 'failed' };

export function useCreatureFeed(): FeedState {
  const [feed, setFeed] = useState<FeedState>({ status: 'loading' });

  useEffect(() => {
    fetchCreatureFeed().then(
      ({ creatures }) => setFeed({ status: 'loaded', creatures }),
      () => setFeed({ status: 'failed' }),
    );
  }, []);

  return feed;
}
