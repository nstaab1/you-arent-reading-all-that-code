import { timeSlots } from '../../time-slots';
import { useCreatureFeed } from '../../useCreatureFeed';
import { TalkCard } from './TalkCard';

export function BestiaryScreen() {
  const feed = useCreatureFeed();

  return (
    <main className="bestiary">
      <h1>The Buzzword Bestiary</h1>
      {feed.status === 'loading' && <p>Summoning creatures…</p>}
      {feed.status === 'failed' && <p role="alert">The creature feed is unreachable.</p>}
      {feed.status === 'loaded' &&
        timeSlots(feed.creatures).map(({ timeSlot, creatures }) => (
          <section key={timeSlot} className="time-slot" aria-labelledby={`slot-${timeSlot}`}>
            <h2 id={`slot-${timeSlot}`}>{timeSlot}</h2>
            <ul className="talk-cards">
              {creatures.map((creature) => (
                <li key={creature.slug}>
                  <TalkCard creature={creature} />
                </li>
              ))}
            </ul>
          </section>
        ))}
    </main>
  );
}
