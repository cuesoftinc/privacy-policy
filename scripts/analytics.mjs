// Consent-gated Google Analytics for the static pages. The banner is the design
// system's own ConsentBanner rendered at build time, worded as the corporate
// sites word it; templates/consent.js is the library TrackingConsent's behaviour
// in plain browser code. A build whose measurement ID is empty or malformed gets
// neither: no banner, no script, no footer control. Vendored identically across
// handbook, terms and privacy-policy.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement as h, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ConsentBanner, Link } from '@cuesoftinc/design-system/corporate';

const SCRIPT = readFileSync(
  path.join(import.meta.dirname, '../templates/consent.js'),
  'utf8',
);
if (SCRIPT.includes('</script'))
  throw new Error('templates/consent.js cannot be inlined: it closes a script');

export const MEASUREMENT_ID = /^G-[A-Z0-9]{4,}$/;
export const analyticsOn = (measurementId) =>
  typeof measurementId === 'string' && MEASUREMENT_ID.test(measurementId);

// The corporate sites' sentence, their privacy link and their footer control.
export const MESSAGE =
  'We use cookies for analytics, only if you accept.';
export const POLICY = {
  label: 'Privacy policy',
  href: 'https://privacy.cuesoft.io/collection/docs-sites/',
};
export const PREFERENCES = 'Cookie preferences';

const KEY_PATTERN = /^[a-z0-9-]+$/;

/**
 * The head and body markup of the consent bar and its script, or two empty
 * strings when the measurement ID is not a GA4 one.
 */
export function consentMarkup({ measurementId, storageKey }) {
  if (!analyticsOn(measurementId)) return { head: '', body: '' };
  if (!KEY_PATTERN.test(storageKey))
    throw new Error(`consent storage key "${storageKey}" is not [a-z0-9-]+`);
  const bar = renderToStaticMarkup(
    h(ConsentBanner, {
      open: true,
      message: h(
        Fragment,
        null,
        MESSAGE,
        ' ',
        h(
          Link,
          {
            href: POLICY.href,
            target: '_blank',
            rel: 'noreferrer noopener',
          },
          POLICY.label,
        ),
      ),
    }),
  );
  if (!bar.startsWith('<div ') || !bar.includes('class="ds-consent"'))
    throw new Error(
      'the design system ConsentBanner markup is not as expected',
    );
  return {
    // The bar publishes its height as --ds-dock; the legal strip keeps its last line clear of it.
    head: '<style>.ds-doc-legal{padding-block-end:var(--ds-dock,0px)}</style>',
    body: [
      bar.replace(
        '<div ',
        `<div hidden data-cuesoft-consent data-measurement-id="${measurementId}" data-storage-key="${storageKey}" `,
      ),
      `<script>${SCRIPT}</script>`,
    ].join('\n    '),
  };
}

/** The rendered legal strip with the footer control that brings the bar back; hidden until the script runs. */
export function withPreferences(legalHtml, measurementId) {
  if (!analyticsOn(measurementId)) return legalHtml;
  const control = `<button type="button" hidden class="ds-link ds-t-footer ds-doc-legal__link ds-footer__utility-item ds-footer__utility-button" data-cuesoft-consent-reopen>${PREFERENCES}</button>`;
  const html = legalHtml.replace(
    /(<div class="ds-doc-legal__links">[\s\S]*?)(<\/div>)/,
    (_, links, close) => `${links}${control}${close}`,
  );
  if (html === legalHtml)
    throw new Error('the design system DocLegal has no links row to extend');
  return html;
}
