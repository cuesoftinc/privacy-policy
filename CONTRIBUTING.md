# Contributing

Every folder with a `README.md` is a page. Edit the Markdown, open a pull
request, and the checks build the site.

## Building locally

The pages are built on `@cuesoftinc/design-system`, a private package on GitHub
Packages, while this repository is public. Building needs read access to the
`@cuesoftinc` scope: export `NODE_AUTH_TOKEN` with a token that has
`read:packages`, then run:

```bash
npm ci
npm run build       # writes _site/, then fails on any em dash
npm run lint        # cuesoft-design-check corporate
npm run check:links # every link, image, font and #fragment in _site resolves
npm run og          # redraws assets/og-card.png; the build fails if the card is out of date
```

Without that access you can still edit the Markdown and open a pull request;
a maintainer builds it.

## Punctuation

No em dashes in the Markdown, the templates or the built pages: write a
colon, a comma or parentheses. `npm run build` and CI fail on one
(`scripts/check-dashes.mjs`).

## Monitoring

Pages on the live host report page performance and errors to Datadog RUM. The
build reads `NEXT_PUBLIC_DD_APPLICATION_ID` and `NEXT_PUBLIC_DD_CLIENT_TOKEN`
(Actions secrets) and ships no monitoring without them, so a local build
sends nothing. The script is the exact `@datadog/browser-rum` pin, copied
from `node_modules` at build time.

## Shared files

`scripts/build.mjs` (bar the knob block at its top), `scripts/check-links.mjs`,
`scripts/check-dashes.mjs`, `scripts/generate-og-image.mjs`, `scripts/check-og-card.mjs`,
`templates/page.html`, `templates/rum.js`,
`.github/workflows/pages.yml`, `.npmrc` and the browser icons under `assets/`
are identical in handbook, terms and privacy-policy. Change one, change all
three.

## Commits

Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`), one line, and
never commit credentials.
