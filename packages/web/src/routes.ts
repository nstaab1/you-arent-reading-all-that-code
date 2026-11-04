const CREATURE_HASH = /^#\/creatures\/([^/]+)$/;

/** The link to a creature's page. */
export function creatureHref(slug: string): string {
  return `#/creatures/${encodeURIComponent(slug)}`;
}

/** The slug of the creature whose page this hash links to, or null for any other screen. */
export function creatureSlug(hash: string): string | null {
  const encoded = CREATURE_HASH.exec(hash)?.[1];
  if (encoded === undefined) return null;
  try {
    return decodeURIComponent(encoded);
  } catch {
    return null;
  }
}
