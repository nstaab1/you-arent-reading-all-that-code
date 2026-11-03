import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runLayers, type Layer } from './run-layers';

function nodeLayer(band: number, name: string, script: string, summary = /./): Layer {
  return { band, name, steps: [[process.execPath, '-e', script]], summary };
}

const passing = nodeLayer(1, 'Formatting', 'console.log("all files formatted")');
const failing = nodeLayer(
  1,
  'Linting',
  'console.log("src/a.ts\\n  1:1  error  Unexpected any"); console.log("✖ 1 problem (1 error, 0 warnings)"); console.log("done"); process.exit(1)',
  /problems?/,
);
const typeChecking = nodeLayer(1, 'Type checking', 'console.log("no type errors")');

describe('runLayers', () => {
  let directory: string;
  let resultsFile: string;
  let output: PassThrough;
  let printed: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'net-'));
    resultsFile = join(directory, 'results', 'band1.json');
    output = new PassThrough();
    printed = '';
    output.on('data', (chunk: Buffer) => (printed += chunk.toString()));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true });
  });

  async function readResults(): Promise<unknown> {
    return JSON.parse(await readFile(resultsFile, 'utf8')) as unknown;
  }

  it('passes when every layer passes', async () => {
    const result = await runLayers('band1', [passing, typeChecking], { resultsFile, output });

    expect(result.passed).toBe(true);
    expect(await readResults()).toMatchObject({
      command: 'band1',
      passed: true,
      layers: [
        { band: 1, layer: 'Formatting', status: 'passed', summary: null },
        { band: 1, layer: 'Type checking', status: 'passed', summary: null },
      ],
    });
  });

  it('runs every layer after one fails, and fails the run', async () => {
    const result = await runLayers('band1', [passing, failing, typeChecking], {
      resultsFile,
      output,
    });

    expect(result.passed).toBe(false);
    expect(await readResults()).toMatchObject({
      passed: false,
      layers: [
        { layer: 'Formatting', status: 'passed' },
        { layer: 'Linting', status: 'failed', summary: '✖ 1 problem (1 error, 0 warnings)' },
        { layer: 'Type checking', status: 'passed' },
      ],
    });
  });

  it("prints each tool's own output under its layer header", async () => {
    await runLayers('band1', [passing, failing], { resultsFile, output });

    expect(printed).toMatch(/Band 1 · Formatting[^\n]*\n[\s\S]*all files formatted/);
    expect(printed).toMatch(/Band 1 · Linting[^\n]*\n[\s\S]*1:1 {2}error {2}Unexpected any/);
  });

  it("records each layer's time in seconds", async () => {
    await runLayers('band1', [nodeLayer(1, 'Slow', 'setTimeout(() => {}, 300)')], {
      resultsFile,
      output,
    });

    const results = (await readResults()) as { layers: { seconds: number }[] };
    expect(results.layers[0]?.seconds).toBeGreaterThanOrEqual(0.3);
  });

  it('fails a layer when any of its steps fails, and still runs the rest', async () => {
    const twoSteps: Layer = {
      band: 1,
      name: 'Type checking',
      steps: [
        [process.execPath, '-e', 'console.log("Found 2 errors in 1 file."); process.exit(2)'],
        [process.execPath, '-e', 'console.log("second project checked")'],
      ],
      summary: /Found \d+ errors?/,
    };

    await runLayers('band1', [twoSteps], { resultsFile, output });

    expect(printed).toContain('second project checked');
    expect(await readResults()).toMatchObject({
      layers: [{ status: 'failed', summary: 'Found 2 errors in 1 file.' }],
    });
  });

  it('falls back to the exit code when no output line matches the summary', async () => {
    await runLayers('band1', [nodeLayer(2, 'Unit', 'process.exit(3)', /never matches/)], {
      resultsFile,
      output,
    });

    expect(await readResults()).toMatchObject({
      layers: [{ band: 2, status: 'failed', summary: 'exited with code 3' }],
    });
  });
});
