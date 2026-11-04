import { formatXp } from '../../creature-stats';
import type { Creature } from '../../feed';
import { encounterXpTotal } from './encounter';

export function EncounterFooter({ talks }: { talks: readonly Creature[] }) {
  return (
    <section className="encounter-footer" aria-label="Encounter summary">
      <p>
        {talks.length} {talks.length === 1 ? 'talk' : 'talks'} in the encounter
      </p>
      <p className="encounter-xp">XP total: {formatXp(encounterXpTotal(talks))}</p>
    </section>
  );
}
