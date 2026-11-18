// Fails when the consent-gated Google Analytics is wrong. Three parts, run after
// every build (postbuild) and in CI:
//   1. the markup: with no valid measurement ID there is no banner and no GA
//      code; with one there is the banner, and the Google loader is not a tag
//      on the page but a string the script builds after Accept;
//   2. the behaviour: templates/consent.js run against a stand-in browser loads
//      nothing before Accept or on Decline, loads on Accept, and never loads
//      for a browser sending Global Privacy Control;
//   3. the built site: every page agrees with GA_MEASUREMENT_ID in build.mjs.
//
//   node scripts/check-analytics.mjs
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { analyticsOn, consentMarkup, withPreferences } from './analytics.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const SITE = path.join(ROOT, '_site');
const SCRIPT = readFileSync(path.join(ROOT, 'templates/consent.js'), 'utf8');
const LOADER = 'https://www.googletagmanager.com/gtag/js?id=';
const ID = 'G-TEST1234';
const KEY = 'cuesoft-consent-test';

const problems = [];
let checks = 0;
const expect = (ok, message) => {
  checks += 1;
  if (!ok) problems.push(message);
};

const scriptsOf = (html) =>
  [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)].map(
    ([, attributes, text]) => ({ attributes, text }),
  );
const googleScripts = (html) =>
  scriptsOf(html).filter(({ attributes, text }) =>
    /googletagmanager|google-analytics|gtag\(/.test(attributes + text),
  );
const withoutScripts = (html) => {
  let out = html;
  for (let before = ''; before !== out;) {
    before = out;
    out = out.replace(/<script\b[\s\S]*?<\/script\s*>/gi, '');
  }
  return out;
};
const count = (html, pattern) => (html.match(pattern) ?? []).length;

// 1. The markup.
for (const bad of [
  '',
  'G-AB1',
  'g-abcd1234',
  'UA-123456-1',
  'AW-1234567',
  ' G-ABCD1234',
  'G-ABCD1234 ',
  'G-ABCD-1234',
  undefined,
  null,
]) {
  const label = JSON.stringify(bad);
  expect(!analyticsOn(bad), `${label} is accepted as a measurement ID`);
  const off = consentMarkup({ measurementId: bad, storageKey: KEY });
  expect(
    off.head === '' && off.body === '',
    `${label} still renders consent markup`,
  );
  expect(
    withPreferences('<legal>', bad) === '<legal>',
    `${label} still adds the footer control`,
  );
}
for (const good of ['G-ABCD', 'G-TEST1234', 'G-ZWQL4CP765'])
  expect(analyticsOn(good), `${good} is refused as a measurement ID`);

const on = consentMarkup({ measurementId: ID, storageKey: KEY });
expect(count(on.body, /class="ds-consent"/g) === 1, 'no single ds-consent bar');
expect(
  on.body.includes(`data-measurement-id="${ID}"`) &&
    on.body.includes(`data-storage-key="${KEY}"`),
  'the bar does not carry its ID and storage key',
);
expect(
  /^\s*<div hidden /.test(on.body),
  'the bar is not hidden until scripted',
);
expect(
  on.body.includes('We use cookies for analytics, only if you accept.'),
  'the bar does not carry the corporate wording',
);
expect(
  count(on.body, /<button\b[^>]*ds-button--quiet[^>]*>Decline</g) === 1 &&
    count(on.body, /<button\b[^>]*ds-button--primary[^>]*>Accept</g) === 1,
  'the bar does not have one Decline and one Accept button',
);
expect(
  /<a\b[^>]*href="https:\/\/privacy\.cuesoft\.io\/[^"]*"[^>]*>Privacy policy<\/a>/.test(
    on.body,
  ),
  'the bar has no privacy policy link',
);
const tags = scriptsOf(on.head + on.body);
expect(tags.length === 1, `${tags.length} script tags, expected one`);
expect(
  tags.every(({ attributes }) => !/\bsrc\s*=/.test(attributes)),
  'a script tag loads a file before Accept',
);
expect(
  withoutScripts(on.body).search(/google/i) === -1,
  'Google is named outside the inline script',
);
expect(
  tags[0]?.text.includes(`'${LOADER}'`),
  'the inline script does not build the gtag loader address',
);
expect(!/google/i.test(on.head), 'the head names Google');

