/**
 * Renders the link card, the 1200x628 image that WhatsApp, LinkedIn, X and Slack
 * unfurl, from scripts/og-card.config.mjs and the installed
 * @cuesoftinc/design-system, and records what it was rendered from in
 * scripts/og-image.manifest.json. This file is byte-identical in every Cuesoft
 * site; only the config differs.
 *
 *   node scripts/generate-og-image.mjs
 *
 * The frame is the Figma link card (page 09, 674:148) as the package's
 * layout-spacing guideline states it: 1200x628, margin 48, the Cuesoft mark 70x45
 * at the top right, copy in a 600 wide column on the left.
 *
 * Weight, tracking, case and the headline's size, leading and measure come from
 * the package's type roles, so a type-scale change follows on the next render.
 * The package ships no media type scale, so the sub-line, eyebrow and button
 * sizes are the DS 1200x628 template's (campaign-wide-1200x628.html) and stay
 * pinned here until it does.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import CARD from './og-card.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const MANIFEST = join(HERE, 'og-image.manifest.json');
const PACKAGE_NAME = '@cuesoftinc/design-system';

const CANVAS = { width: 1200, height: 628 };
const MARGIN = 48;
const COLUMN = 600;
const MARK = { width: 70, height: 45, top: 50 };
const COPY_TOP = 121;

// DS 1200x628 template: chip 24, sub-line 30/42, button label 32. The headline steps
// are the media scale's; the card takes the largest whose copy fits the column.
const EYEBROW_SIZE = 22;
const BUTTON_SIZE = 24;
const SUB_STEPS = [
  [30, 42],
  [28, 40],
  [24, 34],
];
const HEADLINE_STEPS = [72, 64, 56, 48];
const HEADLINE_FLOOR = 56;
const SUB_FLOOR = 28;

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

function packageDir() {
  return dirname(
    createRequire(import.meta.url).resolve(`${PACKAGE_NAME}/package.json`),
  );
}

function token(css, name) {
  const found = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!found) throw new Error(`design-system token ${name} not found`);
  return found[1];
}

/** A type role as the package's type sheet declares it; desktop takes the widest rule. */
function role(css, name, { desktop = false } = {}) {
  const rules = [
    ...css.matchAll(new RegExp(`\\.ds-t-${name} \\{([^}]*)\\}`, 'g')),
  ];
  const rule = rules[desktop ? rules.length - 1 : 0]?.[1];
  if (!rule) throw new Error(`design-system type role ${name} not found`);
  const pick = (prop) => rule.match(new RegExp(`${prop}:\\s*([^;]+);`))?.[1];
  const size = Number.parseFloat(pick('font-size'));
  const leading = Number.parseFloat(pick('line-height'));
  return {
    size,
    leading: Number.isNaN(leading) ? undefined : leading,
    measure: pick('max-width'),
    style: [
      `font-weight: ${pick('font-weight')}`,
      `letter-spacing: ${pick('letter-spacing') ?? 'normal'}`,
      `text-transform: ${pick('text-transform') ?? 'none'}`,
    ].join('; '),
  };
}

