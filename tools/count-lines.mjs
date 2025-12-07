import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
const files = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .map((file) => path.resolve(repoRoot, file));

const summaryByDir = new Map();
let totalLines = 0;

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lineCount = content.split(/\r?\n/).length;
  totalLines += lineCount;

  const relativePath = path.relative(repoRoot, filePath);
  const topLevelDir = relativePath.split(path.sep)[0] || '.';
  const currentTotal = summaryByDir.get(topLevelDir) ?? 0;
  summaryByDir.set(topLevelDir, currentTotal + lineCount);
}

console.log(`Total tracked lines: ${totalLines}`);
console.log('\nTop-level directory breakdown:');
for (const [dir, count] of [...summaryByDir.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`${dir.padEnd(15)} ${count.toString().padStart(8)} lines`);
}
