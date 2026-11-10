import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

import CARD from './og-card.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
// The card is drawn by the library's own renderer, the cuesoft-og-card bin.
const library = dirname(
  createRequire(import.meta.url).resolve(
    '@cuesoftinc/design-system/package.json',
  ),
);
const og = await import(pathToFileURL(join(library, 'bin/og-card.mjs')).href);
const verifyCard = () => og.verifyCard(CARD, join(HERE, '..'));
const cardInputs = () => og.cardInputs(CARD);
// Problem prefixes of the three checks that compare the card with the installed package.
const INSTALLED_CHECKS = [
  'installed ',
  'card rendered on ',
  'og-card.config.mjs or the package files',
];

let problems = await verifyCard();
if (process.env.DESIGN_SYSTEM_LINKED === '1') {
  const inputs = await cardInputs();
  const pin = JSON.parse(
    await readFile(join(HERE, '..', 'package.json'), 'utf8'),
  ).dependencies?.[inputs.package];
  if (inputs.version !== pin) {
    const manifest = JSON.parse(
      await readFile(join(HERE, 'og-image.manifest.json'), 'utf8'),
    );
    problems = problems.filter(
      (problem) =>
        !INSTALLED_CHECKS.some((prefix) => problem.startsWith(prefix)),
    );
    if (manifest.package !== inputs.package) {
      problems.push(
        `manifest records ${manifest.package}, the card is rendered from ${inputs.package}`,
      );
    }
    if (manifest.version !== pin) {
      problems.push(
        `card rendered on ${inputs.package} ${manifest.version}, package.json pins ${pin}: run \`npm run og\` and commit the image and the manifest`,
      );
    }
    console.log(
      `og card: linked design-system ${inputs.version} over pin ${pin}; checked against the pin, skipped installed, manifest-installed and html`,
    );
  }
}
for (const problem of problems) console.error(`og card: ${problem}`);
if (problems.length > 0) process.exit(1);
console.log('og card: current');