/** Everything the card is drawn from, as one HTML document. No clock, no absolute path. */
export async function cardHtml() {
  const dir = packageDir();
  const read = (path) => readFile(join(dir, path), 'utf8');
  const dataUri = async (path, mime) =>
    `data:${mime};base64,${(await readFile(join(dir, path))).toString('base64')}`;

  const product = CARD.set === 'product';
  const web = await read('tokens/web.css');
  const type = (await read('styles/type.css')).replace(
    /:where\(\.ds-product\)[^\n]*\n/g,
    '',
  );
  const WHITE = token(web, '--brand-white');
  const BLACK = token(web, '--brand-black');
  const GROUND = token(web, product ? CARD.tokens.deep : '--brand-blue');
  const ACCENT = token(web, product ? CARD.tokens.lift : '--brand-lime');
  const BUTTON = token(web, product ? CARD.tokens.brand : '--brand-lime');
  const RADIUS = product
    ? (web.match(/--radius-product-md:\s*(\d+px)/)?.[1] ?? '6px')
    : '0';

  const eyebrow = role(type, product ? 'product-eyebrow' : 'eyebrow');
  const display = role(type, product ? 'product-display' : 'display', {
    desktop: true,
  });
  const lede = role(type, product ? 'product-body' : 'lede');
  const cta = role(type, product ? 'product-cta' : 'cta');
  if (display.leading === undefined) {
    throw new Error('design-system display role has no line height');
  }
  const headlines = [
    display.size,
    ...HEADLINE_STEPS.filter((step) => step < display.size),
  ].map((size) => [size, Math.round((size * display.leading) / display.size)]);

  let ground = '';
  let groundCss = '';
  if (CARD.ground === 'rings') {
    const rings = (await read('styles/components.css')).match(
      /\.ds-phero__rings \{([^}]*)\}/,
    )?.[1];
    if (!rings) throw new Error('design-system hero rings not found');
    groundCss = `.rings { ${rings} --ds-phero-ring-x: calc(100% - 240px); }`;
    ground = '<div class="rings" aria-hidden="true"></div>';
  } else {
    groundCss = await read('styles/patterns.css');
    ground = `<div class="ds-pattern ds-pattern--${CARD.ground}" ${CARD.opacity ? `style="--ds-pattern-opacity: ${CARD.opacity}"` : ''} aria-hidden="true"></div>`;
  }

  const faces = [
    ['Fustat', '200 800', 'Fustat-VariableFont_wght.ttf'],
    ...(product
      ? [
          ['Inter', '100 900', 'Inter-VariableFont_opsz_wght.ttf'],
          ['JetBrains Mono', '100 800', 'JetBrainsMono-VariableFont_wght.ttf'],
        ]
      : []),
  ];
  const fontFaces = [];
  for (const [family, weight, file] of faces) {
    fontFaces.push(
      `@font-face { font-family: '${family}'; font-weight: ${weight};
    src: url('${await dataUri(`assets/fonts/${file}`, 'font/ttf')}') format('truetype-variations'); }`,
    );
  }

  const mark = await dataUri(
    'assets/logos-official/cuesoft-icon-white.png',
    'image/png',
  );
  let left;
  if (product) {
    const lockup = await dataUri(
      `assets/logos-official/${CARD.lockup}`,
      'image/png',
    );
    left = `<span class="brand"><img class="lockup" src="${lockup}" alt="">${
      CARD.label ? `<span class="label">${CARD.label}</span>` : ''
    }</span>`;
  } else {
    left = `<span class="eyebrow">${CARD.eyebrow}</span>`;
  }

  const mono = "'JetBrains Mono', ui-monospace, monospace";
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  ${fontFaces.join('\n  ')}
  ${groundCss}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { position: relative; width: ${CANVAS.width}px; height: ${CANVAS.height}px; overflow: hidden;
    background: ${GROUND}; color: ${WHITE}; font-family: ${product ? 'Inter' : 'Fustat'}, sans-serif;
    -webkit-font-smoothing: antialiased; }
  .furniture { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: ${MARK.top}px; height: ${MARK.height}px;
    display: flex; align-items: center; justify-content: space-between; }
  .eyebrow { font-size: ${EYEBROW_SIZE}px; line-height: 1; color: ${ACCENT}; ${eyebrow.style} }
  .brand { display: flex; align-items: center; gap: 20px; }
  .lockup { height: ${MARK.height}px; }
  .label { padding-left: 20px; border-left: 1px solid rgb(255 255 255 / 0.2); font-family: ${mono}; font-size: 20px; line-height: 1; color: rgb(255 255 255 / 0.84); ${eyebrow.style} }
  .mark { width: ${MARK.width}px; height: ${MARK.height}px; object-fit: contain; }
  .stage { position: absolute; left: ${MARGIN}px; top: ${COPY_TOP}px; bottom: ${MARGIN}px; width: ${COLUMN}px;
    display: flex; flex-direction: column; justify-content: center; gap: 32px; }
  .copy { display: flex; flex-direction: column; align-items: flex-start; gap: 24px; }
  .kicker { font-family: ${mono}; font-size: ${EYEBROW_SIZE}px; line-height: 1; color: ${ACCENT}; ${eyebrow.style} }
  h1 { font-family: Fustat, sans-serif; max-width: ${display.measure ?? 'none'}; text-wrap: balance; ${display.style} }
  .sub { text-wrap: pretty; color: ${product ? 'rgb(255 255 255 / 0.8)' : WHITE}; ${lede.style} }
  .cta { display: flex; align-items: center; gap: 28px; }
  .button { flex: none; white-space: nowrap; padding: 20px 32px; font-size: ${BUTTON_SIZE}px; line-height: 1; border-radius: ${RADIUS}; background: ${BUTTON}; color: ${product ? WHITE : BLACK}; ${cta.style} }
  .destination { font-family: ${product ? mono : 'Fustat, sans-serif'}; font-size: ${EYEBROW_SIZE}px; line-height: 1; ${eyebrow.style} }
