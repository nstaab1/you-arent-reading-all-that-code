import { useSyncExternalStore } from 'react';
import { BestiaryScreen } from './screens/bestiary/BestiaryScreen';
import { EncounterBuilderScreen } from './screens/encounter-builder/EncounterBuilderScreen';

const SCREENS = [
  { hash: '#/', label: 'Bestiary', Screen: BestiaryScreen },
  { hash: '#/encounter', label: 'Encounter builder', Screen: EncounterBuilderScreen },
] as const;

export function App() {
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash);
  const current = SCREENS.find((screen) => screen.hash === hash) ?? SCREENS[0];

  return (
    <>
      <nav className="screens" aria-label="Screens">
        {SCREENS.map(({ hash: screenHash, label }) => (
          <a
            key={screenHash}
            href={screenHash}
            aria-current={screenHash === current.hash ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <current.Screen />
    </>
  );
}

function subscribeToHash(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}
