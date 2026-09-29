// Fails when an em dash (U+2014), or an en dash (U+2013) set between spaces as
// a dash, appears in any source text file or in the built _site. Write a colon,
// a comma or parentheses. The package stylesheet's comments are not copy, so
// CSS is checked with its comments removed, and assets/vendor holds third-party
// scripts. Runs after every build (postbuild) and in CI.
//
//   node scripts/check-dashes.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const SITE = path.join(ROOT, '_site');
const EM_DASH = String.fromCharCode(0x2014);
const SPACED_EN_DASH = ` ${String.fromCharCode(0x2013)} `;
const SKIPPED_DIRECTORIES = new Set(['.git', 'node_modules', '_site']);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return SKIPPED_DIRECTORIES.has(entry.name) ? [] : walk(full);
    return [full];
  });

/** Tracked files plus new ones not yet ignored, so a file is checked before it is committed. */
function sourceFiles() {
  try {
    const listed = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
      cwd: ROOT,
      maxBuffer: 1 << 26,
    })
      .toString()
      .split('\0')
      .filter(Boolean);
    return listed.map((file) => path.join(ROOT, file)).filter((file) => existsSync(file));
  } catch {
    return walk(ROOT).filter((file) => !path.relative(ROOT, file).startsWith(path.join('assets', 'design-system')));
  }
}

const problems = [];

function scan(file, { skipVendor = false } = {}) {
  const relative = path.relative(ROOT, file);
  if (skipVendor && relative.split(path.sep).slice(0, 3).join('/') === '_site/assets/vendor') return false;
  const buffer = readFileSync(file);
  if (buffer.subarray(0, 8000).includes(0)) return false;
  let text = buffer.toString('utf8');
  // Comments become blank lines, so the reported line numbers stay true.
  if (file.endsWith('.css')) text = text.replaceAll(/\/\*[\s\S]*?\*\//g, (comment) => comment.replaceAll(/[^\n]/g, ''));
  text.split('\n').forEach((line, index) => {
    if (line.includes(EM_DASH) || line.includes(SPACED_EN_DASH)) {
      problems.push(`${relative}:${index + 1}: ${line.trim().slice(0, 100)}`);
    }
  });
  return true;
}

const source = sourceFiles().filter((file) => scan(file));
const built = existsSync(SITE) ? walk(SITE).filter((file) => scan(file, { skipVendor: true })) : [];

if (problems.length) {
  console.error(`check-dashes: ${problems.length} dash(es); write a colon, a comma or parentheses instead`);
  for (const problem of problems.slice(0, 40)) console.error(`  ${problem}`);
  process.exit(1);
}
console.log(
  `check-dashes: ${source.length} source file(s)${built.length ? ` and ${built.length} built file(s)` : ' (no _site to check)'}, no em dash`,
);
