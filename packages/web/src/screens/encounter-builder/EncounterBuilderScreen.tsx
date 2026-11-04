import { creatureStats, formatXp } from '../../creature-stats';
import { timeSlots } from '../../time-slots';
import { useCreatureFeed } from '../../useCreatureFeed';
import { EncounterFooter } from './EncounterFooter';
import { useEncounter } from './useEncounter';

export function EncounterBuilderScreen() {
  const feed = useCreatureFeed();
  const encounter = useEncounter();
  const creatures = feed.status === 'loaded' ? feed.creatures : [];
  const talks = creatures.filter((creature) => encounter.slugs.includes(creature.slug));

  return (
    <main className="encounter-builder">
      <h1>Encounter builder</h1>
      <p>Pick talks from the day&apos;s time slots. The footer adds up the encounter&apos;s XP.</p>
      {feed.status === 'loading' && <p>Summoning creatures…</p>}
      {feed.status === 'failed' && <p role="alert">The creature feed is unreachable.</p>}
      {timeSlots(creatures).map(({ timeSlot, creatures: slotCreatures }) => (
        <section key={timeSlot} className="time-slot" aria-labelledby={`slot-${timeSlot}`}>
          <h2 id={`slot-${timeSlot}`}>{timeSlot}</h2>
          <ul className="encounter-talks">
            {slotCreatures.map((creature) => {
              const inEncounter = encounter.slugs.includes(creature.slug);
              return (
                <li key={creature.slug}>
                  <article className="encounter-talk" aria-labelledby={`${creature.slug}-name`}>
                    <h3 id={`${creature.slug}-name`}>{creature.name}</h3>
                    <p className="talk-title">{creature.talkTitle}</p>
                    <p>
                      {creature.room} · {formatXp(creatureStats(creature).xp)} XP
                    </p>
                    <button type="button" onClick={() => encounter.toggle(creature.slug)}>
                      {inEncounter ? 'Remove from encounter' : 'Add to encounter'}
                    </button>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <EncounterFooter talks={talks} />
    </main>
  );
}
