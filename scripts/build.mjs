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
  SkipLink,
  ThemeToggle,
  themePrepaintElement,
} from '@cuesoftinc/design-system/corporate';
import { marked } from 'marked';

const ROOT = path.join(import.meta.dirname, '..');
const OUT = path.join(ROOT, '_site');

// Per-repo knobs — the only lines that differ between the three repos.
const SITE = process.env.SITE_TITLE || 'Cuesoft Privacy Policy';
const DESCRIPTION =
  process.env.SITE_DESCRIPTION ||
  'What each Cuesoft website collects, why, and your rights under Nigerian, EU/UK and US law — plus the Cueprise™ Privacy Notice.';
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

/** The contents down the side: one group per section, the page itself marked current. */
function sectionsFor(current) {
  return groups().map(({ section, pages: members }) => ({
    heading: label(section),
    links: members.map((page) => ({ label: meta.get(page).title, href: relLink(current, page), current: page === current })),
  }));
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
if (existsSync(path.join(ROOT, 'CNAME'))) cpSync(path.join(ROOT, 'CNAME'), path.join(OUT, 'CNAME'));
if (existsSync(path.join(ROOT, 'llms.txt'))) {
  // The family's llms.txt is plain ASCII: marks spelled (TM), a spaced dash a colon.
  const plain = (text) => text.replaceAll('™', '(TM)').replaceAll(' — ', ': ');
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

const hasSidebar = pages.some((p) => p !== '');
for (const page of pages) {
  const { markdown, title } = meta.get(page);
  const parsed = marked.parse(markdown);

  // The document's first heading is the shell's title and the bold effective
  // date under it is the shell's date; everything after is the document.
  const heading = parsed.match(/^<h1 id="([^"]*)">([\s\S]*?)<\/h1>\n/);
  if (!heading) throw new Error(`${page || 'README.md'} does not open with a level-one heading`);
  let rest = parsed.slice(heading[0].length);
  const effective = rest.match(/^<p><strong>(Effective date:[^<]*)<\/strong><\/p>\n/);
  if (effective) rest = rest.slice(effective[0].length);
  // Tables scroll inside a wrapper instead of widening the page on phones.
  const body = rest.replaceAll('<table>', '<div class="table-wrap"><table>').replaceAll('</table>', '</table></div>');

  // Crumbs carry the same names the sidebar shows: a page's H1 where the
  // segment is a page, the section label otherwise — and only pages link.
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
      sections: hasSidebar ? sectionsFor(page) : [],
      updated: lastUpdated(page) || undefined,
      children: '@@BODY@@',
    }),
  )
    .replace('<h1 ', () => `<h1 id="${heading[1]}" `)
    .replace('@@TITLE@@', () => heading[2])
    .replace('@@EFFECTIVE@@', () => (effective ? effective[1] : ''))
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
    // When the page title and site name overlap, the longer one stands alone —
    // never "The Cuesoft Handbook | Cuesoft Handbook". Escaped once for every
    // context it lands in, including meta attributes.
    doc_title: escapeHtml(SITE.includes(title) ? SITE : title.includes(SITE) ? title : `${title} | ${SITE}`),
    site: SITE,
    description: escapeHtml(descriptionOf(markdown)),
    canonical,
    base: BASE,
    og_type: page ? 'article' : 'website',
    jsonld,
    skip,
    header,
    shell,
    legal,
  };
  const html = template.replaceAll(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`templates/page.html names {{${key}}}, which the build does not fill`);
    return values[key];
  });

  const target = path.join(OUT, page, 'index.html');
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, html);
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

console.log(`built ${pages.length} page(s) into _site/ (+${Object.keys(REDIRECTS).length} redirect stub(s))`);
