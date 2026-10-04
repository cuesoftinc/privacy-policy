// Fails when a built page points at something _site does not hold: a link or
// image whose file is missing, a #fragment with no matching id on its target,
// a font the stylesheet names that was not published, or a {{placeholder}}
// the build left behind. Run after `node scripts/build.mjs`.
//
//   node scripts/check-links.mjs
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const SITE = path.join(import.meta.dirname, '..', '_site');
const CNAME = path.join(import.meta.dirname, '..', 'CNAME');
const HOST = existsSync(CNAME) ? readFileSync(CNAME, 'utf8').trim() : '';

if (!existsSync(SITE)) {
  console.error('check-links: _site/ does not exist; run the build first');
  process.exit(2);
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(path.join(dir, entry.name))
      : [path.join(dir, entry.name)],
  );

const files = walk(SITE);
const pages = files.filter((file) => file.endsWith('.html'));
const problems = [];
const idsOf = new Map();

const decode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const idsIn = (file) => {
  if (!idsOf.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsOf.set(
      file,
      new Set([...html.matchAll(/\sid="([^"]*)"/g)].map((match) => match[1])),
    );
  }
  return idsOf.get(file);
};

/** The file a path in _site resolves to, the way GitHub Pages serves it. */
const resolveFile = (pathname) => {
  const target = path.join(SITE, decode(pathname));
  if (!target.startsWith(SITE)) return null;
  if (existsSync(target) && statSync(target).isFile()) return target;
  const index = path.join(target, 'index.html');
  return existsSync(index) ? index : null;
};

let checked = 0;
for (const page of pages) {
  const rel = path.relative(SITE, page);
  const html = readFileSync(page, 'utf8');
  if (/\{\{\w+\}\}/.test(html))
    problems.push(`${rel}: an unfilled {{placeholder}}`);
  const origin = `https://${HOST || 'site.invalid'}/${path.dirname(rel) === '.' ? '' : `${path.dirname(rel)}/`}`;
  for (const match of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (!value || /^(?:mailto:|tel:|data:|javascript:)/.test(value)) continue;
    let url;
    try {
      url = new URL(value, origin);
    } catch {
      problems.push(`${rel}: ${value} is not a URL`);
      continue;
    }
    if (url.host !== HOST) continue;
    checked += 1;
    const file = resolveFile(url.pathname);
    if (!file) {
      problems.push(`${rel}: ${value} resolves to nothing in _site`);
      continue;
    }
    if (
      url.hash &&
      file.endsWith('.html') &&
      !idsIn(file).has(decode(url.hash.slice(1)))
    ) {
      problems.push(`${rel}: ${value} has no id ${url.hash} on its target`);
    }
  }
}

for (const sheet of files.filter((file) => file.endsWith('.css'))) {
  const css = readFileSync(sheet, 'utf8');
  for (const match of css.matchAll(/url\(\s*['"]?(\/[^'")\s]+)['"]?\s*\)/g)) {
    checked += 1;
    if (!resolveFile(match[1]))
      problems.push(
        `${path.relative(SITE, sheet)}: url(${match[1]}) resolves to nothing in _site`,
      );
  }
}

if (problems.length) {
  console.error(`check-links: ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(
  `check-links: ${pages.length} page(s), ${checked} internal reference(s), all resolve`,
);