const legal =
  '<div class="ds-doc-legal"><div class="ds-container ds-doc-legal__bar"><span>c</span><div class="ds-doc-legal__links"><a class="ds-link" href="/">a</a></div></div></div>';
const extended = withPreferences(legal, ID);
expect(
  /<a class="ds-link" href="\/">a<\/a><button type="button" hidden [^>]*data-cuesoft-consent-reopen>Cookie preferences<\/button><\/div><\/div><\/div>$/.test(
    extended,
  ),
  'the footer control is not the last link of the legal row',
);

// 2. The behaviour, in a stand-in browser.
const element = (attributes = {}) => {
  const clicks = [];
  return {
    hidden: true,
    focused: false,
    getAttribute: (name) => attributes[name] ?? null,
    setAttribute: (name, value) => {
      attributes[name] = value;
    },
    attributes,
    addEventListener: (type, listener) => {
      if (type === 'click') clicks.push(listener);
    },
    click: () => clicks.forEach((listener) => listener()),
    focus() {
      this.focused = true;
    },
    getBoundingClientRect: () => ({ height: 72 }),
  };
};

function visit({
  gpc = false,
  storage = {},
  cookies = {},
  blocked = false,
} = {}) {
  const bar = element({ 'data-measurement-id': ID, 'data-storage-key': KEY });
  const decline = element();
  const accept = element();
  const reopen = element();
  bar.querySelector = (selector) =>
    selector === '.ds-button--quiet'
      ? decline
      : selector === '.ds-button--primary'
        ? accept
        : null;
  const scripts = [];
  const properties = new Map();
  const jar = new Map(Object.entries(cookies));
  const store = { ...storage };
  let reloads = 0;
  const document = {
    get cookie() {
      return [...jar].map(([name, value]) => `${name}=${value}`).join('; ');
    },
    set cookie(line) {
      const [pair, ...attributes] = line.split(';').map((part) => part.trim());
      const [name, ...rest] = pair.split('=');
      const value = rest.join('=');
      if (attributes.includes('max-age=0') || value === '') jar.delete(name);
      else jar.set(name, value);
    },
    head: { appendChild: (node) => scripts.push(node) },
    documentElement: {
      style: {
        setProperty: (name, value) => properties.set(name, value),
        removeProperty: (name) => properties.delete(name),
      },
    },
    querySelector: (selector) => {
      if (selector === '[data-cuesoft-consent]') return bar;
      if (selector === 'script[data-cuesoft-ga]')
        return scripts.find((node) => 'data-cuesoft-ga' in node.attributes);
      return null;
    },
    querySelectorAll: (selector) =>
      selector === '[data-cuesoft-consent-reopen]' ? [reopen] : [],
    createElement: () => element(),
  };
  const refuse = () => {
    throw new Error('storage is blocked');
  };
  const context = {
    document,
    navigator: { globalPrivacyControl: gpc },
    localStorage: blocked
      ? { getItem: refuse, setItem: refuse, removeItem: refuse }
      : {
          getItem: (key) => (key in store ? store[key] : null),
          setItem: (key, value) => {
            store[key] = value;
          },
          removeItem: (key) => {
            delete store[key];
          },
        },
    location: {
      reload: () => {
        reloads += 1;
      },
    },
    addEventListener: () => {},
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(SCRIPT, context);
  return {
    bar,
    accept,
    decline,
    reopen,
    scripts,
    properties,
    jar,
    store,
    context,
    reloads: () => reloads,
    config: () =>
      Array.from(context.dataLayer ?? [], (entry) => Array.from(entry)).filter(
        ([command]) => command === 'config',
      ),
  };
}

{
  const page = visit();
  expect(!page.bar.hidden, 'a first visit does not show the bar');
  expect(!page.reopen.hidden, 'the footer control stays hidden with scripting');
  expect(
    page.scripts.length === 0 && page.context.dataLayer === undefined,
    'a first visit loads gtag before any answer',
  );
  expect(
    page.properties.get('--ds-dock') === '72px',
    'the open bar does not publish --ds-dock',
  );
}
{
  const page = visit();
  page.accept.click();
  expect(page.scripts.length === 1, 'Accept does not load exactly one script');
  expect(
    page.scripts[0]?.src === `${LOADER}${ID}` && page.scripts[0]?.async,
    'Accept loads the wrong address',
  );
  expect(
    JSON.stringify(page.config()) === JSON.stringify([['config', ID]]),
    "Accept does not call gtag('config', ID) once",
  );
  expect(page.bar.hidden, 'the bar stays after Accept');
  expect(page.store[KEY] === 'accepted', 'Accept is not stored');
  expect(!page.properties.has('--ds-dock'), 'the closed bar keeps --ds-dock');
}
{
  const page = visit();
  page.decline.click();
  expect(
    page.scripts.length === 0 && page.context.gtag === undefined,
    'Decline loads gtag',
  );
  expect(page.store[KEY] === 'declined', 'Decline is not stored');
  expect(page.jar.get(KEY) === 'declined', 'Decline sets no decline cookie');
  expect(page.bar.hidden, 'the bar stays after Decline');
}
{
  const page = visit({ gpc: true });
  page.accept.click();
  expect(page.scripts.length === 0, 'Accept loads gtag for a GPC browser');
  expect(
    visit({ gpc: true, storage: { [KEY]: 'accepted' } }).scripts.length === 0,
    'a stored accept loads gtag for a GPC browser',
  );
}
{
  const page = visit({ storage: { [KEY]: 'accepted' } });
  expect(
    page.scripts.length === 1 && page.bar.hidden,
    'a stored accept does not load on return',
  );
  page.reopen.click();
  expect(
    !page.bar.hidden && page.bar.focused && !(KEY in page.store),
    'the footer control does not bring the bar back and clear the answer',
  );
  page.decline.click();
  expect(
    page.reloads() === 1 && page.store[KEY] === 'declined',
    'Decline after a load does not reload to unload the tag',
  );
}
{
  const stored = visit({ storage: { [KEY]: 'declined' } });
  expect(
    stored.scripts.length === 0 && stored.bar.hidden,
    'a stored decline loads gtag or shows the bar',
  );
  const cookie = visit({ cookies: { [KEY]: 'declined' } });
  expect(
    cookie.scripts.length === 0 && cookie.bar.hidden,
    'a decline cookie loads gtag or shows the bar',
  );
  const odd = visit({ storage: { [KEY]: 'yes' } });
  expect(
    odd.scripts.length === 0 && !odd.bar.hidden,
    'an unknown stored value counts as an answer',
  );
}
{
  const page = visit({ blocked: true });
  page.accept.click();
  expect(
    page.scripts.length === 1,
    'Accept with blocked storage does not hold for the visit',
  );
}

// 3. The built site.
const constant = readFileSync(
  path.join(ROOT, 'scripts/build.mjs'),
  'utf8',
).match(/^const GA_MEASUREMENT_ID = '([^']*)';$/m);
expect(
  constant !== null,
  'scripts/build.mjs has no GA_MEASUREMENT_ID constant',
);
const configured = constant ? constant[1] : '';

