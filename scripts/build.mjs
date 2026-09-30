// Static site generator for the Cuesoft legal & handbook sites: every folder
// with a README.md becomes a route. The markdown is rendered with marked; the
// page around it is the design system's DocShell, rendered to static HTML with
// react-dom/server, and the package's own stylesheet is written into _site.
// One script, vendored identically across handbook, terms and privacy-policy:
// only the knob block below differs.
//
//   node scripts/build.mjs      → writes _site/
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  DocHeader,
  DocLegal,
  DocShell,
  Icon,
  Lockup,
  NotFound,
  SkipLink,
  ThemeToggle,
  themePrepaintElement,
} from '@cuesoftinc/design-system/corporate';
import { marked } from 'marked';

import CARD from './og-card.config.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const OUT = path.join(ROOT, '_site');

// Per-repo knobs: the only lines that differ between the three repos.
const SITE = process.env.SITE_TITLE || 'Cuesoft Privacy Policy';
const DESCRIPTION =
  process.env.SITE_DESCRIPTION ||
  'What each Cuesoft website collects, why, and your rights under Nigerian, EU/UK and US law, plus the Cueprise™ Privacy Notice.';
// Sections in reading order; anything not listed sorts after, alphabetically.
const SECTION_ORDER = ['collection', 'cueprise', 'handling', 'rights', 'jurisdictions'];
// Routes that moved or retired: each key becomes a redirect stub so old
// bookmarks and inbound links keep landing.
const REDIRECTS = {};

const THEME_KEY = 'cuesoft-theme';
const ASSETS = '/assets/design-system';
const LOCKUP = {
  light: `${ASSETS}/logos-official/cuesoft-horizontal-light-trim.png`,
  dark: `${ASSETS}/logos-official/cuesoft-horizontal-white-trim.png`,
  alt: 'Cuesoft, reimagine software',
};
// The documents on the bar; the one whose address is this site's is current.
const DOCUMENTS = [
  { label: 'Handbook', href: 'https://handbook.cuesoft.io' },
  { label: 'Privacy', href: 'https://privacy.cuesoft.io' },
  { label: 'Terms', href: 'https://terms.cuesoft.io' },
];
const LEGAL_LINKS = [
  { label: 'cuesoft.io', href: 'https://cuesoft.io' },
  { label: 'CueTA™', href: 'https://cueta.cuesoft.io' },
  { label: 'CueLABS™', href: 'https://cuelabs.cuesoft.io' },
  { label: 'CueHIRE™', href: 'https://cuehire.cuesoft.io' },
  { label: 'hello@cuesoft.io', href: 'mailto:hello@cuesoft.io' },
];
// Of the package assets the copy step writes under assets/design-system, the
// pages publish the fonts the stylesheet names and the two lockups the bar draws.
const PUBLISHED = [
  /^design-system$/,
  /^design-system\/fonts(?:\/|$)/,
  /^design-system\/logos-official$/,
  /^design-system\/logos-official\/cuesoft-horizontal-(?:light|white)-trim\.png$/,
];

const template = readFileSync(path.join(ROOT, 'templates/page.html'), 'utf8');
if (!template.includes(themePrepaintElement({ storageKey: THEME_KEY }))) {
  throw new Error(
    `templates/page.html must inline the pre-paint script the pinned package renders: themePrepaintElement({ storageKey: '${THEME_KEY}' })`,
  );
}

// The canonical origin comes from the CNAME file GitHub Pages already uses.
const BASE = existsSync(path.join(ROOT, 'CNAME'))
  ? `https://${readFileSync(path.join(ROOT, 'CNAME'), 'utf8').trim()}`
  : '';

// Datadog browser RUM: operational telemetry, on the live host only. The
// application id and client token are public by design and arrive from the
// workflow as NEXT_PUBLIC_DD_*. A build without both (a fork's pull request, a
// local run) ships no RUM and says so. The SDK is the exact pin in
// package.json, copied from node_modules, so pages load no third-party script.
const PACKAGE = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const RUM_SDK = path.join(ROOT, 'node_modules/@datadog/browser-rum/bundle/datadog-rum.js');
const RUM = {
  applicationId: (process.env.NEXT_PUBLIC_DD_APPLICATION_ID ?? '').trim(),
  clientToken: (process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN ?? '').trim(),
};
const rumOn = Boolean(RUM.applicationId && RUM.clientToken && BASE);
if (!rumOn) {
  const note =
    'Datadog RUM is not in this build: NEXT_PUBLIC_DD_APPLICATION_ID and NEXT_PUBLIC_DD_CLIENT_TOKEN are not both set';
  console.log(process.env.GITHUB_ACTIONS === 'true' ? `::warning::${note}` : note);
}

