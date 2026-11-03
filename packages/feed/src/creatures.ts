import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { parse } from 'yaml';

export interface CreatureRecord {
  slug: string;
  name: string;
  talkTitle: string;
  buzzwords: string[];
  lore: string;
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/;

export async function readCreatures(creaturesDirectory: string): Promise<CreatureRecord[]> {
  const files = (await readdir(creaturesDirectory)).filter((file) => file.endsWith('.md')).sort();
  return Promise.all(
    files.map(async (file) =>
      parseCreatureFile(file, await readFile(join(creaturesDirectory, file), 'utf8')),
    ),
  );
}

function parseCreatureFile(file: string, text: string): CreatureRecord {
  const match = FRONTMATTER.exec(text);
  if (!match) throw new Error(`${file}: no frontmatter`);
  const frontmatter: unknown = parse(match[1] ?? '');
  if (!isFrontmatter(frontmatter)) {
    throw new Error(`${file}: frontmatter needs name, talkTitle and a buzzwords list`);
  }
  return {
    slug: basename(file, '.md'),
    name: frontmatter.name,
    talkTitle: frontmatter.talkTitle,
    buzzwords: frontmatter.buzzwords,
    lore: text.slice(match[0].length).replace(/^\n+/, ''),
  };
}

function isFrontmatter(value: unknown): value is Omit<CreatureRecord, 'slug' | 'lore'> {
  if (typeof value !== 'object' || value === null) return false;
  const { name, talkTitle, buzzwords } = value as Record<string, unknown>;
  return (
    typeof name === 'string' &&
    typeof talkTitle === 'string' &&
    Array.isArray(buzzwords) &&
    buzzwords.every((buzzword) => typeof buzzword === 'string')
  );
}
