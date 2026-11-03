import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Writable } from 'node:stream';
import { stripVTControlCharacters } from 'node:util';

export interface Layer {
  band: number;
  name: string;
  /** Each step is a command and its arguments. Every step runs, even after one fails. */
  steps: string[][];
  /** Picks the one-line failure summary from the tool's output. The last matching line wins. */
  summary: RegExp;
}

export interface LayerResult {
  band: number;
  layer: string;
  status: 'passed' | 'failed';
  seconds: number;
  summary: string | null;
}

export interface RunResult {
  command: string;
  commit: string | null;
  startedAt: string;
  passed: boolean;
  layers: LayerResult[];
}

const GREEN = '\u001b[32m';
const RED = '\u001b[31m';
const BOLD = '\u001b[1m';
const RESET = '\u001b[0m';

export async function runLayers(
  command: string,
  layers: Layer[],
  options: { resultsFile: string; output: Writable; commit?: string | null },
): Promise<RunResult> {
  const { output } = options;
  const startedAt = new Date().toISOString();
  const results: LayerResult[] = [];

  for (const layer of layers) {
    output.write(`\n${BOLD}━━ Band ${layer.band} · ${layer.name} ━━${RESET}\n`);
    const result = await runLayer(layer, output);
    const mark = result.status === 'passed' ? `${GREEN}✔` : `${RED}✘`;
    output.write(`${mark} ${layer.name} ${result.status} in ${result.seconds}s${RESET}\n`);
    results.push(result);
  }

  const run: RunResult = {
    command,
    commit: options.commit ?? null,
    startedAt,
    passed: results.every((result) => result.status === 'passed'),
    layers: results,
  };
  await mkdir(dirname(options.resultsFile), { recursive: true });
  await writeFile(options.resultsFile, `${JSON.stringify(run, null, 2)}\n`);
  printScoreboard(run, options);
  return run;
}

async function runLayer(layer: Layer, output: Writable): Promise<LayerResult> {
  const started = performance.now();
  let transcript = '';
  let failedExitCode: number | null = null;

  for (const [program, ...args] of layer.steps) {
    if (!program) continue;
    const exitCode = await runStep(program, args, output, (text) => (transcript += text));
    if (exitCode !== 0 && failedExitCode === null) failedExitCode = exitCode;
  }

  const seconds = Math.round((performance.now() - started) / 10) / 100;
  if (failedExitCode === null) {
    return { band: layer.band, layer: layer.name, status: 'passed', seconds, summary: null };
  }
  return {
    band: layer.band,
    layer: layer.name,
    status: 'failed',
    seconds,
    summary: summarize(transcript, layer.summary) ?? `exited with code ${failedExitCode}`,
  };
}

function runStep(
  program: string,
  args: string[],
  output: Writable,
  record: (text: string) => void,
): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(program, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: process.env.FORCE_COLOR ?? '1' },
    });
    const forward = (chunk: Buffer) => {
      output.write(chunk);
      record(chunk.toString());
    };
    child.stdout.on('data', forward);
    child.stderr.on('data', forward);
    child.on('error', (error) => {
      forward(Buffer.from(`${error.message}\n`));
      resolve(127);
    });
    child.on('close', (code) => resolve(code ?? 1));
  });
}

function summarize(transcript: string, pattern: RegExp): string | null {
  const lines = stripVTControlCharacters(transcript)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => pattern.test(line));
  return lines.at(-1) ?? null;
}

function printScoreboard(run: RunResult, options: { resultsFile: string; output: Writable }) {
  const { output } = options;
  const passedCount = run.layers.filter((layer) => layer.status === 'passed').length;
  const colour = run.passed ? GREEN : RED;
  output.write(
    `\n${BOLD}${colour}${run.command}: ${passedCount} of ${run.layers.length} layers passed${RESET}\n`,
  );
  const width = Math.max(...run.layers.map((layer) => layer.layer.length));
  for (const layer of run.layers) {
    const mark = layer.status === 'passed' ? `${GREEN}✔` : `${RED}✘`;
    const time = `${layer.seconds.toFixed(1)}s`.padStart(6);
    const summary = layer.summary ? `  ${layer.summary}` : '';
    output.write(`  ${mark} ${layer.layer.padEnd(width)}${RESET} ${time}${summary}\n`);
  }
  output.write(`Results: ${options.resultsFile}\n`);
}
