import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import { describe, expect, it } from 'vitest';

// The creature page renders lore through react-markdown with its default
// options. These tests pin what those defaults do.
function renderLore(lore: string): string {
  return renderToStaticMarkup(createElement(Markdown, null, lore));
}

describe("react-markdown's defaults, which the creature page renders lore with", () => {
  it('renders Markdown paragraphs and emphasis', () => {
    expect(renderLore('Its lair is a *vector database*.\n\nNobody returns.')).toBe(
      '<p>Its lair is a <em>vector database</em>.</p>\n<p>Nobody returns.</p>',
    );
  });

  it('shows raw HTML in lore as text instead of rendering it', () => {
    const html = renderLore('A <b>bold</b> claim. <img src=x onerror="alert(1)">');

    expect(html).not.toContain('<b>');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;b&gt;bold&lt;/b&gt;');
    expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  });
});
