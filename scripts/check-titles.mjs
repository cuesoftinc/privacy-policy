// Fails when a title the built site emits is not in Title Case: every page's <title>, og:title
// and twitter:title, the manifest name and short_name, and the llms.txt H1 and H2 headings.
// Case only, never punctuation. Runs after every build (postbuild) and in CI.
//
//   node scripts/check-titles.mjs
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const SITE = path.join(import.meta.dirname, '..', '_site');

// Capitalise every word except these, unless one opens or closes a title or a clause, or is
// the first word of a trade mark (The CueBlog™), which stays as written.
const MINOR = new Set([
  'a',
  'an',
  'the',
  'and',
  'but',
  'or',
  'nor',
  'for',
  'so',
  'yet',
  'as',
  'at',
  'by',
  'in',
  'of',
  'on',
  'to',
  'up',
  'via',
  'per',
  'vs',
]);

/** Words that break the rule: a major word in lower case, or a minor one capitalised mid-title. */
function titleCaseErrors(title) {
  const words = title
    .replace(/\(TM\)/g, '™')
    .split(/\s+/)
    .filter(Boolean);
  const errors = [];
  words.forEach((word, index) => {
    const previous = words[index - 1] ?? '';
    const opensClause =
      index === 0 ||
      /[:?!.]$/.test(previous) ||
      !/[\p{L}\p{N}]/u.test(previous);
    const edge = opensClause || index === words.length - 1;
    const markLead = words[index + 1]?.includes('™') ?? false;
    const parts = word.split(/[-/]/);
    parts.forEach((part) => {
      const core = part.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
      if (!/^\p{L}/u.test(core) || /[.@]/.test(core)) return;
      const lower = core[0] === core[0].toLowerCase();
      if (parts.length === 1 && MINOR.has(core.toLowerCase())) {
        if (edge ? lower : core !== core.toLowerCase() && !markLead)
          errors.push(core);
        return;
      }
      if (lower && !/\p{Lu}/u.test(core.slice(1))) errors.push(core);
    });
  });
  return errors;
}

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

const emitted = [];
if (!existsSync(SITE)) {
  console.error('check-titles: _site is missing; run the build first');
  process.exit(1);
}
for (const file of pages(SITE)) {
  const rel = path.relative(SITE, file);
  const html = readFileSync(file, 'utf8');
  for (const [label, pattern] of [
    ['title', /<title>([^<]*)<\/title>/],
    ['og:title', /<meta property="og:title" content="([^"]*)"/],
    ['twitter:title', /<meta name="twitter:title" content="([^"]*)"/],
  ]) {
    const match = html.match(pattern);
    if (match)
      emitted.push({ where: `${rel} ${label}`, text: decode(match[1]) });
    else if (label === 'title')
      emitted.push({ where: `${rel} ${label}`, text: '' });
  }
}

const manifest = path.join(SITE, 'assets', 'site.webmanifest');
if (existsSync(manifest)) {
  const data = JSON.parse(readFileSync(manifest, 'utf8'));
  for (const key of ['name', 'short_name'])
    if (key in data)
      emitted.push({
        where: `assets/site.webmanifest ${key}`,
        text: String(data[key]),
      });
}

const llms = path.join(SITE, 'llms.txt');
if (existsSync(llms)) {
  for (const line of readFileSync(llms, 'utf8').split('\n'))
    if (/^#{1,2} /.test(line))
      emitted.push({
        where: `llms.txt ${line.startsWith('## ') ? 'H2' : 'H1'}`,
        text: line.replace(/^#+ /, ''),
      });
}

const problems = [];
if (!emitted.some((item) => item.where === 'index.html title'))
  problems.push('index.html: no home page in _site');
if (!emitted.some((item) => item.where === '404.html title'))
  problems.push('404.html: no not-found page in _site');
for (const { where, text } of emitted) {
  if (!text.trim()) problems.push(`${where}: empty`);
  const errors = titleCaseErrors(text);
  if (errors.length)
    problems.push(`${where}: ${errors.join(', ')} in "${text}"`);
}

if (problems.length) {
  console.error(`check-titles: ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`check-titles: ${emitted.length} title(s) in Title Case`);
