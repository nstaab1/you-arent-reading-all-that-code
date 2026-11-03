import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Layer } from './run-layers';

export type NetCommand = 'band1' | 'band2' | 'verify';

export function netCommands(root: string): Record<NetCommand, Layer[]> {
  const bin = (tool: string) => join(root, 'node_modules', '.bin', tool);

  const typeCheckedProjects = [
    '.',
    ...readdirSync(join(root, 'packages'))
      .map((name) => join('packages', name))
      .filter((project) => existsSync(join(root, project, 'tsconfig.json'))),
  ];

  const vitestProject = (project: string): string[] => [
    bin('vitest'),
    'run',
    '--project',
    project,
    '--coverage',
    `--coverage.reportsDirectory=coverage/${project}`,
  ];

  const band1: Layer[] = [
    {
      band: 1,
      name: 'Formatting',
      steps: [[bin('prettier'), '.', '--check']],
      summary: /Code style issues|\[error\]/,
    },
    {
      band: 1,
      name: 'Linting',
      steps: [[bin('eslint'), '.']],
      summary: /✖ \d+ problems?/,
    },
    {
      band: 1,
      name: 'Type checking',
      steps: typeCheckedProjects.map((project) => [
        bin('tsc'),
        '--noEmit',
        '--pretty',
        '-p',
        project,
      ]),
      summary: /Found \d+ errors?/,
    },
  ];

  const band2: Layer[] = [
    {
      band: 2,
      name: 'Unit',
      steps: [vitestProject('unit')],
      summary: /^(Tests\s+.*failed|ERROR: Coverage)/,
    },
    {
      band: 2,
      name: 'Integration',
      steps: [vitestProject('integration')],
      summary: /^(Tests\s+.*failed|ERROR: Coverage)/,
    },
  ];

  return { band1, band2, verify: [...band1, ...band2] };
}
