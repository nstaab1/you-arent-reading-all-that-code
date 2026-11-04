import { useSyncExternalStore } from 'react';
import { creatureSlug } from './routes';
import { BestiaryScreen } from './screens/bestiary/BestiaryScreen';
import { CreatureScreen } from './screens/creature/CreatureScreen';
import { EncounterBuilderScreen } from './screens/encounter-builder/EncounterBuilderScreen';

const SCREENS = [
  { hash: '#/', label: 'Bestiary', Screen: BestiaryScreen },
  { hash: '#/encounter', label: 'Encounter builder', Screen: EncounterBuilderScreen },
] as const;

export function App() {
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash);
  const slug = creatureSlug(hash);
  const screen = SCREENS.find((candidate) => candidate.hash === hash) ?? SCREENS[0];
  // A creature page is no screen in the nav, so no nav link is current on it.
  const currentHash = slug === null ? screen.hash : null;

  return (
    <>
      <nav className="screens" aria-label="Screens">
        {SCREENS.map(({ hash: screenHash, label }) => (
          <a
            key={screenHash}
            href={screenHash}
            aria-current={screenHash === currentHash ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      {slug === null ? <screen.Screen /> : <CreatureScreen slug={slug} />}
    </>
  );
}

function subscribeToHash(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}
