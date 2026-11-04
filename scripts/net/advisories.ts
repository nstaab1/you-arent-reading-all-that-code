import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { advisoryDatabase } from './bands';

// Online. Downloads the npm advisory database into the fixed folder that the
// Dependency scanning layer reads offline. OSV-Scanner only downloads as part
// of a scan, so this scans the lockfile too.
const root = fileURLToPath(new URL('../..', import.meta.url));
const database = advisoryDatabase(root);

const scan = spawnSync(
  'osv-scanner',
  [
    'scan',
    'source',
    '--offline-vulnerabilities',
    '--download-offline-databases',
    '--lockfile',
    'package-lock.json',
  ],
  {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, OSV_SCANNER_LOCAL_DB_CACHE_DIRECTORY: database },
  },
);

// Exit code 1 means the scan found advisories. Reporting them is the net's
// job, so only a failed download or a missing scanner fails this command.
if (scan.error) {
  console.error(`Could not start osv-scanner: ${scan.error.message}`);
  process.exitCode = 127;
} else if (scan.status !== 0 && scan.status !== 1) {
  process.exitCode = scan.status ?? 1;
} else {
  console.log(`\nAdvisory database: ${database}`);
}
