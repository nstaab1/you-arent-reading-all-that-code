import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { netCommands, type NetCommand } from './bands';
import { runLayers } from './run-layers';

const root = fileURLToPath(new URL('../..', import.meta.url));
const commands = netCommands(root);
const command = process.argv[2];

if (!isNetCommand(command)) {
  console.error(`Usage: tsx scripts/net/cli.ts <${Object.keys(commands).join('|')}>`);
  process.exit(2);
}

process.chdir(root);
const result = await runLayers(command, commands[command], {
  resultsFile: join('.net', 'results', `${command}.json`),
  output: process.stdout,
  commit: currentCommit(),
});
process.exitCode = result.passed ? 0 : 1;

function isNetCommand(value: string | undefined): value is NetCommand {
  return value !== undefined && Object.hasOwn(commands, value);
}

function currentCommit(): string | null {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}
