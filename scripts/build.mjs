// Static site generator for the Cuesoft legal & handbook sites: every folder
// with a README.md becomes a route, rendered into the brand template. One
// script, vendored identically across handbook, terms and privacy-policy —
// the same parity rule the website repos live by.
//
//   node scripts/build.mjs      → writes _site/
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
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

const template = readFileSync(path.join(ROOT, 'templates/page.html'), 'utf8');

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

function sidebarFor(current) {
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
  if (sections.size === 0) return '';

  const ordered = [...sections.keys()].sort((a, b) => {
    const [ia, ib] = [SECTION_ORDER.indexOf(a), SECTION_ORDER.indexOf(b)];
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });

  const groups = ordered
    .map((section) => {
      const items = sections
        .get(section)
        .sort()
        .map((page) => {
          const href = relLink(current, page);
          const mark = page === current ? " aria-current='page'" : '';
          return `<li><a href="${href}"${mark}>${meta.get(page).title}</a></li>`;
        })
        .join('');
      return `<div class="section"><span>${label(section)}</span><ul>${items}</ul></div>`;
    })
    .join('');
  return `<nav class="sidebar" aria-label="Handbook sections">${groups}</nav>`;
}

function relLink(from, to) {
  const up = from ? '../'.repeat(from.split('/').length) : '';
  return to === '' ? `${up}` : `${up}${to}/`;
}

function tocFor(html) {
  const headings = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)];
  if (headings.length < 4) return '';
  const items = headings
    .map(([, id, text]) => `<li><a href="#${id}">${text.replace(/<[^>]+>/g, '')}</a></li>`)
    .join('');
  return `<nav class="toc" aria-label="Contents"><span>Contents</span><ol>${items}</ol></nav>`;
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

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
if (existsSync(path.join(ROOT, 'CNAME'))) cpSync(path.join(ROOT, 'CNAME'), path.join(OUT, 'CNAME'));
writeFileSync(path.join(OUT, '.nojekyll'), '');

const hasSidebar = pages.some((p) => p !== '');
for (const page of pages) {
  const { markdown, title } = meta.get(page);
  // Tables scroll inside a wrapper instead of widening the page on phones.
  const body = marked
    .parse(markdown)
    .replaceAll('<table>', '<div class="table-wrap"><table>')
    .replaceAll('</table>', '</table></div>');
  const root = page ? '../'.repeat(page.split('/').length) : './';
  // Crumbs carry the same names the sidebar shows: a page's H1 where the
  // segment is a page, the section label otherwise — and only pages link.
  const crumbs = [`<a href="${root}">${SITE}</a>`];
  const crumbList = [{ name: SITE, item: `${BASE}/` }];
  if (page) {
    const parts = page.split('/');
    parts.forEach((part, index) => {
      const prefix = parts.slice(0, index + 1).join('/');
      const text = meta.has(prefix) ? meta.get(prefix).title : label(part);
      const isLast = index === parts.length - 1;
      crumbs.push(
        isLast || !meta.has(prefix)
          ? text
          : `<a href="${'../'.repeat(parts.length - 1 - index)}">${text}</a>`,
      );
      if (isLast || meta.has(prefix)) crumbList.push({ name: text, item: `${BASE}/${prefix}/` });
    });
  }

  const canonical = page ? `${BASE}/${page}/` : `${BASE}/`;
  const description = escapeHtml(descriptionOf(markdown));
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: title,
        url: canonical,
        isPartOf: { '@type': 'WebSite', name: SITE, url: `${BASE}/` },
        publisher: { '@type': 'Organization', name: 'Cuesoft Inc.', url: 'https://cuesoft.io' },
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

  const html = template
    .replaceAll(
      '{{doc_title}}',
      // When the page title and site name overlap, the longer one stands
      // alone — never "The Cuesoft Handbook | Cuesoft Handbook". Escaped
      // once for every context it lands in, including meta attributes.
      escapeHtml(
        SITE.includes(title) ? SITE : title.includes(SITE) ? title : `${title} | ${SITE}`,
      ),
    )
    .replaceAll('{{site}}', SITE)
    .replaceAll('{{description}}', description)
    .replaceAll('{{canonical}}', canonical)
    .replaceAll('{{base}}', BASE)
    .replaceAll('{{og_type}}', page ? 'article' : 'website')
    .replaceAll('{{jsonld}}', jsonld)
    .replaceAll('{{root}}', root)
    .replaceAll('{{layout_class}}', hasSidebar ? 'with-sidebar' : 'single')
    .replaceAll('{{sidebar}}', hasSidebar ? sidebarFor(page) : '')
    .replaceAll('{{breadcrumb}}', crumbs.join(' <span aria-hidden="true">/</span> '))
    .replaceAll(
      '{{content}}',
      // Single-page sites get a table of contents after the title and its
      // opening line, not above them.
      page === '' && !hasSidebar ? body.replace('</p>', `</p>\n${tocFor(body)}`) : body,
    )
    .replaceAll('{{updated}}', lastUpdated(page))
    .replaceAll('{{year}}', String(new Date().getFullYear()));

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