const escapeHtml = (s) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// A page describes itself: its first body paragraph, stripped of markdown,
// clipped for the description and social-card tags.
function descriptionOf(markdown) {
  const block = markdown
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .find(
      (chunk) =>
        chunk &&
        !chunk.startsWith('#') &&
        !chunk.startsWith('|') &&
        // Skip formatting-only blocks (effective-date lines and the like)
        // in favour of the first substantive paragraph.
        !/^\*\*effective date/i.test(chunk) &&
        chunk.length >= 60,
    );
  if (!block) return DESCRIPTION;
  const text = block
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*]|\d+\.)\s+/, '').trim())
    .join(' ')
    .replaceAll(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replaceAll(/[*_`]/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim();
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 120))}…`;
}

/** Every directory that carries a README.md is a page. */
function findPages(dir = ROOT, rel = '') {
  const pages = [];
  if (existsSync(path.join(dir, 'README.md'))) pages.push(rel);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (['.git', '.github', '_site', 'node_modules', 'templates', 'scripts', 'assets'].includes(entry.name)) continue;
    pages.push(...findPages(path.join(dir, entry.name), rel ? `${rel}/${entry.name}` : entry.name));
  }
  return pages;
}

const pages = findPages();

const titleOf = (markdown, fallback) => {
  const h1 = markdown.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].replace(/[*_`]/g, '').trim() : fallback;
};

const label = (slug) =>
  slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

// Title Case for the <title> and share titles, so a page heading keeps the case it is written in.
// Every word is capitalised but these connectives, which stay lower case unless one opens or
// closes a title or a clause; both parts of a hyphenated compound are capitalised; acronyms,
// marks and the first word of a trade mark (The CueBlog™) stay as written.
const MINOR_WORDS = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'as', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'via', 'per', 'vs']);
function titleCase(text) {
  const tokens = text.split(/(\s+)/);
  const words = tokens.filter((token) => token && !/^\s+$/.test(token));
  let index = -1;
  return tokens
    .map((token) => {
      if (!token || /^\s+$/.test(token)) return token;
      index += 1;
      const previous = words[index - 1] ?? '';
      const edge =
        index === 0 || index === words.length - 1 || /[:?!.]$/.test(previous) || !/[\p{L}\p{N}]/u.test(previous);
      const markLead = words[index + 1]?.includes('™') ?? false;
      const parts = token.split(/([-/])/);
      return parts
        .map((part) => {
          const [, lead, core, tail] = part.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/su);
          if (!/^\p{L}/u.test(core) || /[.@]/.test(core)) return part;
          if (parts.length === 1 && MINOR_WORDS.has(core.toLowerCase())) {
            if (!edge && markLead) return part;
            return lead + (edge ? core[0].toUpperCase() + core.slice(1) : core.toLowerCase()) + tail;
          }
          const first = core[0];
          return first === first.toLowerCase() && !/\p{Lu}/u.test(core.slice(1)) ? lead + first.toUpperCase() + core.slice(1) + tail : part;
        })
        .join('');
    })
    .join('');
}

// Pre-read every page so the sidebar can use real titles.
const meta = new Map(
  pages.map((page) => {
    const markdown = readFileSync(path.join(ROOT, page, 'README.md'), 'utf8');
    return [page, { markdown, title: titleOf(markdown, page ? label(path.basename(page)) : SITE) }];
  }),
);

function relLink(from, to) {
  const up = from ? '../'.repeat(from.split('/').length) : '';
  return to === '' ? `${up}` : `${up}${to}/`;
}

/** The sections in reading order, each with its pages. */
function groups() {
  const sections = new Map();
  for (const page of pages) {
    if (!page || !page.includes('/')) continue;
    const [section] = page.split('/');
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section).push(page);
  }
  // Top-level pages group under their own name; a section's own index page
  // leads its section (e.g. policies/ atop the Policies group).
  for (const page of pages) {
    if (!page || page.includes('/')) continue;
    if (sections.has(page)) sections.get(page).unshift(page);
    else sections.set(page, [page]);
  }

  const ordered = [...sections.keys()].sort((a, b) => {
    const [ia, ib] = [SECTION_ORDER.indexOf(a), SECTION_ORDER.indexOf(b)];
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });

  return ordered.map((section) => ({ section, pages: sections.get(section).sort() }));
}

/** The contents down the side: the home page, then one group per section, the page itself marked current. */
function sectionsFor(current) {
  const home = { label: meta.get('').title, href: relLink(current, '') || './', current: current === '' };
  return [
    { links: [home] },
    ...groups().map(({ section, pages: members }) => ({
      heading: label(section),
      links: members.map((page) => ({ label: meta.get(page).title, href: relLink(current, page), current: page === current })),
    })),
  ];
}

function gitDate(page) {
  try {
    // Argument array, not a shell: page paths never reach an interpreter.
    const file = path.join(ROOT, page, 'README.md');
    return execFileSync('git', ['log', '-1', '--format=%as', '--', file], { cwd: ROOT })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function lastUpdated(page) {
  const date = gitDate(page);
  return date ? `Last updated ${date}.` : '';
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
const decodeEntities = (text) =>
  text.replaceAll(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (whole, dec, hex, name) =>
    dec ? String.fromCodePoint(Number(dec)) : hex ? String.fromCodePoint(parseInt(hex, 16)) : (ENTITIES[name] ?? whole),
  );

// The text of an HTML fragment: everything outside a tag. It is scanned rather
// than matched, so a tag split by another (`<scr<b>ipt>`) cannot survive it the
// way it survives a single replace.
function plainText(html) {
  let out = '';
  let open = 0;
  for (const char of html) {
    if (char === '<') open += 1;
    else if (char === '>' && open > 0) open -= 1;
    else if (open === 0) out += char;
  }
  return out;
}

// A page's own headings for the rail beside it: every h2 and h3 with the id the
// heading renderer gave it. A page with a single heading has nothing to list.
const MIN_RAIL_HEADINGS = 2;
function headingsOf(html) {
  const headings = [...html.matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)].map(([, depth, id, inner]) => ({
    label: decodeEntities(plainText(inner)).trim(),
    href: `#${id}`,
    depth: Number(depth),
  }));
  return headings.length >= MIN_RAIL_HEADINGS ? headings : [];
}

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const id = text
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(/[^a-z0-9 -]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

/**
 * The package stylesheet as one file. styles.css is a chain of @imports whose
 * fonts sit beside the package; the copy step publishes them under ASSETS, so
 * the chain is resolved here and the font URLs point at the published copy.
 */
function packageStylesheet() {
  const entry = fileURLToPath(import.meta.resolve('@cuesoftinc/design-system/styles.css'));
  const inline = (file) =>
    readFileSync(file, 'utf8').replaceAll(/@import\s+['"]([^'"]+)['"]\s*;/g, (_, spec) =>
      inline(path.resolve(path.dirname(file), spec)),
    );
  const css = inline(entry).replaceAll("url('../assets/fonts/", `url('${ASSETS}/fonts/`);
  if (/@import/.test(css)) throw new Error('the package stylesheet has an @import the build does not resolve');
  if (/url\(['"]?\.\.?\//.test(css)) throw new Error('the package stylesheet has a relative url() the build does not publish');
  return css;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), {
  recursive: true,
  filter: (source) => {
    const rel = path.relative(path.join(ROOT, 'assets'), source).split(path.sep).join('/');
    return !rel.startsWith('design-system') || PUBLISHED.some((pattern) => pattern.test(rel));
  },
});
writeFileSync(path.join(OUT, 'assets/design-system.css'), packageStylesheet());
if (rumOn) {
  if (!existsSync(RUM_SDK)) throw new Error('@datadog/browser-rum is not installed; run npm ci');
  mkdirSync(path.join(OUT, 'assets/vendor'), { recursive: true });
  cpSync(RUM_SDK, path.join(OUT, 'assets/vendor/datadog-rum.js'));
  cpSync(path.join(ROOT, 'templates/rum.js'), path.join(OUT, 'assets/rum.js'));
}
const rumTags = rumOn
  ? [
      `<script id="dd-rum-config" type="application/json">${JSON.stringify({
        applicationId: RUM.applicationId,
        clientToken: RUM.clientToken,
        site: 'datadoghq.com',
        service: PACKAGE.name,
        version: PACKAGE.version,
        host: new URL(BASE).hostname,
      }).replaceAll('<', '\\u003c')}</script>`,
      '<script src="/assets/vendor/datadog-rum.js" defer></script>',
      '<script src="/assets/rum.js" defer></script>',
    ].join('\n    ')
  : '';
if (existsSync(path.join(ROOT, 'CNAME'))) cpSync(path.join(ROOT, 'CNAME'), path.join(OUT, 'CNAME'));
if (existsSync(path.join(ROOT, 'llms.txt'))) {
  // The family's llms.txt is plain ASCII: marks spelled (TM).
  const plain = (text) => text.replaceAll('™', '(TM)');
  const listed = [...(pages.includes('') ? [''] : []), ...groups().flatMap(({ pages: members }) => members)];
  const list = listed
    .map((page) => `- [${plain(meta.get(page).title)}](${BASE}/${page ? `${page}/` : ''})`)
    .join('\n');
  writeFileSync(
    path.join(OUT, 'llms.txt'),
    readFileSync(path.join(ROOT, 'llms.txt'), 'utf8').replace('{{pages}}', () => list),
  );
}
cpSync(path.join(ROOT, 'assets/favicon.ico'), path.join(OUT, 'favicon.ico'));
writeFileSync(path.join(OUT, '.nojekyll'), '');

// The static markup carries no client code, so the theme control ships both
// marks and the page script shows the one that applies.
const themeToggle = h(ThemeToggle, {
  storageKey: THEME_KEY,
  icon: h(
    'span',
    { className: 'theme-marks' },
    h('span', { 'data-theme-mark': 'moon' }, h(Icon, { name: 'moon' })),
    h('span', { 'data-theme-mark': 'sun', hidden: true }, h(Icon, { name: 'sun' })),
  ),
});

// React hoists an image preload for each lockup art ahead of the markup; both
// arts are already in the page, so the preloads only repeat them.
const render = (element) => renderToStaticMarkup(element).replace(/^(?:<link rel="preload" as="image"[^>]*\/>)+/, '');

const header = render(
  h(DocHeader, {
    brand: h(Lockup, { ...LOCKUP, height: 30 }),
    brandHref: 'https://cuesoft.io',
    links: DOCUMENTS.map((document) => ({ ...document, current: document.href === BASE })),
    tools: themeToggle,
  }),
);
const skip = render(h(SkipLink, { href: '#main' }));
const legal = render(
  h(DocLegal, { copyright: { owner: 'Cuesoft Inc.', year: new Date().getFullYear() }, links: LEGAL_LINKS }),
);

/** The template with its {{slots}} filled; a slot the build does not fill is an error. */
const fill = (values) =>
  template.replaceAll(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`templates/page.html names {{${key}}}, which the build does not fill`);
    return values[key];
  });

const hasSidebar = pages.some((p) => p !== '');
for (const page of pages) {
  const { markdown, title } = meta.get(page);
  const parsed = marked.parse(markdown);

  // The document's first heading is the shell's title, the bold effective date
  // under it is the shell's date and the opening paragraph is its lede;
  // everything after is the document.
  const heading = parsed.match(/^<h1 id="([^"]*)">([\s\S]*?)<\/h1>\n/);
  if (!heading) throw new Error(`${page || 'README.md'} does not open with a level-one heading`);
  let rest = parsed.slice(heading[0].length);
  const effective = rest.match(/^<p><strong>(Effective date:[^<]*)<\/strong><\/p>\n/);
  if (effective) rest = rest.slice(effective[0].length);
  // The opening paragraph is the shell's lede, set larger under the title.
  const opening = rest.match(/^<p>([\s\S]*?)<\/p>\n/);
  if (opening) rest = rest.slice(opening[0].length);
  // Tables scroll inside a wrapper instead of widening the page on phones.
  const body = rest.replaceAll('<table>', '<div class="table-wrap"><table>').replaceAll('</table>', '</table></div>');

  // Crumbs carry the same names the sidebar shows: a page's H1 where the
  // segment is a page, the section label otherwise, and only pages link.
  const root = page ? '../'.repeat(page.split('/').length) : './';
  const crumbs = [{ label: SITE, href: root }];
  const crumbList = [{ name: SITE, item: `${BASE}/` }];
  if (page) {
    const parts = page.split('/');
    parts.forEach((part, index) => {
      const prefix = parts.slice(0, index + 1).join('/');
      const text = meta.has(prefix) ? meta.get(prefix).title : label(part);
      const isLast = index === parts.length - 1;
      crumbs.push(
        isLast
          ? { label: text, current: true }
          : meta.has(prefix)
            ? { label: text, href: '../'.repeat(parts.length - 1 - index) }
            : { label: text },
      );
      if (isLast || meta.has(prefix)) crumbList.push({ name: text, item: `${BASE}/${prefix}/` });
    });
  }

  const shell = renderToStaticMarkup(
    h(DocShell, {
      breadcrumb: crumbs,
      title: '@@TITLE@@',
      effectiveDate: effective ? '@@EFFECTIVE@@' : undefined,
      lede: opening ? '@@LEDE@@' : undefined,
      sections: hasSidebar ? sectionsFor(page) : [],
      onThisPage: headingsOf(body),
      updated: lastUpdated(page) || undefined,
      children: '@@BODY@@',
    }),
  )
    .replace('<h1 ', () => `<h1 id="${heading[1]}" `)
    .replace('@@TITLE@@', () => heading[2])
    .replace('@@EFFECTIVE@@', () => (effective ? effective[1] : ''))
    .replace('@@LEDE@@', () => (opening ? opening[1] : ''))
    .replace('@@BODY@@', () => body);

  const canonical = page ? `${BASE}/${page}/` : `${BASE}/`;
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: title,
        url: canonical,
        isPartOf: { '@type': 'WebSite', name: SITE, url: `${BASE}/` },
        publisher: { '@type': 'Organization', name: 'Cuesoft', url: 'https://cuesoft.io' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbList.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
    ],
  });

  const values = {
    // When the page title and site name overlap, the longer one stands alone:
    // never "The Cuesoft Handbook | Cuesoft Handbook". Escaped once for every
    // context it lands in, including meta attributes.
    doc_title: escapeHtml(titleCase(SITE.includes(title) ? SITE : title.includes(SITE) ? title : `${title} | ${SITE}`)),
    site: SITE,
    og_alt: escapeHtml(CARD.alt),
    description: escapeHtml(descriptionOf(markdown)),
    canonical,
    base: BASE,
    og_type: page ? 'article' : 'website',
    jsonld,
    skip,
    robots: '',
    header,
    shell,
    legal,
    rum: rumTags,
  };

  const target = path.join(OUT, page, 'index.html');
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, fill(values));
}

