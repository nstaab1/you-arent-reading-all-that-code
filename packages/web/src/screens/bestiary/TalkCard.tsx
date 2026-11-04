import type { Creature } from '../../feed';
import { creatureHref } from '../../routes';
import { StatBlock } from '../../StatBlock';

export function TalkCard({ creature }: { creature: Creature }) {
  return (
    <article className="talk-card" aria-labelledby={`${creature.slug}-name`}>
      <h3 id={`${creature.slug}-name`}>
        <a href={creatureHref(creature.slug)}>{creature.name}</a>
      </h3>
      <p className="talk-title">{creature.talkTitle}</p>
      <p className="talk-room">{creature.room}</p>
      <StatBlock creature={creature} />
    </article>
  );
}
