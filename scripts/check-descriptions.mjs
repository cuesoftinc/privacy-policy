// Fails when a built page's description, og:description or twitter:description is clipped:
// one that ends in an ellipsis, or anywhere but at the end of a sentence, so a mid-word
// cut cannot ship. Redirect stubs carry no description and are skipped. Runs after every
// build (postbuild) and in CI.
//
//   node scripts/check-descriptions.mjs
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const SITE = path.join(import.meta.dirname, '..', '_site');

const TAGS = [
  ['description', /<meta name="description" content="([^"]*)"/],
  ['og:description', /<meta property="og:description" content="([^"]*)"/],
  ['twitter:description', /<meta name="twitter:description" content="([^"]*)"/],
];

// A description ends on . ! ? or : (the lead-in to a list), closed by at most a quote or bracket.
const COMPLETE = /[.!?:]["')\]’”]*$/;

const decode = (text) =>
  text
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');

const pages = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'assets' ? [] : pages(file);
    return entry.name.endsWith('.html') ? [file] : [];
  });

if (!existsSync(SITE)) {
  console.error('check-descriptions: _site is missing; run the build first');
  process.exit(1);
}

const problems = [];
let checked = 0;
for (const file of pages(SITE)) {
  const html = readFileSync(file, 'utf8');
  if (/<meta http-equiv="refresh"/i.test(html)) continue;
  const rel = path.relative(SITE, file);
  for (const [label, pattern] of TAGS) {
    const match = html.match(pattern);
    const where = `${rel} ${label}`;
    if (!match) {
      problems.push(`${where}: missing`);
      continue;
    }
    checked += 1;
    const text = decode(match[1]).trim();
    if (!text) problems.push(`${where}: empty`);
    else if (text.endsWith('…') || text.endsWith('...'))
      problems.push(`${where}: ends in an ellipsis: "${text}"`);
    else if (!COMPLETE.test(text))
      problems.push(`${where}: does not end at a sentence end: "${text}"`);
  }
}
if (checked === 0) problems.push('no description found in _site');

if (problems.length) {
  console.error(`check-descriptions: ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`check-descriptions: ${checked} description(s), none clipped`);
