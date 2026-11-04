import { existsSync, statSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { netCommands } from './bands';
import type { Layer } from './run-layers';

const root = fileURLToPath(new URL('../..', import.meta.url));
const commands = netCommands(root);

function layer(name: string): Layer {
  const found = commands.band3.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`band 3 has no ${name} layer`);
  return found;
}

function program(step: string[] | undefined): string {
  return step?.[0]?.split('/').at(-1) ?? '';
}

describe('the net commands', () => {
  it('runs every layer of bands 1, 2 and 3 in verify, in band order', () => {
    expect(commands.verify.map(({ band, name }) => `${band} ${name}`)).toEqual([
      '1 Formatting',
      '1 Linting',
      '1 Type checking',
      '2 Unit',
      '2 Integration',
      '2 Contract',
      '2 End-to-end',
      '3 Static analysis',
      '3 Dependency scanning',
    ]);
  });

  it('runs static analysis, then dependency scanning, in band 3', () => {
    expect(commands.band3.map(({ band, name }) => `${band} ${name}`)).toEqual([
      '3 Static analysis',
      '3 Dependency scanning',
    ]);
  });

  it('runs Semgrep only on rule folders committed to the repo, offline', () => {
    const steps = layer('Static analysis').steps;
    expect(steps.map(program)).toEqual(['semgrep']);
    const args = steps[0] ?? [];

    const configs = args.flatMap((arg, index) => (arg === '--config' ? [args[index + 1]] : []));
    expect(configs.length).toBeGreaterThan(0);
    for (const config of configs) {
      expect(config).toBeDefined();
      expect(isAbsolute(config ?? '')).toBe(false);
      expect(statSync(join(root, config ?? '')).isDirectory()).toBe(true);
    }
    expect(args).toContain('--error');
    expect(args).toContain('--disable-version-check');
  });

  it('runs OSV-Scanner offline on the lockfile, against the database in its fixed folder', () => {
    const scanning = layer('Dependency scanning');
    const args = scanning.steps[0] ?? [];

    expect(scanning.steps.map(program)).toEqual(['osv-scanner']);
    expect(args).toContain('--offline');
    expect(args[args.indexOf('--lockfile') + 1]).toBe('package-lock.json');
    expect(existsSync(join(root, 'package-lock.json'))).toBe(true);
    expect(scanning.env?.OSV_SCANNER_LOCAL_DB_CACHE_DIRECTORY).toBe(join(root, '.osv-database'));
  });
});
