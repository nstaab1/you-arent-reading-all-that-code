import { creatureStats, formatXp } from '../../creature-stats';
import type { Creature } from '../../feed';

export function TalkCard({ creature }: { creature: Creature }) {
  const { challengeRating, xp } = creatureStats(creature);

  return (
    <article className="talk-card" aria-labelledby={`${creature.slug}-name`}>
      <h3 id={`${creature.slug}-name`}>{creature.name}</h3>
      <p className="talk-title">{creature.talkTitle}</p>
      <p className="talk-room">{creature.room}</p>
      <dl className="stat-block">
        <div>
          <dt>Challenge Rating</dt>
          <dd>{challengeRating}</dd>
        </div>
        <div>
          <dt>XP</dt>
          <dd>{formatXp(xp)}</dd>
        </div>
        <div>
          <dt>Buzzwords</dt>
          <dd>{creature.buzzwords.join(', ')}</dd>
        </div>
      </dl>
    </article>
  );
}
