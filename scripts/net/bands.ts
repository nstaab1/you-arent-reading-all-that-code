import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Layer } from './run-layers';

export type NetCommand = 'band1' | 'band2' | 'verify';

const VITEST_FAILURE = /^(Tests\s+.*failed|ERROR: Coverage)/;
const CONTRACT_FAILURE = /^\$\S* -> |^Tests\s+.*failed/;
// Playwright lists each failed flow at the end of its run. A server that never starts prints an Error.
const END_TO_END_FAILURE = /^\[chromium\] › |^Error: /;
// Pact fails provider verification behind an unreachable proxy, even on loopback.
const PROXY_VARIABLES = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy'];

export function netCommands(root: string): Record<NetCommand, Layer[]> {
  const bin = (tool: string) => join(root, 'node_modules', '.bin', tool);

  const typeCheckedProjects = [
    '.',
    ...readdirSync(join(root, 'packages'))
      .map((name) => join('packages', name))
      .filter((project) => existsSync(join(root, project, 'tsconfig.json'))),
  ];

  const vitestRun = (project: string): string[] => [bin('vitest'), 'run', '--project', project];
  const vitestWithCoverage = (project: string): string[] => [
    ...vitestRun(project),
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
      steps: [vitestWithCoverage('unit')],
      summary: VITEST_FAILURE,
    },
    {
      band: 2,
      name: 'Integration',
      steps: [vitestWithCoverage('integration')],
      summary: VITEST_FAILURE,
    },
    {
      band: 2,
      name: 'Contract',
      // The consumer tests write the pact file, then the provider verification replays it.
      steps: [vitestRun('contract-consumer'), vitestRun('contract-provider')],
      summary: CONTRACT_FAILURE,
      unsetEnv: PROXY_VARIABLES,
      // After this line Pact throws its whole result as one long JSON line.
      cutAfter: /There were \d+ pact failures?/,
    },
    {
      band: 2,
      name: 'End-to-end',
      steps: [[bin('playwright'), 'test']],
      summary: END_TO_END_FAILURE,
    },
  ];

  return { band1, band2, verify: [...band1, ...band2] };
}
