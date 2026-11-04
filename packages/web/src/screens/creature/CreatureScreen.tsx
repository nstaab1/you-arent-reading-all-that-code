import { useEffect } from 'react';
import Markdown from 'react-markdown';
import { StatBlock } from '../../StatBlock';
import { useCreatureFeed } from '../../useCreatureFeed';

export function CreatureScreen({ slug }: { slug: string }) {
  const feed = useCreatureFeed();
  const creature =
    feed.status === 'loaded' ? feed.creatures.find((candidate) => candidate.slug === slug) : null;

  // A talk card low in the Bestiary would otherwise open its page part-way down.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (feed.status === 'loading') {
    return (
      <main className="creature">
        <p>Summoning creatures…</p>
      </main>
    );
  }
  if (feed.status === 'failed') {
    return (
      <main className="creature">
        <p role="alert">The creature feed is unreachable.</p>
      </main>
    );
  }
  if (!creature) {
    return (
      <main className="creature">
        <h1>No such creature</h1>
        <p>The Bestiary has no creature called &ldquo;{slug}&rdquo;.</p>
      </main>
    );
  }

  return (
    <main className="creature">
      <h1>{creature.name}</h1>
      <p className="talk-title">{creature.talkTitle}</p>
      <p className="talk-room">
        {creature.timeSlot} · {creature.room}
      </p>
      <section aria-label="Stat block">
        <StatBlock creature={creature} />
      </section>
      <section className="lore" aria-labelledby="lore-heading">
        <h2 id="lore-heading">Lore</h2>
        <Markdown>{creature.lore}</Markdown>
      </section>
    </main>
  );
}