</style></head>
<body data-headlines="${headlines.map((step) => step.join('/')).join(' ')}" data-subs="${SUB_STEPS.map((step) => step.join('/')).join(' ')}" data-headline-floor="${HEADLINE_FLOOR}" data-sub-floor="${SUB_FLOOR}">
  ${ground}
  <div class="furniture">
    ${left}
    ${CARD.publisher === false ? '' : `<img class="mark" src="${mark}" alt="">`}
  </div>
  <div class="stage">
    <div class="copy">
      ${product ? `<span class="kicker">${CARD.eyebrow}</span>` : ''}
      <h1>${CARD.headline.replaceAll('\n', '<br>')}</h1>
      <p class="sub">${CARD.sub}</p>
    </div>
    <div class="cta">${CARD.cta ? `<span class="button">${CARD.cta}</span>` : ''}<span class="destination">${CARD.destination}</span></div>
  </div>
</body></html>`;
}

/** What the committed image must have been rendered from. */
export async function cardInputs() {
  return {
    package: PACKAGE_NAME,
    version: JSON.parse(
      await readFile(join(packageDir(), 'package.json'), 'utf8'),
    ).version,
    generator: sha256(await readFile(fileURLToPath(import.meta.url))),
    html: sha256(await cardHtml()),
  };
}

function pngSize(png) {
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

/** Problems with the committed card and manifest; empty when the card is current. */
export async function verifyCard() {
  const problems = [];
  const fix = 'run `npm run og` and commit the image and the manifest';
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  const inputs = await cardInputs();
  const pin = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'))
    .dependencies?.[PACKAGE_NAME];
  if (pin !== inputs.version) {
    problems.push(
      `installed ${PACKAGE_NAME} is ${inputs.version}, package.json pins ${pin}`,
    );
  }
  if (manifest.version !== inputs.version) {
    problems.push(
      `card rendered on ${PACKAGE_NAME} ${manifest.version}, installed is ${inputs.version}: ${fix}`,
    );
  }
  if (manifest.generator !== inputs.generator) {
    problems.push(`generate-og-image.mjs changed since the card: ${fix}`);
  }
  if (manifest.html !== inputs.html) {
    problems.push(
      `og-card.config.mjs or the package files it reads changed since the card: ${fix}`,
    );
  }
  const png = await readFile(join(ROOT, CARD.output));
  if (sha256(png) !== manifest.image) {
    problems.push(
      `${CARD.output} is not the image the manifest records: ${fix}`,
    );
  }
  const { width, height } = pngSize(png);
  if (width !== CANVAS.width || height !== CANVAS.height) {
    problems.push(
      `${CARD.output} is ${width}x${height}, the link card is ${CANVAS.width}x${CANVAS.height}`,
    );
  }
  return problems;
}

async function render() {
  const { chromium } = await import('@playwright/test');
  const html = await cardHtml();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: CANVAS,
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() =>
      Promise.all([...document.fonts].map((face) => face.load())),
    );
    await page.evaluate(() => document.fonts.ready);
    const fit = await page.evaluate(() => {
      const steps = (name) =>
        document.body.dataset[name]
          .split(' ')
          .map((s) => s.split('/').map(Number));
      const stage = document.querySelector('.stage');
      const h1 = document.querySelector('h1');
      const sub = document.querySelector('.sub');
      const fits = () => {
        const used = [...stage.children].reduce(
          (sum, child) => sum + child.getBoundingClientRect().height,
          0,
        );
        const gap = Number.parseFloat(getComputedStyle(stage).rowGap);
        return used + gap * (stage.children.length - 1) <= stage.clientHeight;
      };
      const { headlineFloor, subFloor } = document.body.dataset;
      const passes = [
        [Number(headlineFloor), Number(subFloor)],
        [0, 0],
      ];
      for (const [headlineMin, subMin] of passes) {
        for (const [size, leading] of steps('headlines')) {
          if (size < headlineMin) continue;
          h1.style.fontSize = `${size}px`;
          h1.style.lineHeight = `${leading}px`;
          for (const [subSize, subLeading] of steps('subs')) {
            if (subSize < subMin) continue;
            sub.style.fontSize = `${subSize}px`;
            sub.style.lineHeight = `${subLeading}px`;
            if (fits()) return { headline: size, sub: subSize };
          }
        }
      }
      return null;
    });
    if (!fit) throw new Error('the copy does not fit the card; shorten it');
    const png = await page.screenshot({ type: 'png' });
    await writeFile(join(ROOT, CARD.output), png);
    const inputs = await cardInputs();
    await writeFile(
      MANIFEST,
      `${JSON.stringify({ ...inputs, image: sha256(png), fit }, null, 2)}\n`,
    );
    console.log(
      `wrote ${CARD.output} (${CANVAS.width}x${CANVAS.height}, headline ${fit.headline}, sub ${fit.sub})`,
    );
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await render();
}
