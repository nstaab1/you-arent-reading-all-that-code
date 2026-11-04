import { useEffect, useState } from 'react';

// The encounter lives in the browser: a list of creature slugs in local storage.
const STORAGE_KEY = 'bestiary.encounter';

export function useEncounter() {
  const [slugs, setSlugs] = useState<readonly string[]>(readStoredSlugs);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // Storage is blocked, so the encounter lasts only as long as the page.
    }
  }, [slugs]);

  return {
    slugs,
    toggle: (slug: string) =>
      setSlugs((current) =>
        current.includes(slug) ? current.filter((each) => each !== slug) : [...current, slug],
      ),
  };
}

function readStoredSlugs(): readonly string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(stored) ? stored.filter((slug) => typeof slug === 'string') : [];
  } catch {
    return [];
  }
}
