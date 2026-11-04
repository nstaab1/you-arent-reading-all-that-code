import { creatureStats, formatXp } from './creature-stats';
import type { Creature } from './feed';

export function StatBlock({ creature }: { creature: Creature }) {
  const { challengeRating, xp } = creatureStats(creature);

  return (
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
  );
}
