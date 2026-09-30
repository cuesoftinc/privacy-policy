// Fails when the built site has no 404.html, or the one it has is not the not-found
// page: GitHub Pages serves this file, with a 404 status, for every address the
// site does not hold, and without it a reader lands on GitHub's own page. The
// page must also carry no em dash, stay out of the index and offer one way
// back to the site root. Runs after every build (postbuild) and in CI.
//
//   node scripts/check-not-found.mjs
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const FILE = path.join(import.meta.dirname, '..', '_site', '404.html');
const EM_DASH = String.fromCharCode(0x2014);

if (!existsSync(FILE)) {
  console.error('check-not-found: _site/404.html is missing; GitHub Pages would show its own 404 page');
  process.exit(1);
}

const html = readFileSync(FILE, 'utf8');
const problems = [];

if (html.includes(EM_DASH) || /&mdash;|&#0*8212;|&#x0*2014;/i.test(html)) problems.push('carries an em dash');
if (!/<title>Page not found \| [^<]+<\/title>/.test(html)) problems.push('title is not "Page not found | <site>"');
if (!/<meta name="robots" content="[^"]*\bnoindex\b[^"]*"/.test(html)) problems.push('is not marked noindex');
if (!/<h1\b[^>]*>That page is not here\.<\/h1>/.test(html)) problems.push('has no "That page is not here." heading');
const actions = [...html.matchAll(/<a\b[^>]*\bclass="[^"]*\bds-notfound__action\b[^"]*"[^>]*>/g)];
if (actions.length !== 1 || !/\shref="\/"/.test(actions[0][0])) problems.push('does not have exactly one action to "/"');

if (problems.length) {
  console.error(`check-not-found: _site/404.html ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log('check-not-found: _site/404.html present, no em dash, noindex, one way back to /');
