import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const TARGET_RUNTIME = 'nodejs20.x';
const functionsDir = '.vercel/output/functions';

if (!existsSync(functionsDir)) {
  console.log('[fix-runtime] No functions directory found, skipping.');
  process.exit(0);
}

const entries = readdirSync(functionsDir, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const configPath = join(functionsDir, entry.name, '.vc-config.json');
  if (!existsSync(configPath)) continue;

  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.runtime && config.runtime !== TARGET_RUNTIME && config.runtime.startsWith('nodejs')) {
    const old = config.runtime;
    config.runtime = TARGET_RUNTIME;
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`[fix-runtime] ${entry.name}: ${old} -> ${TARGET_RUNTIME}`);
  }
}

console.log('[fix-runtime] Done.');
