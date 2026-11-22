// The site index on a phone sits in one place, drawn one way, on every page. At 390 wide the
// index (the contents of the whole site) is off the page until the reader opens the "On This
// Page" fold-out above the document, and then it opens inside that same box, under the page's
// own headings and over the breadcrumb. The index page, an article with headings and a page
// with none are checked by name, then every other page against them. Reads the built _site in
// Playwright's Chromium; a missing site or browser fails the test, never skips it.
//
//   node scripts/build.mjs && node --test scripts/index-placement.test.mjs
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { after, before, test } from 'node:test';

import { chromium } from '@playwright/test';

const ROOT = path.join(import.meta.dirname, '..');
const SITE = path.join(ROOT, '_site');
const PHONE = { width: 390, height: 844 };
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(path.join(dir, entry.name))
      : [path.join(dir, entry.name)],
  );

/** The h2 and h3 lines of a page's markdown, outside fenced code. */
function headingCount(markdown) {
  let fenced = false;
  let count = 0;
  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    else if (!fenced && /^#{2,3}\s/.test(line)) count += 1;
  }
  return count;
}

/** Every built document page (the shell's article is on it), with its route and source headings. */
function documentPages() {
  if (!existsSync(SITE)) return [];
  return walk(SITE)
    .filter((file) => file.endsWith(`${path.sep}index.html`))
    .filter((file) =>
      readFileSync(file, 'utf8').includes('data-ds-doc-article'),
    )
    .map((file) => {
      const route = path
        .relative(SITE, path.dirname(file))
        .split(path.sep)
        .join('/');
      const source = path.join(ROOT, route, 'README.md');
      return {
        route,
        url: route ? `/${route}/` : '/',
        headings: existsSync(source)
          ? headingCount(readFileSync(source, 'utf8'))
          : -1,
      };
    })
    .sort((a, b) => a.route.localeCompare(b.route));
}

let server;
let origin;
let browser;

before(async () => {
  server = createServer((request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    );
    let file = path.join(SITE, pathname);
    if (!file.startsWith(SITE)) {
      response.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory())
      file = path.join(file, 'index.html');
    const found = existsSync(file);
    if (!found) file = path.join(SITE, '404.html');
    response.writeHead(found ? 200 : 404, {
      'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    });
    response.end(readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await new Promise((resolve) => (server ? server.close(resolve) : resolve()));
});

const box = (page, selector) =>
  page.evaluate((sel) => {
    const node = document.querySelector(sel);
    if (!node || getComputedStyle(node).display === 'none') return null;
    const { top, bottom, left, width } = node.getBoundingClientRect();
    return { top, bottom, left, width };
  }, selector);

/**
 * Where the site index is drawn on a phone, as one comparable record: the place, then the
 * fold-out's top and the index's left edge and width once it is open.
 */
async function placement(url) {
  const page = await browser.newPage({ viewport: PHONE });
  try {
    await page.goto(`${origin}${url}`, { waitUntil: 'load' });
    assert.ok(
      await page.evaluate(() =>
        document.querySelector('.ds-doc')?.hasAttribute('data-enhanced'),
      ),
      `${url}: the shell's script did not run`,
    );
    const article = await box(page, '[data-ds-doc-article]');
    const index = await box(page, '[data-ds-doc-contents]');
    const fold = await box(page, '.ds-article__contents--column');
    if (!fold) {
      return {
        place:
          index && index.top >= article.bottom - 1
            ? 'under the document'
            : 'not in the On This Page fold-out',
      };
    }
    if (index) return { place: 'on the page while the fold-out is shut' };
    await page.click('[data-ds-contents-toggle]');
    const opened = await box(page, '[data-ds-doc-contents]');
    const head = await box(page, '.ds-article__contents--column');
    const trail = await box(page, '.ds-doc__trail');
    const inBox =
      opened &&
      Math.abs(opened.top - head.bottom) < 1 &&
      Math.abs(opened.left - head.left) < 1 &&
      Math.abs(opened.width - head.width) < 1 &&
      opened.bottom <= trail.top;
    return inBox
      ? {
          place: 'in the On This Page fold-out',
          top: Math.round(head.top),
          left: Math.round(opened.left),
          width: Math.round(opened.width),
        }
      : { place: 'apart from the On This Page fold-out' };
  } finally {
    await page.close();
  }
}

const pages = documentPages();
const home = pages.find((p) => p.route === '');
const article = pages.find((p) => p.route && p.headings >= 2);
const bare = pages.find((p) => p.route && p.headings === 0);

test('the site has the pages this test reads', () => {
  assert.ok(pages.length > 0, '_site holds no document page: build it first');
  assert.ok(home, 'no index page in _site');
  assert.ok(article, 'no article page with two or more headings in _site');
  assert.ok(bare, 'no page without headings in _site');
});

test('at 390 the index page, an article and a page with no headings place the site index alike', async () => {
  const expected = await placement(home.url);
  assert.equal(
    expected.place,
    'in the On This Page fold-out',
    `${home.url}: the site index is ${expected.place}`,
  );
  for (const other of [article, bare]) {
    assert.deepEqual(
      await placement(other.url),
      expected,
      `${other.url} places the site index differently from ${home.url}`,
    );
  }
});

test('at 390 every page places the site index where the index page does', async () => {
  const expected = await placement(home.url);
  const differ = [];
  for (const other of pages) {
    const got = await placement(other.url);
    if (JSON.stringify(got) !== JSON.stringify(expected))
      differ.push(`${other.url}: ${got.place}`);
  }
  console.log(
    `index-placement: ${pages.length} page(s) read, ${differ.length} place the site index differently`,
  );
  assert.deepEqual(
    differ,
    [],
    `the site index is not where ${home.url} has it (${expected.place})`,
  );
});