// GitHub Pages serves a root 404.html, with a 404 status, for any address the
// site does not hold. It is the same page around the design system's not-found
// band: no contents or rails, one way back to the root, kept out of the index.
{
  const home = DOCUMENTS.find((document) => document.href === BASE)?.label ?? SITE;
  const title = 'Page Not Found';
  const canonical = `${BASE}/404.html`;
  const description = `That page is not here. Go back to the ${SITE} home page.`;
  writeFileSync(
    path.join(OUT, '404.html'),
    fill({
      doc_title: escapeHtml(`${title} | ${SITE}`),
      site: SITE,
      og_alt: escapeHtml(CARD.alt),
      description: escapeHtml(description),
      canonical,
      base: BASE,
      og_type: 'website',
      jsonld: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        url: canonical,
        isPartOf: { '@type': 'WebSite', name: SITE, url: `${BASE}/` },
        publisher: { '@type': 'Organization', name: 'Cuesoft', url: 'https://cuesoft.io' },
      }),
      robots: '\n    <meta name="robots" content="noindex, follow" />',
      skip,
      header,
      shell: renderToStaticMarkup(
        h(NotFound, { eyebrow: 'Not found', title: 'That page is not here.', action: { label: `Back to ${home}`, href: '/' } }),
      ),
      legal,
      rum: rumTags,
    }),
  );
}

// Crawlers get the same map readers do.
writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((page) => {
      const loc = page ? `${BASE}/${page}/` : `${BASE}/`;
      const date = gitDate(page);
      return `  <url><loc>${loc}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`;
    })
    .join('\n')}\n</urlset>\n`,
);
writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);

for (const [from, to] of Object.entries(REDIRECTS)) {
  const target = path.join(OUT, from, 'index.html');
  mkdirSync(path.dirname(target), { recursive: true });
  const dest = `/${to}/`;
  writeFileSync(
    target,
    `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta http-equiv="refresh" content="0; url=${dest}" /><link rel="canonical" href="${dest}" /><title>Moved</title></head><body><p>This page moved to <a href="${dest}">${dest}</a>.</p></body></html>\n`,
  );
}

console.log(`built ${pages.length} page(s) and 404.html into _site/ (+${Object.keys(REDIRECTS).length} redirect stub(s))`);
