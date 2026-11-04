import { describe, expect, it } from 'vitest';
import { creatureHref, creatureSlug } from './routes';

describe('creature routes', () => {
  it("reads a creature's slug back from the link to its page", () => {
    expect(creatureHref('hallucinating-oracle')).toBe('#/creatures/hallucinating-oracle');
    expect(creatureSlug(creatureHref('hallucinating-oracle'))).toBe('hallucinating-oracle');
  });

  it('finds no creature in the links to other screens', () => {
    for (const hash of ['', '#/', '#/encounter', '#/creatures/', '#/creatures/a/b']) {
      expect(creatureSlug(hash)).toBeNull();
    }
  });

  it('finds no creature in a link it cannot decode', () => {
    expect(creatureSlug('#/creatures/%E0%A4%A')).toBeNull();
  });
});
