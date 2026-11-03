import { experiencePoints, hypeChallengeRating } from '@bestiary/stats';
import type { Creature } from '../../feed';

export function TalkCard({ creature }: { creature: Creature }) {
  const challengeRating = hypeChallengeRating(creature.buzzwords.length);

  return (
    <article className="talk-card" aria-labelledby={`${creature.slug}-name`}>
      <h2 id={`${creature.slug}-name`}>{creature.name}</h2>
      <p className="talk-title">{creature.talkTitle}</p>
      <dl className="stat-block">
        <div>
          <dt>Challenge Rating</dt>
          <dd>{challengeRating}</dd>
        </div>
        <div>
          <dt>XP</dt>
          <dd>{experiencePoints(challengeRating).toLocaleString('en-US')}</dd>
        </div>
        <div>
          <dt>Buzzwords</dt>
          <dd>{creature.buzzwords.join(', ')}</dd>
        </div>
      </dl>
    </article>
  );
}