if (!existsSync(SITE)) {
  problems.push('_site/ does not exist; run the build first');
} else {
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : [path.join(dir, entry.name)],
    );
  const pages = walk(SITE).filter((file) => file.endsWith('.html'));
  expect(pages.length > 0, '_site/ holds no page');
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const where = path.relative(SITE, file);
    const google = googleScripts(html);
    if (analyticsOn(configured)) {
      expect(
        count(html, /class="ds-consent"/g) === 1 &&
          count(html, /data-cuesoft-consent(?=[\s>])/g) === 1 &&
          html.includes(`data-measurement-id="${configured}"`),
        `${where}: not exactly one consent bar for ${configured}`,
      );
      expect(
        count(html, /<button\b[^>]*data-cuesoft-consent-reopen/g) === 1,
        `${where}: not exactly one footer control to reopen the choice`,
      );
      expect(
        google.length === 1 &&
          google.every(({ attributes }) => !/\bsrc\s*=/.test(attributes)),
        `${where}: a Google tag outside the consent script`,
      );
    } else {
      expect(
        google.length === 0 &&
          !/class="ds-consent"|data-cuesoft-consent|data-measurement-id|data-cuesoft-ga/.test(
            html,
          ),
        `${where}: carries consent or Google Analytics code with no measurement ID`,
      );
    }
  }
}

if (problems.length) {
  console.error(`check-analytics: ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(3);
}
console.log(
  `check-analytics: ${checks} check(s) passed; GA_MEASUREMENT_ID is ${configured ? configured : 'empty'}, ${analyticsOn(configured) ? 'banner and script on every page' : 'no banner and no script on any page'}`,
);
