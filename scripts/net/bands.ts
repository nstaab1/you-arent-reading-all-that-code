import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Layer } from './run-layers';

export type NetCommand = 'band1' | 'band2' | 'band3' | 'verify';

const VITEST_FAILURE = /^(Tests\s+.*failed|ERROR: Coverage)/;
const CONTRACT_FAILURE = /^\$\S* -> |^Tests\s+.*failed/;
// Playwright lists each failed flow at the end of its run. A server that never starts prints an Error.
const END_TO_END_FAILURE = /^\[chromium\] › |^Error: /;
// Pact fails provider verification behind an unreachable proxy, even on loopback.
const PROXY_VARIABLES = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy'];
// Semgrep ends its run with "Ran 2 rules on 40 files: 1 finding."
const STATIC_ANALYSIS_FAILURE = /^Ran \d+ rules? on \d+ files?: \d+ findings?/;
// OSV-Scanner prints this line above its table of advisories.
const DEPENDENCY_SCANNING_FAILURE = /^Total \d+ packages? affected/;

/** The advisory database OSV-Scanner reads offline. `npm run advisories` downloads it. */
export function advisoryDatabase(root: string): string {
  return join(root, '.osv-database');
}

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

  const band3: Layer[] = [
    {
      band: 3,
      name: 'Static analysis',
      // Only rule files committed to the repo. A registry config such as
      // `--config auto` fetches rules from semgrep.dev and crashes offline.
      steps: [
        [
          'semgrep',
          'scan',
          '--config',
          'semgrep',
          '--error',
          '--disable-version-check',
          '--metrics=off',
        ],
      ],
      summary: STATIC_ANALYSIS_FAILURE,
    },
    {
      band: 3,
      name: 'Dependency scanning',
      // `--offline` reads only the downloaded database and never updates it.
      // `npm audit` is never used: offline, it passes without checking anything.
      steps: [['osv-scanner', 'scan', 'source', '--offline', '--lockfile', 'package-lock.json']],
      summary: DEPENDENCY_SCANNING_FAILURE,
      env: { OSV_SCANNER_LOCAL_DB_CACHE_DIRECTORY: advisoryDatabase(root) },
    },
  ];

  return { band1, band2, band3, verify: [...band1, ...band2, ...band3] };
}
