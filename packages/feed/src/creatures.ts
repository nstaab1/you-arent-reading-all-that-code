import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { parse } from 'yaml';

export interface CreatureRecord {
  slug: string;
  name: string;
  talk: string;
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
    throw new Error(`${file}: frontmatter needs name, talk and a buzzwords list`);
  }
  return {
    slug: basename(file, '.md'),
    name: frontmatter.name,
    talk: frontmatter.talk,
    buzzwords: frontmatter.buzzwords,
    lore: text.slice(match[0].length).replace(/^\n+/, ''),
  };
}

function isFrontmatter(value: unknown): value is Omit<CreatureRecord, 'slug' | 'lore'> {
  if (typeof value !== 'object' || value === null) return false;
  const { name, talk, buzzwords } = value as Record<string, unknown>;
  return (
    typeof name === 'string' &&
    typeof talk === 'string' &&
    Array.isArray(buzzwords) &&
    buzzwords.every((buzzword) => typeof buzzword === 'string')
  );
}
