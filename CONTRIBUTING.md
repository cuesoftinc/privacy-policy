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
npm run build       # writes _site/
npm run lint        # cuesoft-design-check corporate
npm run check:links # every link, image, font and #fragment in _site resolves
```

Without that access you can still edit the Markdown and open a pull request;
a maintainer builds it.

## Shared files

`scripts/build.mjs` (bar the knob block at its top), `scripts/check-links.mjs`,
`templates/page.html`, `.github/workflows/pages.yml`, `.npmrc` and the
browser icons under `assets/` are identical in handbook, terms and
privacy-policy. Change one, change all three.

## Commits

Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`), one line, and
never commit credentials.
